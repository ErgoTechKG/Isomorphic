const { google } = require("googleapis");

const sheets = google.sheets("v4");


async function getSheetData() {
  const auth = await google.auth.getClient({
    keyFile: "./scripts/theta-eon-391814-087f4a9c7334.json",
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  const spreadsheetId = "1Hsd3v6gotrgv70W1o_D3jaj6dpTVFVVsX49JpdyoauU";
  const range = "summary!A1:A";

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range,
    auth,
  });

  const rows = response.data.values;
  rows.shift();
  console.log('response.data.values', rows)
  const flatArray = [].concat(...rows);

 
  return flatArray
  // return rows.length ? rows.map(row => ({ 
  //   dateSent: new Date(row[0]), 
  //   description: row[1], 
  //   valueCargo: parseFloat(row[2]), 
  //   feePackage: row[3]?parseFloat(row[3]):null,
  //   isFullyRecieved: true
  // })) : [];
}




export async function getRollFromSheet() {
  let sewings = await getSheetData()
    .then(async (data) => {

      const auth = await google.auth.getClient({
        keyFile: "./scripts/theta-eon-391814-087f4a9c7334.json",
        scopes: ["https://www.googleapis.com/auth/spreadsheets"],
      });
    
      const spreadsheetId = "1Hsd3v6gotrgv70W1o_D3jaj6dpTVFVVsX49JpdyoauU";

      var records = [];

      for (let i = 0; i < data.length; i++) {
        const range = data[i]+"!A1:E";

        const responseRolls = await sheets.spreadsheets.values.get({
          spreadsheetId,
          range,
          auth,
        });
  
        const rows = responseRolls.data.values;
        rows.shift();
        records = records.concat(rows.map(row => ({ 
            kentCode: row[0], 
            amount: parseFloat(row[1]), 
            rbg: row[2], 
            unit: row[3],
            cargoId: parseInt(row[4])
          })));
      }

      return records
    })
    .catch(err => {
      console.error("Error reading data from Google Sheet:", err);
    });
  return sewings;
}
