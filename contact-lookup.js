const sql = require('mssql');
const { bpConfig } = require("./bp-config")

const contactByPhone = async (phone) => {
  try {
    const pool = await sql.connect(bpConfig)

    const queryStr = `SELECT INTERNALID, FIRSTNAME, PREFERREDNAME, SURNAME, CITY, MOBILEPHONE FROM Patients WHERE MOBILEPHONE LIKE \'${phone}\' AND RECORDSTATUS = 1`
    const result = await pool.request()
      .query(queryStr)
    
    if (result.recordset.length > 0) {
      const contact = {
        id: result.recordset[0].INTERNALID,
        firstname: result.recordset[0].FIRSTNAME.trim(),
        lastname: result.recordset[0].SURNAME.trim(),
        preferredname: result.recordset[0].PREFERREDNAME.trim(),
        city: result.recordset[0].CITY.trim(),
        mobilephone: result.recordset[0].MOBILEPHONE.trim()
      }
      
      return contact
    }
    else {
      return {}
    }

  } catch (err) {
    console.log(err)
  }
}      

module.exports = {
  contactByPhone
}