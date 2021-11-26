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

// This stored procedure only returns appointments that still have booked status. Completed appointments are not returned as described in KB.
// (async () => {
//   const result = await isAppointmentBooked(23, '2021-11-26', "4:45 pm")
//   console.log(result)
// })()

module.exports = {
  isAppointmentBooked
}