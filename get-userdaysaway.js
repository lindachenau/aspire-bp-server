const sql = require('mssql');
const { runStoredProcedure } = require("./util")
const { bpConfig } = require("./bp-config")

const getUserDaysAway = async (userID, startDate) => {

  const params = [{ "name": "UserID", "type": sql.Int, "value": userID }, 
    { "name": "Start", "type": sql.Date, "value": startDate }];
  
  const pool = await sql.connect(bpConfig)
  const result = await runStoredProcedure(pool, 'BP_GetUserDaysAway', params)

  return result.recordset
}

(async () => {
  const result = await getUserDaysAway(47, '2021-04-10')
  console.log(result)
})()