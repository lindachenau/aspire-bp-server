const sql = require('mssql');
const { bpConfig } = require("./bp-config")

const getAppointmentsOnDate = async (date) => {
  try {
    const pool = await sql.connect(bpConfig)
    const queryStr = `SELECT Appointments.RECORDSTATUS,Appointments.RECORDID,Appointments.APPOINTMENTTYPE,Appointments.APPOINTMENTDATE,Appointments.APPOINTMENTTIME,Patients.FIRSTNAME,Patients.SURNAME,Patients.MOBILEPHONE from Appointments LEFT JOIN Patients ON Appointments.INTERNALID=Patients.INTERNALID where Appointments.APPOINTMENTDATE=\'${date}\' and Appointments.RECORDSTATUS in (1,4)`
    const result = await pool.request()
      .query(queryStr)
    
    return result.recordset

    } catch (err) {
      console.log(err)
    }
  }      

module.exports = {
  getAppointmentsOnDate
}
  