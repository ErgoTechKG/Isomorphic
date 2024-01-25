import express from "express";
import {PrismaClient} from "@prisma/client";
import jwtDecode from "jwt-decode";

const prisma = new PrismaClient();
const router = express.Router();

// Define routes for /api/product here
router.get("/", async (req, res) => {
  const result = await prisma.finance.findUnique({
    where: {
      id: parseInt(req.query.id),
    },
  })
  res.send(result);
});

router.get("/all", async (req, res) => {
  const allFinance = await prisma.finance.findMany();
  res.send(allFinance);
});


// router.post("/", async (req, res) => {
//   console.log("post product req.body", req.body)
//   const {idToken} = req.body;
//   const idTok = jwtDecode(idToken);
//   console.log("profile", idTok);
//   const record = await prisma.finance.create({
//     data: req.body,
//   });
//   console.log("post finance record", record)
//   res.send("Finance record");
// });

router.post("/", async (req, res) => {
  try {
    console.log("req.body", req.body);

    const {date, incomeUSD, incomeSOM, expensesUSD, expensesSOM, note, cat} = req.body;
    const idTok = jwtDecode(idToken);
    console.log("id token", idTok);

    const record = await prisma.finance.create({
      data: {
        date,
        incomeUSD,
        incomeSOM,
        expensesUSD,
        expensesSOM,
        note,
        cat,
      },
    });

    res.json(record);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "An error occurred while fetching finance records.",
    });
  }
});

export default router;

