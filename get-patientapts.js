const sql = require('mssql');
const moment = require('moment')
const { runStoredProcedure, aptTimeString } = require("./util")
const { bpConfig } = require("./bp-config")

const getPatientAppointments = async (patientID) => {

  const params = [{ "name": "PatientID", "type": sql.Int, "value": patientID }];
  
  const pool = await sql.connect(bpConfig)
  const result = await runStoredProcedure(pool, 'BP_GetPatientAppointments', params)

  const apts = result.recordset.map(item => {
    return {
      aptID: item.RecordID,
      status: item.AppointmentCode,
      provider: `${item.UserTitle.trim()} ${item.UserSurname.trim()}`,
      aptDate: moment(item.AppointmentDate).format("YYYY-MM-DD"),
      aptTime: aptTimeString(item.AppointmentTime),
      aptType: item.AppointmentType
    }}) 

  return apts
}

// (async () => {
//   const result = await getPatientAppointments(25036)
//   console.log(result)
// })()

module.exports = {
  getPatientAppointments
}