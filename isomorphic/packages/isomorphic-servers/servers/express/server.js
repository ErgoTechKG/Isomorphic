import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import Config from "./config";
import { authenticate, authError } from "./middleware";
import dotenv from "dotenv";
import routes from "./routes";
import uploadRoute from "./routes/upload.js";
import winston from "winston";
import jwt from "jsonwebtoken";
import argon2 from "argon2";
import { PrismaClient } from "@prisma/client";
import { parseExcelFile } from "./excelToPostgres";


const prisma = new PrismaClient();
dotenv.config();

const { port, secretKey, expiredAfter } = Config;
const app = express();

// Create a Winston logger instance
const logger = winston.createLogger({
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: "logs.log" }),
  ],
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
});

// Set up a middleware to log requests
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

// Connect to the database

function doesUserExists(username, password) {
  console.log(username, password);
  const user = {
    id: 1,
    username: "demo@gmail.com",
    password: "demodemo",
  };
  if (username === user.username && password === user.password) {
    return true;
  }
  return false;
}

app
  .use(bodyParser.urlencoded({ extended: true }))
  .use(bodyParser.json())
  .use(cors());

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if the user exists
    const user = await prisma.user.findUnique({
      where: { email },
    });
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Verify the password
    const isPasswordValid = await argon2.verify(user.password, password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Generate a JWT token
    const token = jwt.sign(
      {
        email: user.email,
        name: user.name,
        role: user.role,
        expiredAt: new Date().getTime() + expiredAfter,
        id: user.id,
      },
      secretKey
    );

    // Return the token to the client
    res.json({ token });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ error: "An error occurred while logging in" });
  }
});

// Define a signup endpoint
app.post("/signup", async (req, res) => {
  try {
    const { email, password, name } = req.body;

    // Check if the username already exists
    const existingEmail = await prisma.user.findUnique({
      where: { email },
    });
    if (existingEmail) {
      return res.status(409).json({ error: "Email already exists" });
    }

    // Hash the password
    const hashedPassword = await argon2.hash(password);

    // Create a new user
    const newUser = await prisma.User.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
    });
    // Generate a JWT token
    const token = jwt.sign(
      { email: newUser.email, name: newUser.name, role: newUser.role },
      "your-secret-key"
    );

    // Return the token to the client
    res.json({ token });
  } catch (error) {
    console.error("Error signing up:", error);
    res.status(500).json({ error: "An error occurred while signing up" });
  }
});

// Set up routes
app.use("/api", [authenticate, authError, routes]);

// Route for handling file uploads
app.use("/upload", uploadRoute);

app.use("/api/secret", [authenticate, authError]);
app.post("/api/secret/test", (req, res) => {
  res.json({
    status: 200,
    message: "succcesful",
  });
});

app.listen(port, () => {
  logger.info("Isomorphic JWT login " + port);
});

app.get("/excel", async (req, res) => {
  const excelFile = "./test/garments.xlsx";

  try {
    await parseExcelFile(excelFile);
    res.send("Data imported successfully.");
  } catch (error) {
    console.error("Error parsing Excel file:", error);
    res.status(500).send("Error parsing Excel file.");
  } finally {
    // Remove the uploaded file
    fs.unlinkSync(excelFile);
  }
});

