import express from "express";
import {PrismaClient} from "@prisma/client";

const prisma = new PrismaClient();
const router = express.Router();

// Define routes for /api/product here
router.get("/", async (req, res) => {
  console.log(req.query);
  const idInt = parseInt(req.query.id);
  const result = await prisma.finance.findUnique({
    id: parseInt(req.query.id)
  });
  res.send(result);
});

router.delete("/", async (req, res) => {
  console.log(req.query);
  const deletedClient = await prisma.finance.delete({
    where: {
      id: parseInt(req.query.id),
    },
  });

  // Step 2: Fetch all products after deletion
  const allFinance = await prisma.finance.findMany();

  res.send(allFinance);
});

router.get("/all", async(req, res) => {
  const allFinanceRecords = await prisma.finance.findMany();
  res.send(allFinanceRecords);
})

router.post("/", async (req, res) => {
  try {
    console.log("req.body", req.body);

    const { date, incomeUSD, incomeSOM, expensesUSD, expensesSOM, note, cat } = req.body;
    const record = await prisma.finance.create({
      data: {
        date: date,
        incomeUSD: incomeUSD,
        incomeSOM: incomeSOM,
        expensesUSD: expensesUSD,
        expensesSOM: expensesSOM,
        note: note,
        cat: cat
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

// router.post("/", async (req, res) => {
//   try {
//     console.log("req.body", req.body);
//
//     const { date, incomeUSD, incomeSOM, expensesUSD, expensesSOM, note, cat } = req.body;
//     const record = await prisma.finance.create({
//       data: {
//         date,
//         incomeUSD,
//         incomeSOM,
//         expensesUSD,
//         expensesSOM,
//         note,
//         cat
//       },
//     });
//
//     res.json(record);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({
//       error: "An error occurred while creating a finance record.",
//     });
//   }
// });

router.put("/", async(req, res) => {
  console.log("req.body", req.body);
  const record = await prisma.finance.update({
   where: {
     id: parseInt(req.query.id),
   },
   data: req.body,
  })
  res.json(record);
})


export default router;

