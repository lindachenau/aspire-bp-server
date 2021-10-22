const sql = require('mssql');
const { runStoredProcedure } = require("./util")
const { bpConfig } = require("./bp-config")

const getPracticeLocations = async () => {

  const pool = await sql.connect(bpConfig)
  const result = await runStoredProcedure(pool, 'BP_GetPracticeLocations', [])

  return result.recordset
}

(async () => {
  const result = await getPracticeLocations()
  console.log(result)
})()