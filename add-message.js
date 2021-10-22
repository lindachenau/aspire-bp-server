const sql = require('mssql');
const { runStoredProcedure } = require("./util")
const { bpConfig } = require("./bp-config")

const addMessage = async (userID, subject, message, patID) => {

  const params = [{ "name": "UserID", "type": sql.Int, "value": userID },
    { "name": "Subject", "type": sql.VarChar, "value": subject },
    { "name": "Message", "type": sql.VarChar, "value": message },
    { "name": "PatID", "type": sql.Int, "value": patID }];
  
  const pool = await sql.connect(bpConfig)
  const result = await runStoredProcedure(pool, 'BP_AddMessage', params)

  return result.returnValue
}

module.exports = {
  addMessage
}

// (async () => {
//   const result = await addMessage(2000000564, "BP_AddMessage test", "Does it work?", 2)
//   console.log(result)
// })()