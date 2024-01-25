import express from "express";
import { PrismaClient } from "@prisma/client";
//import { getCargoFromSheet } from "../scripts/googleSheets";

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


// // Define routes for /api/product here
// router.get("/bulk", async (req, res) => {
//   let googleSheetResult = await getCargoFromSheet();
//   googleSheetResult.shift();
//   console.log('googleSheetResult', googleSheetResult)
//   const cargos = await prisma.cargo.createMany({
//     data: googleSheetResult,
//     //skipDuplicates: true // Optional: skips the insert if a record with unique constraint already exists
//   });
//   res.send(cargos);
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
  const allCargos = await prisma.cargo.findMany();

  res.send(allCargos);
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
  const record = await prisma.cargo.update({
    where: {
      id: req.body.id  // Assuming id is an integer; adapt as needed
    },
    data: req.body
  });

  const rolls = await prisma.cargo.findMany();
  res.send(rolls);
});


// Export the router
export default router;
