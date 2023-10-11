const sql = require('mssql');
const moment = require('moment')
const { aptTimeString } = require("./util")
const { bpConfig, userIDs } = require("./bp-config")

const getAppointmentsOnDate = async (date) => {
  try {
    const pool = await sql.connect(bpConfig)
    const queryStr = `SELECT Appointments.RECORDSTATUS,Appointments.USERID,Appointments.RECORDID,Appointments.APPOINTMENTTYPE,Appointments.APPOINTMENTDATE,Appointments.APPOINTMENTTIME,Patients.FIRSTNAME,Patients.SURNAME,Patients.MOBILEPHONE,Patients.DOB from Appointments LEFT JOIN Patients ON Appointments.INTERNALID=Patients.INTERNALID where Appointments.APPOINTMENTDATE=\'${date}\' and Appointments.RECORDSTATUS in (1,4)`
    const result = await pool.request()
      .query(queryStr)
    
    const apts = result.recordset.map(item => {
      return {
        aptID: item.RECORDID,
        status: item.RECORDSTATUS,
        provider: userIDs[item.USERID],
        aptType: item.APPOINTMENTTYPE,
        aptDate: moment(item.APPOINTMENTDATE).format("YYYY-MM-DD"),
        aptTime: aptTimeString(item.APPOINTMENTTIME),
        firstname: item.FIRSTNAME?.trim(),
        surname: item.SURNAME?.trim(),
        mobile : item.MOBILEPHONE?.trim()
      }}) 
  
    return apts

  } catch (err) {
    console.log(err)
  }
}      

module.exports = {
  getAppointmentsOnDate
}
  