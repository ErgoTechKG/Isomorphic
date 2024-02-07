import express from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = express.Router();

router.get("/", async(req, res) => {
  const result = await prisma.finance.findUnique({
    where: {
      id: parseInt(req.query.id)
    }
  })
  res.send(result);
})

router.get("/all", async(req, res) => {
  const result = await prisma.finance.findMany();
  res.send(result);
})


router.post("/", async(req, res) => {
  try {
    console.log("req.body", req.body);

    const { date, incomeUSD, incomeSom, expenseUSD, expenseSom, note, cat } = req.body;

    // Add some validation here if needed

    const record = await prisma.finance.create({
      data: {
        date,
        incomeUSD,
        incomeSom,
        expenseUSD,
        expenseSom,
        note,
        cat,
      }
    });
    console.log('Record created successfully:', record);
    res.json(record);
  } catch (error) {
    console.error('Error creating record:', error);
  }
});


router.delete("/", async(req, res) => {
  const deletedFinance = await prisma.finance.delete({
    where: {
      id: parseInt(req.query.id)
    }
  })

  //second step
  const allFinance = await prisma.finance.findMany();
  res.send(allFinance);
})


router.put("/", async(req, res) => {
  const record = await prisma.finance.update({
    where: {
      id: parseInt(req.query.id)
    },
    data: req.body
  })
  res.send(record);
})

export default router;
