import express from "express";
import { PrismaClient } from "@prisma/client";

import {
  getFinances,
  calculateProfit,
  calculateProfitProcessing,
  getNamesAndCalculateSoldOutRatios,
  analyzeNonSoldRolls,
} from "../scripts/dashboard.js";
//import { getCargoFromSheet } from "../scripts/googleSheets";

const prisma = new PrismaClient();
const router = express.Router();

// Define routes for /api/product here
router.get("/", async (req, res) => {
  try {
    const [finances, profits, namesAndCalculateSoldOutRatios, nonsoldout] =
      await Promise.all([
        getFinances(),
        calculateProfit(),
        getNamesAndCalculateSoldOutRatios(),
        analyzeNonSoldRolls(),
      ]);
    res.send({
      finances,
      profits,
      namesAndCalculateSoldOutRatios,
      nonsoldout,
    });
  } catch (error) {
    console.error("Error processing request:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Export the router
export default router;
