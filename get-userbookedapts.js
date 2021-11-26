const sql = require('mssql');
const { runStoredProcedure, aptTimeString } = require("./util")
const { bpConfig } = require("./bp-config")

const getUserBookedApts = async (userID, aptDate) => {

  const params = [{ "name": "UserID", "type": sql.Int, "value": userID }, 
    { "name": "AptDate", "type": sql.Date, "value": aptDate }];
  
  const pool = await sql.connect(bpConfig)
  const result = await runStoredProcedure(pool, 'BP_GetUserBookedAppointments', params)
  const bookedSlots = result.recordset.map(item => {
    return {
      recordID: item.RecordID,
      patientID: item.InternalID[0],
      time: item.AppointmentTime,
      timeString: aptTimeString(item.AppointmentTime),
      length: item.AppointmentLength / 60,
      type: item.AppointmentType,
      status: item.AppointmentCode,
      urgent: item.Urgent
    }
  })
  
  return bookedSlots.sort((a, b) => a.time - b.time)
}

// This stored procedure only returns appointments that still have booked status. Completed appointments are not returned as described in KB.
// (async () => {
//   const result = await getUserBookedApts(23, '2021-11-26')
//   console.log(result)
// })()

module.exports = {
  getUserBookedApts
}