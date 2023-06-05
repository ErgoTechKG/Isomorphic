import ExcelJS from 'exceljs';

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function parseExcelFile(file) {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(file);
  
    const worksheet = workbook.worksheets[0]; // Assuming data is in the first worksheet
    const rows = worksheet.getSheetValues();
    console.log('rows', rows)
    // Check if the rows variable is an array
    if (!Array.isArray(rows)) {
      throw new Error('Invalid Excel file. No rows found.');
    }
  
    // Process the rows and save to PostgreSQL via Prisma
    for (const row of rows) {
      if (row === undefined || row === null) {
        continue;
      }
      // Skip empty rows
      if (row.every(cell => cell === undefined || cell === null || cell.trim() === '')) {
        continue;
      }
  
      const [column1, column2, column3, column4] = row; // Assuming 3 columns in the Excel file
      console.log(column2, column3, column4)
      try {
        await prisma.material.create({
          data: {
            code:column2,
            englishName:column3,
            chineseName:column4,
          },
        });
      } catch (error) {
        console.error('Error saving to database:', error);
      }
    }
  
    console.log('Data imported successfully.');
  }
  
  
  export { parseExcelFile };
  