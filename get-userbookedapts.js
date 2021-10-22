const sql = require('mssql');
const { runStoredProcedure, aptsToStrings } = require("./util")
const { bpConfig } = require("./bp-config")

const getUserBookedApts = async (userID, aptDate) => {

  const params = [{ "name": "UserID", "type": sql.Int, "value": userID }, 
    { "name": "AptDate", "type": sql.Date, "value": aptDate }];
  
  const pool = await sql.connect(bpConfig)
  const result = await runStoredProcedure(pool, 'BP_GetUserBookedAppointments', params)
  const bookedSlots = aptsToStrings(result.recordset.map(item => item.AppointmentTime))
  return bookedSlots
}

// This stored procedure only returns appointments that still have booked status. Completed appointments are not returned as described in KB.
// (async () => {
//   const result = await getUserBookedApts(23, '2021-07-12')
//   console.log(result)
// })()

module.exports = {
  getUserBookedApts
}