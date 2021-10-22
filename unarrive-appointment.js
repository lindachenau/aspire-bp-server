const sql = require('mssql');
const { runStoredProcedure } = require("./util")
const { bpConfig } = require("./bp-config")

const unarriveAppointment = async (aptID) => {

  const params = [{ "name": "AptID", "type": sql.Int, "value": aptID }];
  
  const pool = await sql.connect(bpConfig)
  const result = await runStoredProcedure(pool, 'BP_UnarriveAppointment', params)

  return result
}

(async () => {
  const result = await unarriveAppointment(6)
  console.log(result)
})()

module.exports = {
  unarriveAppointment
}