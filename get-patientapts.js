const sql = require('mssql');
const moment = require('moment')
const { runStoredProcedure, aptTimeString } = require("./util")
const { bpConfig, apptRecordBooked, apptStatusBooked, apptStatusDNA, userIDs } = require("./bp-config")

const getPatientAppointments = async (patientID) => {
  const pool = await sql.connect(bpConfig)

  const result = await pool.request()
    .query(`SELECT RECORDID, RECORDSTATUS, APPOINTMENTCODE, USERID, APPOINTMENTTYPE, APPOINTMENTDATE, APPOINTMENTTIME from APPOINTMENTS where INTERNALID = ${patientID} 
      AND RECORDSTATUS = ${apptRecordBooked} AND (APPOINTMENTCODE = ${apptStatusBooked} OR APPOINTMENTCODE = ${apptStatusDNA})`)

    const apts = result.recordset.map(item => {
      return {
        aptID: item.RECORDID,
        status: item.APPOINTMENTCODE,
        provider: userIDs[item.USERID],
        aptType: item.APPOINTMENTTYPE,
        aptDate: moment(item.APPOINTMENTDATE).format("YYYY-MM-DD"),
        aptTime: aptTimeString(item.APPOINTMENTTIME)
      }}) 
  
  return apts
}

// (async () => {
//   const result = await getPatientAppointments(1)
//   console.log(result)
// })()

module.exports = {
  getPatientAppointments
}