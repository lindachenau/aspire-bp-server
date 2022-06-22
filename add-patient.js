const sql = require('mssql');
const { runStoredProcedure } = require("./util")
const { bpConfig } = require("./bp-config")

const addPatient = async (titleCode, firstname, surname, dob, sexCode, address1, city, postcode, 
  email, homePhone, workPhone, mobilePhone, medicareNo, medicareLineNo, medicareExpiry, pensionCode, pensionNo, pensionExpiry, ethnicCode) => {

  const params = [{ "name": "TitleCode", "type": sql.Int, "value": titleCode },
    { "name": "Firstname", "type": sql.VarChar, "value": firstname },
    { "name": "Middlename", "type": sql.VarChar, "value": "" },
    { "name": "Surname", "type": sql.VarChar, "value": surname },
    { "name": "Preferredname", "type": sql.VarChar, "value": "" },
    { "name": "Address1", "type": sql.VarChar, "value": address1 },
    { "name": "Address2", "type": sql.VarChar, "value": "" },
    { "name": "City", "type": sql.VarChar, "value": city },
    { "name": "Postcode", "type": sql.VarChar, "value": postcode },
    { "name": "PostalAddress", "type": sql.VarChar, "value": "" },
    { "name": "PostalCity", "type": sql.VarChar, "value": "" },
    { "name": "PostalPostCode", "type": sql.VarChar, "value": "" },
    { "name": "DoB", "type": sql.Date, "value": dob },
    { "name": "SexCode", "type": sql.Int, "value": sexCode },
    { "name": "HomePhone", "type": sql.VarChar, "value": homePhone },
    { "name": "WorkPhone", "type": sql.VarChar, "value": workPhone },
    { "name": "MobilePhone", "type": sql.VarChar, "value": mobilePhone },
    { "name": "MedicareNo", "type": sql.VarChar, "value": medicareNo },
    { "name": "MedicareLineNo", "type": sql.VarChar, "value": medicareLineNo },
    { "name": "MedicareExpiry", "type": sql.VarChar, "value": medicareExpiry },
    { "name": "PensionCode", "type": sql.Int, "value": pensionCode },
    { "name": "PensionNo", "type": sql.VarChar, "value": pensionNo },
    { "name": "PensionExpiry", "type": sql.Date, "value": pensionExpiry },
    { "name": "DVACode", "type": sql.Int, "value": 0 },
    { "name": "DVANo", "type": sql.VarChar, "value": "" },
    { "name": "RecordNo", "type": sql.VarChar, "value": "" },
    { "name": "ExternalID", "type": sql.VarChar, "value": "" },
    { "name": "Email", "type": sql.VarChar, "value": email },
    { "name": "HeadOfFamilyID", "type": sql.Int, "value": 0 },
    { "name": "EthnicCode", "type": sql.Int, "value": ethnicCode },
    { "name": "ConsentSMSReminder", "type": sql.Int, "value": 0 },
    { "name": "NextOfKinID", "type": sql.Int, "value": 0 },
    { "name": "GenderCode", "type": sql.Int, "value": 0 },
    { "name": "PronounCode", "type": sql.Int, "value": 0 }];
  
  const pool = await sql.connect(bpConfig)
  const result = await runStoredProcedure(pool, 'BP_AddPatient', params)

  // Patient ID
  return result.returnValue
}

// (async () => {
//   const result = await addPatient(0, "Test14", "Patient", "1986-10-04", 1, "", "", "", "", "", "", "", "", "", "", 0, "", null, 1013)
//   console.log(result)
// })()

module.exports = {
  addPatient
}
