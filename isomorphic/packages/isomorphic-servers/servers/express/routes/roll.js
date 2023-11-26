import express from "express";
import { PrismaClient } from "@prisma/client";
import { getRollFromSheet } from "../scripts/googleSheetsRolls";

const prisma = new PrismaClient();
const router = express.Router();

// Define routes for /api/product here
router.get("/all", async (req, res) => {
  const rolls = await prisma.roll.findMany();
  res.send(rolls);
});


// // Define routes for /api/product here
// router.get("/bulk", async (req, res) => {
//   let sheetResult = await getRollFromSheet();
//   console.log('sheetResult', sheetResult)
//   const cargos = await prisma.roll.createMany({
//     data: sheetResult,
//     //skipDuplicates: true // Optional: skips the insert if a record with unique constraint already exists
//   });
//   res.send([]);
// });

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

  const rolls = await prisma.cargo.create({
    data: {
      name: 'Alice',
      email: 'alice@example.com',
    },
  })
  console.log(cargo.id);
  res.send("post product");

});


router.put("/", async (req, res) => {
  console.log('req.body', req.body)
  const record = await prisma.roll.update({
    where: {
      id: req.body.id  // Assuming id is an integer; adapt as needed
    },
    data: req.body
  });

  const rolls = await prisma.roll.findMany();
  res.send(rolls);
});


// Export the router
export default router;
