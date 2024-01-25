import express from "express";
import { PrismaClient } from "@prisma/client";
//import { getCargoFromSheet } from "../scripts/googleSheets";

const prisma = new PrismaClient();
const router = express.Router();

// Define routes for /api/product here
router.get("/all", async (req, res) => {
  console.log("client get all");
  const all = await prisma.client.findMany();

  res.send(all);
});

router.delete("/", async (req, res) => {
  console.log("reached");
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

router.post("/", async (req, res) => {
  console.log("received from frontend", req.body, req.query);

  const client = await prisma.client.create({
    data: {
      id: req.body.id,
      name: req.body.name,
      staff: req.body.staff,
      payment: req.body.payment,
    },
  });

  res.send(client);
});

router.put("/", async (req, res) => {
  const record = await prisma.client.update({
    where: {
      id: req.body.id, // Assuming id is an integer; adapt as needed
    },
    data: req.body,
  });

  const clients = await prisma.client.findMany();
  res.send(clients);
});

// Export the router
export default router;
