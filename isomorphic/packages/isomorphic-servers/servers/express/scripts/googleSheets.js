const { google } = require("googleapis");

const sheets = google.sheets("v4");


async function getSheetData() {
  const auth = await google.auth.getClient({
    keyFile: "./scripts/theta-eon-391814-087f4a9c7334.json",
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  const spreadsheetId = "1Hsd3v6gotrgv70W1o_D3jaj6dpTVFVVsX49JpdyoauU";
  const range = "Sheet2!A1:D";

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range,
    auth,
  });

  const rows = response.data.values;
  return rows.length ? rows.map(row => ({ 
    dateSent: new Date(row[0]), 
    description: row[1], 
    valueCargo: parseFloat(row[2]), 
    feePackage: row[3]?parseFloat(row[3]):null,
    isFullyRecieved: true
  })) : [];
}




export async function getCargoFromSheet() {
  let sewings = await getSheetData()
    .then(async (data) => {
      return data
    })
    .catch(err => {
      console.error("Error reading data from Google Sheet:", err);
    });
  return sewings;
}
