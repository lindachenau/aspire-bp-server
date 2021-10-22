const sql = require('mssql');
const { runStoredProcedure } = require("./util")
const { bpConfig } = require("./bp-config")

const arriveAppointment = async (aptID) => {

  const params = [{ "name": "AptID", "type": sql.Int, "value": aptID }];
  
  const pool = await sql.connect(bpConfig)
  const result = await runStoredProcedure(pool, 'BP_ArriveAppointment', params)

  return result
}

// (async () => {
//   const result = await arriveAppointment(2)
//   console.log(result)
// })()

module.exports = {
  arriveAppointment
}