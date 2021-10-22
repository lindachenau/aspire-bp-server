const sql = require('mssql');
const { runStoredProcedure } = require("./util")
const { bpConfig } = require("./bp-config")

const cancelAppointment = async (aptID) => {

  const params = [{ "name": "AptID", "type": sql.Int, "value": aptID }];
  
  const pool = await sql.connect(bpConfig)
  const result = await runStoredProcedure(pool, 'BP_CancelAppointment', params)

  return result.returnValue
}

// (async () => {
//   const result = await cancelAppointment(430446)
//   console.log(result)
// })()

module.exports = {
  cancelAppointment
}