//import { getCargoFromSheet } from "../scripts/googleSheets";
import express from "express";
import { PrismaClient } from "@prisma/client";
import jwtDecode from "jwt-decode";

const prisma = new PrismaClient();
const router = express.Router();

// Define routes for /api/product here
router.get("/", async (req, res) => {
  const idInt = parseInt(req.query.id);
  console.log(req.query);
  const result = await prisma.client.findUnique({
    id: idInt,
  });
  res.send(result);
});

// Define routes for /api/product here
router.delete("/", async (req, res) => {
  console.log(req.query);
  const deletedClient = await prisma.client.delete({
    where: {
      id: parseInt(req.query.id),
    },
  });

  // Step 2: Fetch all products after deletion
  const allClients = await prisma.client.findMany();

  res.send(allClients);
});

router.get("/all", async (req, res) => {
  const allClients = await prisma.client.findMany();
  res.send(allClients);
});

router.post("/", async (req, res) => {
  try {
    console.log("req.body", req.body);

    const { name, staff } = req.body;
    const record = await prisma.client.create({
      data: {
        name: name,
        staff: staff,
      },
    });

    res.json(record);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "An error occurred while fetching Client records.",
    });
  }
});

router.put("/", async (req, res) => {
  console.log("req.body", req.body);
  const record = await prisma.client.update({
    where: {
      id: parseInt(req.query.id), // Assuming id is an integer; adapt as needed
    },
    data: req.body,
  });
  res.send(record);
});

// Export the router
export default router;
