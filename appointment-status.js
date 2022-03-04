const sql = require('mssql');
const { runStoredProcedure } = require("./util")
const { bpConfig } = require("./bp-config")

const appointmentStatus = async (aptID) => {

  const params = [{ "name": "AptID", "type": sql.Int, "value": aptID }];
  
  const pool = await sql.connect(bpConfig)
  const result = await runStoredProcedure(pool, 'BP_GetAppointmentDetails', params)

  return result.recordset[0]
}

// (async () => {
//   const result = await appointmentStatus(79)
//   console.log(result)
// })()

module.exports = {
  appointmentStatus
}