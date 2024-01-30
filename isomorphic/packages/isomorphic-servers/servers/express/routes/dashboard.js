import express from "express";
import { PrismaClient } from "@prisma/client";

import {
  getFinances,
  calculateProfit,
  calculateProfitProcessing,
  getNamesAndCalculateSoldOutRatios,
  analyzeNonSoldRolls,
} from "../scripts/dashboard.js"
//import { getCargoFromSheet } from "../scripts/googleSheets";

const prisma = new PrismaClient();
const router = express.Router();

// Define routes for /api/product here
router.get("/", async (req, res) => {

  // Example usage
  const finances = await getFinances();

  const profits = await calculateProfit();

  //const profitProcessing = await calculateProfitProcessing()
  const namesAndCalculateSoldOutRatios = await getNamesAndCalculateSoldOutRatios();
  const nonsoldout = await analyzeNonSoldRolls();
  res.send({finances:finances, profits: profits, namesAndCalculateSoldOutRatios, nonsoldout:nonsoldout
    //profitProcessing:profitProcessing
  });
});




// Export the router
export default router;
