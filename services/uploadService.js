const dbService = require('./dbService');

async function uploadData(data){
  const client = await dbService.connect();
  try {
   
    await client.query('BEGIN');

    const processed = {}; // Object to keep track of emails, contact numbers, and bib numbers already processed

    for (const row of data) {
      const email = row['Email'];
      const contactNumber = row['Contact Number'];
      const bibNo = row[' Bib no'];
      // // Check if the email, contact number, or bib number has already been processed
      // if (processed[email] || processed[contactNumber] || processed[bibNo]) {
      //   throw new Error(`Duplicate record found please check: Email - ${email}, Contact Number - ${contactNumber}, or Bib no - ${bibNo}`);
      // }

      // processed[email] = true;
      // processed[contactNumber] = true;
      // processed[bibNo] = true;

      // Check if a record with the same email, contact number, and bib number already exists in the table
      const result = await dbService.query(`SELECT * FROM datatable WHERE "Email" = $1 OR "Contact Number" = $2 OR " Bib no" = $3`, [email, contactNumber, bibNo]);

      if (result.rows.length > 0) {
        // If the record already exists, check if the values are different
        const existingRow = result.rows[0];
        if (existingRow['Email'] === email && existingRow['Contact Number'] === contactNumber && existingRow[' Bib no'] === bibNo) {
          // If the row has the same email, contact number, and bib number, do nothing
          continue;
        } else {
          // If the row has a different email, contact number, bib number, update the record in the table
          const updateQuery = `UPDATE datatable SET ${Object.keys(row).map((col, index) => `"${col}" = $${index + 1}`).join(', ')} WHERE "Email" = $${Object.keys(row).length + 1} AND "Contact Number" = $${Object.keys(row).length + 2} AND " Bib no" = $${Object.keys(row).length + 3}`;
          await client.query(updateQuery, [...Object.values(row), email, contactNumber, bibNo]);
        }
      } else {
        // If the record does not exist, insert a new record into the table
        const maxSrNoResult = await client.query('SELECT MAX("Sr no") as max_sr_no FROM datatable');
        const maxSrNo = maxSrNoResult.rows[0].max_sr_no || 0;
        const values = [maxSrNo + 1, ...Object.values(row)];

        const insertQuery = `INSERT INTO datatable ("Sr no", ${Object.keys(row).map(col => `"${col}"`).join(', ')}) VALUES ($1, ${Object.keys(row).map((col, index) => `$${index + 2}`).join(', ')})`;
        await client.query(insertQuery, values);
      }
    }
  

    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}
module.exports = {
  uploadData
};