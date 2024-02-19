import express from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const result = await prisma.finance.findUnique({
      where: {
        id: parseInt(req.query.id),
      },
    });
    res.send(result);
  } catch (error) {
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
});

router.get("/all", async (req, res) => {
  try {
    const result = await prisma.finance.findMany();
    res.send(result);
  } catch (error) {
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
});

router.post("/", async (req, res) => {
  try {
    // console.log("req.body", req.body);
    const { date, incomeUSD, incomeSom, expenseUSD, expenseSom, note, cat } =
      req.body;
    const record = await prisma.finance.create({
      data: {
        date,
        incomeUSD,
        incomeSom,
        expenseUSD,
        expenseSom,
        note,
        cat,
      },
    });
    res.json(record);
  } catch (error) {
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
});

router.delete("/", async (req, res) => {
  try {
    const deletedFinance = await prisma.finance.delete({
      where: {
        id: parseInt(req.query.id),
      },
    });

    //second step
    const allFinance = await prisma.finance.findMany();
    res.send(allFinance);
  } catch (error) {
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
});

router.put("/", async (req, res) => {
  try {
    const record = await prisma.finance.update({
      where: {
        id: parseInt(req.query.id),
      },
      data: req.body,
    });
    res.send(record);
  } catch (error) {
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
});

export default router;
