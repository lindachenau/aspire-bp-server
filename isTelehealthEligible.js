const sql = require('mssql');
const moment = require('moment-timezone')
const { runStoredProcedure, aptTimeString } = require("./util")
const { bpConfig, apptRecordBooked, apptStatusBooked, apptStatusDNA, telephoneConsultation, telehealthCconsultation } = require("./bp-config")

const isTelehealthEligible = async (patientID) => {

  const params = [{ "name": "PatientID", "type": sql.Int, "value": patientID }];
  const today = new Date()
  const sydneyTime = moment(today).tz('Australia/Sydney')
  const todayStr = sydneyTime.format("YYYY-MM-DD")
  const lastYear = parseInt(todayStr.slice(0, 4)) - 1
  const lastYearStr = lastYear.toString() + todayStr.slice(4)

  const pool = await sql.connect(bpConfig)

  //get completed appointments which patients attended in person in the last 12 months
  const result = await pool.request()
    .query(`SELECT RECORDID, RECORDSTATUS, APPOINTMENTCODE, APPOINTMENTTYPE, APPOINTMENTDATE from APPOINTMENTS where INTERNALID = ${patientID} 
      AND RECORDSTATUS = ${apptRecordBooked} AND NOT (APPOINTMENTCODE = ${apptStatusBooked} OR APPOINTMENTCODE = ${apptStatusDNA}) AND 
      APPOINTMENTDATE BETWEEN '${lastYearStr}' AND '${todayStr}'`)

    const apts = result.recordset.map(item => {
      return {
        aptID: item.RECORDID,
        status: item.APPOINTMENTCODE,
        aptType: item.APPOINTMENTTYPE,
        aptDate: item.APPOINTMENTDATE
      }}) 

      const f2fApts = apts.filter(item => (item.aptType !== telephoneConsultation && item.aptType !== telehealthCconsultation))

  // return apts
  return f2fApts.length > 0
}

(async () => {
  const result = await isTelehealthEligible(1721)
  console.log(result)
})()

module.exports = {
  isTelehealthEligible
}