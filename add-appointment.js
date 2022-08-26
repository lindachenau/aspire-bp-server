const sql = require('mssql');
const { runStoredProcedure, slotToSeconds } = require("./util")
const { bpConfig } = require("./bp-config")

const addAppointment = async (aptDate, aptTime, aptDuration, aptType, practitionerID, patientID) => {

  const params = [{ "name": "AptDate", "type": sql.VarChar, "value": aptDate },
    { "name": "AptTime", "type": sql.Int, "value": slotToSeconds(aptTime) },
    { "name": "AppointmentType", "type": sql.Int, "value": aptType },
    { "name": "AptLen", "type": sql.Int, "value": aptDuration * 60 },
    { "name": "PractitionerID", "type": sql.Int, "value": practitionerID },
    { "name": "PatientID", "type": sql.Int, "value": patientID },
    { "name": "Reason", "type": sql.VarChar, "value": "" }];
  
  const pool = await sql.connect(bpConfig)
  const result = await runStoredProcedure(pool, 'BP_AddAppointmentEx', params)

  // Appointments.RecordID
  return result.returnValue
}

// (async () => {
//   const result = await addAppointment("2021-04-26", "10:15 am", 1, 23, 25036)
//   console.log(result)
// })()

module.exports = {
  addAppointment
}