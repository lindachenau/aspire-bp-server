const sql = require('mssql');
const { runStoredProcedure } = require("./util")
const { bpConfig } = require("./bp-config")

const confirmAppointment = async (aptID) => {

  const params = [{ "name": "AptID", "type": sql.Int, "value": aptID }];
  
  const pool = await sql.connect(bpConfig)
  const result = await runStoredProcedure(pool, 'BP_ConfirmAppointment', params)

  return result.returnValue
}

const declineAppointment = async (aptID) => {

  const params = [{ "name": "AptID", "type": sql.Int, "value": aptID }];
  
  const pool = await sql.connect(bpConfig)
  const result = await runStoredProcedure(pool, 'BP_DeclineAppointment', params)

  return result.returnValue
}

// (async () => {
//   const result = await confirmAppointment(430446)
//   console.log(result)
// })()

// (async () => {
//   const result = await declineAppointment(430446)
//   console.log(result)
// })()

module.exports = {
  confirmAppointment,
  declineAppointment
}