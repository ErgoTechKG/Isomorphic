import express from "express";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
const router = express.Router();

// Define routes for /api/product here
router.get("/", async (req, res) => {
  const result = await prisma.product.findUnique({
    where: {
      id:parseInt(req.query.id),
    },
  })
  res.send(result);
});

// Define routes for /api/product here
router.delete("/", async (req, res) => {
  console.log(req.query)
  const deletedProduct = await prisma.product.delete({
    where: {
      id: parseInt(req.query.id),
    },
  });

  // Step 2: Fetch all products after deletion
  const allProducts = await prisma.product.findMany();

  res.send(allProducts);
});

router.get("/all", async (req, res) => {
  
});

router.post("/", async (req, res) => {

  console.log('received from frontend', req.body,req.query)
  const cargo = await prisma.cargo.upsert({
    where: { dateArrived: req.body.date },
    update: {}, // No update operation since we just want to fetch the ID if it exists
    create: { dateArrived: req.body.date  }
  });

  console.log(cargo.id);
  res.send("post product");

});


router.put("/", async (req, res) => {
  const record = await prisma.product.update({
    where: {
      id: parseInt(req.query.id)  // Assuming id is an integer; adapt as needed
    },
    data: req.body
  });
  res.send(record);
});


// Export the router
export default router;
