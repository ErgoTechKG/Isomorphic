import ExcelJS from "exceljs";
import { uid } from "uid";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const convertToString = (value) =>
  typeof value === "number" ? value.toString() : value;

const fileIdRegex = /fileId=([^&]+)/;

const getFileIdFromUrl = (url) => {
  const match = url.match(fileIdRegex);
  return match ? match[1] : null;
};

async function generateUniqueID() {
  let existingProd;
  let newID;
  do {
    newID = "k1" + uid(5); // Generate a new ID with a length of 5 characters.
    existingProd = await prisma.product.findFirst({
      where: { codeKent: newID },
    });
  } while (existingProd);

  // At this point, the generated ID is unique and can be used.
  return newID;
}

async function parseExcelFile(file) {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(file);
  
  const worksheet = workbook.worksheets[0]; // Assuming data is in the first worksheet
  const rows = worksheet.getSheetValues();
  //console.log('rows', rows)
  // Check if the rows variable is an array
  if (!Array.isArray(rows)) {
    throw new Error("Invalid Excel file. No rows found.");
  }
  
  // Process the rows and save to PostgreSQL via Prisma
  for (const row of rows) {
    if (row === undefined || row === null) {
      continue;
    }
    // Skip empty rows
    if (row.every((cell) => cell === undefined || cell === null)) {
      continue;
    }
  
    const [
      column0,
      column1,
      column2,
      column3,
      column4,
      column5,
      column6,
      column7,
      column8,
      column9,
      column10,
      column11,
      column12,
    ] = row; // Assuming 3 columns in the Excel file
    // if (!(column1 || column11)) continue;

    if (!(column12 && column11)) 
      continue;

    if (column12 == 'Russian name' || column11 == 'code from') continue;
      
    console.log(column12);
    console.log(column11);
  
    await prisma.product.updateMany({
      where: {
        codeChina: column11.toString(),
      },
      data: {
        nameRussian: column12,
      },
    });


    
  };
}

async function parseExcelFile_readOrigialFile(file) {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(file);

  const worksheet = workbook.worksheets[1]; // Assuming data is in the first worksheet
  const rows = worksheet.getSheetValues();
  //console.log('rows', rows)
  // Check if the rows variable is an array
  if (!Array.isArray(rows)) {
    throw new Error("Invalid Excel file. No rows found.");
  }

  // Process the rows and save to PostgreSQL via Prisma
  for (const row of rows) {
    if (row === undefined || row === null) {
      continue;
    }
    // Skip empty rows
    if (row.every((cell) => cell === undefined || cell === null)) {
      continue;
    }

    const [
      column0,
      column1,
      column2,
      column3,
      column4,
      column5,
      column6,
      column7,
      column8,
      column9,
      column10,
      column11,
      column12,
    ] = row; // Assuming 3 columns in the Excel file

    if (column2 && column2 !== "codeChina") {
      try {
        console.log(
          column1,
          column2,
          column3,
          column4,
          column5,
          column6,
          column7,
          column8,
          column11,
          column12
        );
        if (column11 && column11.result) console.log("object");
        await prisma.product.create({
          data: {
            codeKent: await generateUniqueID(),
            codeKent0: column1,
            codeChina: convertToString(column2),
            nameRussian: column3,
            nameEnglish: column4,
            nameChinese: column5,
            subCat: column6,
            priceChinaKG: column7,
            priceChinaMeter: column8,
            width: column11 && column11.result ? column11.reuslt : column11,
            gram: column12,
          },
        });
      } catch (error) {
        console.error("Error saving to database:", error);
      }
    }
  }

  console.log("Data imported successfully.");
}

async function parseExcelFile_images(file) {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(file);

  const worksheet = workbook.worksheets[0]; // Assuming data is in the first worksheet
  const rows = worksheet.getSheetValues();
  //console.log('rows', rows)
  // Check if the rows variable is an array
  if (!Array.isArray(rows)) {
    throw new Error("Invalid Excel file. No rows found.");
  }

  // Process the rows and save to PostgreSQL via Prisma
  for (const row of rows) {
    if (row === undefined || row === null) {
      continue;
    }
    // Skip empty rows
    if (row.every((cell) => cell === undefined || cell === null)) {
      continue;
    }

    const [
      column0,
      column1,
      column2,
      column3,
      column4,
      column5,
      column6,
      column7,
      column8,
      column9,
      column10,
      column11,
      column12,
    ] = row; // Assuming 3 columns in the Excel file
    if (!(column1 || column11)) continue;
    try {
      let columnArray = [
        column2,
        column3,
        column4,
        column5,
        column6,
        column7,
        column8,
        column9,
        column10,
      ];
      let urlArray = [];

      for (let i = 0; i < columnArray.length; i++) {
        
        if(!columnArray[i])
          continue;

        const value = getFileIdFromUrl(columnArray[i].hyperlink)
        if (value)
          urlArray.push(value);
      }


      await prisma.product.updateMany({
        where: {
          codeChina: column11.toString(),
        },
        data: {
          imageURL: urlArray,
        },
      });


    } catch (error) {
      console.error("Error saving to database:", error);
    }
  }

  console.log("Data imported successfully.");
}
export { parseExcelFile, parseExcelFile_images };

