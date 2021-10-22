const sql = require('mssql');
const { runStoredProcedure } = require("./util")
const { bpConfig } = require("./bp-config")

const getPatient = async (surname, dob) => {

  const params = [{ "name": "Surname", "type": sql.VarChar, "value": surname },
    { "name": "DoB", "type": sql.Date, "value": dob }];
  
  const pool = await sql.connect(bpConfig)
  const result = await runStoredProcedure(pool, 'BP_GetPatientByPartSurnameDOB', params)

  let list = []
  if (result.recordset.length > 0) {
    list = result.recordset.map(pat => {
      return {
        id: pat.InternalID,
        firstname: pat.Firstname
      }
    })
  }
  
  return list
}

// (async () => {
//   const result = await getPatient("Yu", "1992-10-04")
//   console.log(result)
// })()

module.exports = {
  getPatient
}
