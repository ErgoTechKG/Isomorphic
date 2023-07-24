import express from "express";
import { uid } from 'uid';
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
const router = express.Router();

async function generateUniqueID() {
  let newID;
  do {
    newID = 'k1'+uid(5); // Generate a new ID with a length of 5 characters.
    const existingID = await prisma.product.findUnique({
      where: { codeKent: newID },
    });
  } while (existingID);

  // At this point, the generated ID is unique and can be used.
  return newID;
}

// Define routes for /api/product here
router.get("/", (req, res) => {
  res.send("Product API");
});

router.get("/generateCode", async (req, res) => {
  const newProductID = await generateUniqueID();
 
  res.send(newProductID);
});

// Export the router
export default router;
