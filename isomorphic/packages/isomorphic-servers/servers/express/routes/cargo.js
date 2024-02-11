import express from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = express.Router();

router.get("/all", async (req, res) => {
  const allCargos = await prisma.cargo.findMany();
  res.send(allCargos);
});

//Deleting functionality
router.delete("/", async(req, res) => {
  const deletedCargo = await prisma.cargo.delete({
    where: {
      id: parseInt(req.query.id)
    }
  })
  const allCargos = await prisma.cargo.findMany();
  res.send(allCargos);
})

//Sending functionality
router.post("/", async(req, res) => {
  try {
    const {description, dateArrived, dateSent,feePackage, valueCargo, logisticFee, isFullyRecieved} = req.body;
    const cargos = await prisma.cargo.create({
      data: {
        description,
        dateArrived,
        dateSent,
        feePackage,
        valueCargo,
        logisticFee,
        isFullyRecieved,
      }
    })
    console.log('Record created successfully:', cargos);
    res.json(cargos);
  } catch (error)  {
    console.error('Error creating record:', error);
  }
})

//Editing functionality
router.put("/", async (req, res) => {
  const record = await prisma.cargo.update({
    where: {
      id: parseInt(req.query.id)  // Assuming id is an integer; adapt as needed
    },
    data: req.body
  });

  const cargos = await prisma.cargo.findMany();
  res.send(cargos);
});


// Export the router
export default router;
