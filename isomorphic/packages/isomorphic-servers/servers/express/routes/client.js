import express from "express";
import { PrismaClient } from "@prisma/client";
import jwtDecode from "jwt-decode";

const prisma = new PrismaClient();
const router = express.Router();

// Define routes for /api/product here
router.get("/", async (req, res) => {
  const idInt = parseInt(req.query.id);
  console.log(req.query);
  const result = await prisma.client.findUnique({
    id: idInt,
  });
  res.send(result);
});

// Define routes for /api/product here
router.delete("/", async (req, res) => {
  console.log(req.query);
  const deletedClient = await prisma.client.delete({
    where: {
      id: parseInt(req.query.id),
    },
  });

  // Step 2: Fetch all products after deletion
  const allClients = await prisma.client.findMany();

  res.send(allClients);
});

router.get("/all", async (req, res) => {
  const allClients = await prisma.client.findMany();
  res.send(allClients);
});

// router.post("/", async (req, res) => {
//   console.log("post product req.body", req.body)
//   const record = await prisma.client.create({
//     data: req.body,
//   });
//   console.log("post product record", record)
//   res.send("post product");
// });

router.post("/", async (req, res) => {
  try {
    console.log("req.body", req.body);

    const { name, staff, idToken } = req.body;
    const profile = jwtDecode(idToken);
    console.log("profile", profile);

    const record = await prisma.client.create({
      data: {
        name: name,
        staff: staff,
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


router.put("/", async (req, res) => {
  // console.log('req.body', req.body)
  // const {idToken } = req.body;
  // const profile = jwtDecode(idToken);
  // console.log("profile", profile);
  const record = await prisma.client.update({
    where: {
      id: req.body.id, // Assuming id is an integer; adapt as needed
    },
    data: req.body,
  });
  res.send(record);
});

// router.put("/", async (req, res) => {
//   try {
//     console.log('req.body', req.body);
//     const { id: clientId} = req.body;// Destructure id and exclude it from updateData
//     const clientId2 = parseInt(clientId);
//     const record = await prisma.client.update({
//       where: {
//         id: clientId2, // Assuming id is an integer
//       },
//       data: req.body,
//     });
//     res.send(record);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({
//       error: "An error occurred while updating the client record.",
//     });
//   }
// });

// router.put("/", async (req, res) => {
//   try {
//     console.log('req.body', req.body);
//     const {id: clientId} = req.body; // Destructure id from req.body
//     console.log('clientId:', clientId); // Log the clientId
//     const clientIdInt = parseInt(clientId); // Parse clientId into an integer
//     console.log('clientIdInt:', clientIdInt); // Log the parsed integer value
//     const record = await prisma.client.update({
//       where: {
//         id: clientIdInt, // Use the parsed integer value
//       },
//       data: req.body,
//     });
//     res.send(record);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({
//       error: "An error occurred while updating the client record.",
//     });
//   }
// });



// router.put("/", async (req, res) => {
//  try{
//    console.log('req.body', req.body)
//    const Id = parseInt(req.query.id);
//    const record = await prisma.client.update({
//      where: {
//        id: Id, // Assuming id is an integer; adapt as needed
//      },
//      data: req.body,
//    });
//    console.log(record);
//    res.send(record);
//  } catch(err) {
//    console.log(err);
//  }
// });


// Export the router
export default router;
