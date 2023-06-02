const sql = require('mssql');
const { runStoredProcedure, slotToSeconds } = require("./util")
const { bpConfig, newPatientAptType, longApptType, followupApptType, initialApptType } = require("./bp-config")

const addAppointment = async (aptDate, aptTime, aptDuration, aptType, practitionerID, patientID) => {
  let slotMultiple = 1

  if (aptType == initialApptType)
    slotMultiple = 3
  else if (aptType == newPatientAptType || aptType == longApptType || aptType == followupApptType)
    slotMultiple = 2

  const params = [{ "name": "AptDate", "type": sql.VarChar, "value": aptDate },
    { "name": "AptTime", "type": sql.Int, "value": slotToSeconds(aptTime) },
    { "name": "AppointmentType", "type": sql.Int, "value": aptType },
    { "name": "AptLen", "type": sql.Int, "value": aptDuration * 60 * slotMultiple},
    { "name": "PractitionerID", "type": sql.Int, "value": practitionerID },
    { "name": "PatientID", "type": sql.Int, "value": patientID },
    { "name": "Reason", "type": sql.VarChar, "value": "" },
    { "name": "LocationID", "type": sql.Int, "value": 1 }];
  
  const pool = await sql.connect(bpConfig)
  const result = await runStoredProcedure(pool, 'BP_AddAppointmentEx', params)

  // Appointments.RecordID
  return result.returnValue
}

//39 Test21 Patient
// (async () => {
//   const result = await addAppointment("2023-01-10", "11:00 am", 10, 4, 2000000570, 39)
//   console.log(result)
// })()

module.exports = {
  addAppointment
}