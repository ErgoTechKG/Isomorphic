import express from "express";
import { PrismaClient } from "@prisma/client";
//import { getCargoFromSheet } from "../scripts/googleSheets";

const prisma = new PrismaClient();
const router = express.Router();

// Define routes for /api/product here
router.get("/", async (req, res) => {
  const result = await prisma.sale.findUnique({
    where: {
      id: parseInt(req.query.id),
    },
  })
  res.send(result);
});


router.delete("/", async (req, res) => {
  console.log(req.query)
  const deletedSale = await prisma.sale.delete({
    where: {
      id: parseInt(req.query.id),
    },
  });

  // Step 2: Fetch all products after deletion
  const allSales = await prisma.sale.findMany();
  res.send(allSales);
});

router.get("/all", async (req, res) => {
  const all = await prisma.sale.findMany();
  res.send(all);
});

router.post("/", async(req, res) => {
  try {
    const {date, note, amount, unit, priceUSD, paymentMethod, status} = req.body;
    const newSale = await prisma.sale.create({
      data: {
        date,
        note,
        amount,
        unit,
        priceUSD,
        paymentMethod,
        status
      }
    })
    console.log("Created successfully Sale records", newSale);
    res.json(newSale);
  } catch(err) {
    console.log("Error while creating data", err);
  }
})


router.put("/", async (req, res) => {
  const record = await prisma.sale.update({
    where: {
      id: parseInt(req.query.id)  // Assuming id is an integer; adapt as needed
    },
    data: req.body
  });

  const sales = await prisma.sale.findMany();
  res.send(sales);
});


// Export the router
export default router;
