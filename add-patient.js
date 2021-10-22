const sql = require('mssql');
const { runStoredProcedure } = require("./util")
const { bpConfig } = require("./bp-config")

const addPatient = async (titleCode, firstname, surname, dob, sexCode) => {

  const params = [{ "name": "TitleCode", "type": sql.Int, "value": titleCode },
    { "name": "Firstname", "type": sql.VarChar, "value": firstname },
    { "name": "Middlename", "type": sql.VarChar, "value": "" },
    { "name": "Surname", "type": sql.VarChar, "value": surname },
    { "name": "Preferredname", "type": sql.VarChar, "value": "" },
    { "name": "Address1", "type": sql.VarChar, "value": "" },
    { "name": "Address2", "type": sql.VarChar, "value": "" },
    { "name": "City", "type": sql.VarChar, "value": "" },
    { "name": "Postcode", "type": sql.VarChar, "value": "" },
    { "name": "PostalAddress", "type": sql.VarChar, "value": "" },
    { "name": "PostalCity", "type": sql.VarChar, "value": "" },
    { "name": "PostalPostCode", "type": sql.VarChar, "value": "" },
    { "name": "DoB", "type": sql.Date, "value": dob },
    { "name": "SexCode", "type": sql.Int, "value": sexCode },
    { "name": "HomePhone", "type": sql.VarChar, "value": "" },
    { "name": "WorkPhone", "type": sql.VarChar, "value": "" },
    { "name": "MobilePhone", "type": sql.VarChar, "value": "" },
    { "name": "MedicareNo", "type": sql.VarChar, "value": "" },
    { "name": "MedicareLineNo", "type": sql.VarChar, "value": "" },
    { "name": "MedicareExpiry", "type": sql.VarChar, "value": "" },
    { "name": "PensionCode", "type": sql.Int, "value": 0 },
    { "name": "PensionNo", "type": sql.VarChar, "value": "" },
    { "name": "PensionExpiry", "type": sql.Date, "value": null },
    { "name": "DVACode", "type": sql.Int, "value": 0 },
    { "name": "DVANo", "type": sql.VarChar, "value": "" },
    { "name": "RecordNo", "type": sql.VarChar, "value": "" },
    { "name": "ExternalID", "type": sql.VarChar, "value": "" },
    { "name": "Email", "type": sql.VarChar, "value": "" }];
  
  const pool = await sql.connect(bpConfig)
  const result = await runStoredProcedure(pool, 'BP_AddPatient', params)

  // Patient ID
  return result.returnValue
}

// (async () => {
//   const result = await addPatient(0, "Sooty", "Yu", "1991-10-04", 1)
//   console.log(result)
// })()

module.exports = {
  addPatient
}
