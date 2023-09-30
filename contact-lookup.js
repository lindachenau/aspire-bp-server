const sql = require('mssql');
const { bpConfig } = require("./bp-config")

const contactByPhone = async (phone) => {
  try {
    const pool = await sql.connect(bpConfig)

    const queryStr = `SELECT INTERNALID, FIRSTNAME, PREFERREDNAME, SURNAME, CITY FROM Patients WHERE MOBILEPHONE LIKE \'${phone}\' AND RECORDSTATUS = 1`
    const result = await pool.request()
      .query(queryStr)
    
    if (result.recordset.length > 0)
      return result.recordset[0]
    else
      return {}

  } catch (err) {
    console.log(err)
  }
}      

module.exports = {
  contactByPhone
}