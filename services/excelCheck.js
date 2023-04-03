function checkRepeatedData(data) {
    const processed = {};
    const duplicates = [];
  
    for (const row of data) {
      const email = row['Email'];
      const contactNumber = row['Contact Number'];
      const bibNo = row[' Bib no'];
  
      if (processed[email] || processed[contactNumber] || processed[bibNo]) {
        duplicates.push({ email, contactNumber, bibNo });
      }
  
      processed[email] = true;
      processed[contactNumber] = true;
      processed[bibNo] = true;
    }
  
    if (duplicates.length > 0) {
      throw new Error(`Duplicate records found: ${JSON.stringify(duplicates)}`);
    }
  }
  module.exports = { checkRepeatedData };
 