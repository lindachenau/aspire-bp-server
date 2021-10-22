const sql = require('mssql');
const { runStoredProcedure } = require("./util")
const { bpConfig } = require("./bp-config")

const addClinicalNote = async (patID, visitText, locationID) => {

  const params = [{ "name": "PatientID", "type": sql.Int, "value": patID },
    { "name": "VisitText", "type": sql.VarChar, "value": visitText },
    { "name": "LocationID", "type": sql.Int, "value": locationID} ];
  
  const pool = await sql.connect(bpConfig)
  const result = await runStoredProcedure(pool, 'BP_AddClinicalNote', params)

  return result.returnValue
}

// module.exports = {
//   addClinicalNote
// }

(async () => {
  const result = await addClinicalNote(7, "Nursing home visit", 2)
  console.log(result)
})()