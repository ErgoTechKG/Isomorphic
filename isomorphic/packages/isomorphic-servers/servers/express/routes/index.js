import express from "express";
import jwt from 'jsonwebtoken';
import argon2 from 'argon2';
import { PrismaClient } from '@prisma/client';

// Create an instance of the Prisma client
const prisma = new PrismaClient();

const router = express.Router();

router.get("/", (req, res) => {
  res.json({ status: "OK1" });
});

router.post("/login", (req, res) => {
  console.log("req.body", req.body);
  res.json({ status: "OK2" });
});

// Define a signup endpoint
router.post("/signup", async (req, res) => {
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
		name
      },
    });
    // Generate a JWT token
    const token = jwt.sign({ userId: newUser.id }, "your-secret-key");

    // Return the token to the client
    res.json({ token });
  } catch (error) {
    console.error("Error signing up:", error);
    res.status(500).json({ error: "An error occurred while signing up" });
  }
});

//router.post('/', createUser);
export default router;
