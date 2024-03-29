const sql = require('mssql');
const { runStoredProcedure, slotToSeconds } = require("./util")
const { bpConfig } = require("./bp-config")

const isAppointmentBooked = async (userID, aptDate, aptTime) => {

  const params = [{ "name": "UserID", "type": sql.Int, "value": userID }, 
    { "name": "AptDate", "type": sql.Date, "value": aptDate },
    { "name": "AptTime", "type": sql.Int, "value": slotToSeconds(aptTime)}];
  
  const pool = await sql.connect(bpConfig)
  const result = await runStoredProcedure(pool, 'BP_IsAppointmentBooked', params)
 
  return result.returnValue
}

const isLongAppointmentBooked = async (userID, aptDate, aptTime, aptDuration, slotMultiple) => {
  const slot1 = slotToSeconds(aptTime)
  //aptDuration is session length regardless of appointment type
  const slot2 = slot1 + aptDuration * 60 
  const slot3 = slot2 + aptDuration * 60 

  const params1 = [{ "name": "UserID", "type": sql.Int, "value": userID }, 
    { "name": "AptDate", "type": sql.Date, "value": aptDate },
    { "name": "AptTime", "type": sql.Int, "value": slot2}];
  
  const pool = await sql.connect(bpConfig)
  const result1 = await runStoredProcedure(pool, 'BP_IsAppointmentBooked', params1)
 
  if (result1.returnValue) {
    return true
  } else if (slotMultiple == 3) {
    const params2 = [{ "name": "UserID", "type": sql.Int, "value": userID }, 
    { "name": "AptDate", "type": sql.Date, "value": aptDate },
    { "name": "AptTime", "type": sql.Int, "value": slot3}];

    const result2 = await runStoredProcedure(pool, 'BP_IsAppointmentBooked', params2)
 
    return result2.returnValue
  } else {
    return false
  }
}

// This stored procedure only returns appointments that still have booked status. Completed appointments are not returned as described in KB.
// (async () => {
//   const result = await isAppointmentBooked(23, '2021-11-26', "4:45 pm")
//   console.log(result)
// })()

// (async () => {
//   const result = await isLongAppointmentBooked(2000000570, '2023-02-01', "4:20 pm", 20)
//   console.log(result)
// })()

module.exports = {
  isAppointmentBooked,
  isLongAppointmentBooked
}