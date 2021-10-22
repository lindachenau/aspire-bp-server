const sql = require('mssql');
const { runStoredProcedure } = require("./util")
const { bpConfig } = require("./bp-config")

const getPatientInfo = async (patientID) => {

  const params = [{ "name": "PatientID", "type": sql.Int, "value": patientID }];
  
  const pool = await sql.connect(bpConfig)
  const result = await runStoredProcedure(pool, 'BP_GetPatientByInternalID', params)
  const record = result.recordset[0]
  const {InternalID, MedicareNo, MedicareLineNo, MedicareExpiry, PensionCode, PensionNo, PensionExpiry, 
    HomePhone, WorkPhone, MobilePhone, Address1, City, Postcode, Email} = record
    
  return {
    patientID: InternalID, 
    medicareNo: MedicareNo?.trim(), 
    medicareLineNo: MedicareLineNo?.trim(), 
    medicareExpiry: MedicareExpiry?.trim(), 
    pensionCode: PensionCode, 
    pensionNo: PensionNo?.trim(), 
    pensionExpiry: PensionExpiry, 
    homePhone: HomePhone?.trim(), 
    workPhone: WorkPhone?.trim(), 
    mobilePhone: MobilePhone?.trim(), 
    address1: Address1?.trim(), 
    city: City?.trim(), 
    postcode: Postcode?.trim(), 
    email: Email?.trim()   
  }
}

const updatePatientMedicare = async (patientID, medicareNo, medicareLineNo, medicareExpiry) => {

  const params = [{ "name": "PatientID", "type": sql.Int, "value": patientID },
    { "name": "MedicareNo", "type": sql.VarChar, "value": medicareNo },
    { "name": "MedicareLineNo", "type": sql.VarChar, "value": medicareLineNo },
    { "name": "MedicareExpiry", "type": sql.VarChar, "value": medicareExpiry }];
  
  const pool = await sql.connect(bpConfig)
  const result = await runStoredProcedure(pool, 'BP_UpdatePatientMedicare', params)
  
  return result.returnValue
}

const updatePatientPension = async (patientID, pensionCode, pensionNo, pensionExpiry) => {

  const params = [{ "name": "PatientID", "type": sql.Int, "value": patientID },
    { "name": "PensionCode", "type": sql.Int, "value": pensionCode },
    { "name": "PensionNo", "type": sql.VarChar, "value": pensionNo },
    { "name": "PensionStart", "type": sql.Date, "value": null },
    { "name": "PensionExpiry", "type": sql.Date, "value": pensionExpiry }];
  
  const pool = await sql.connect(bpConfig)
  const result = await runStoredProcedure(pool, 'BP_UpdatePatientPension', params)
  
  return result.returnValue
}

const updatePatientContacts = async (patientID, homePhone, workPhone, mobilePhone) => {

  const params = [{ "name": "PatientID", "type": sql.Int, "value": patientID },
    { "name": "HomePhone", "type": sql.VarChar, "value": homePhone },
    { "name": "WorkPhone", "type": sql.VarChar, "value": workPhone },
    { "name": "MobilePhone", "type": sql.VarChar, "value": mobilePhone }];
  
  const pool = await sql.connect(bpConfig)
  const result = await runStoredProcedure(pool, 'BP_UpdatePatientContacts', params)
  
  return result.returnValue
}

const updatePatientAddress = async (patientID, address1, city, postcode) => {

  const params = [{ "name": "PatientID", "type": sql.Int, "value": patientID },
    { "name": "Address1", "type": sql.VarChar, "value": address1 },
    { "name": "Address2", "type": sql.VarChar, "value": null },
    { "name": "City", "type": sql.VarChar, "value": city },
    { "name": "Postcode", "type": sql.VarChar, "value": postcode }];
  
  const pool = await sql.connect(bpConfig)
  const result = await runStoredProcedure(pool, 'BP_UpdatePatientAddress', params)
  
  return result.returnValue
}

const updatePatientEmail = async (patientID, email) => {

  const params = [{ "name": "PatientID", "type": sql.Int, "value": patientID },
    { "name": "Email", "type": sql.VarChar, "value": email }];
  
  const pool = await sql.connect(bpConfig)
  const result = await runStoredProcedure(pool, 'BP_UpdatePatientEmail', params)
  
  return result.returnValue
}

(async () => {
  const result = await getPatientInfo(1)
  console.log(result)
})()

// (async () => {
//   const result = await updatePatientMedicare(46954, "1234567890", "1", "11/2024")
//   console.log(result)
// })()

module.exports = {
  getPatientInfo,
  updatePatientMedicare,
  updatePatientPension,
  updatePatientContacts,
  updatePatientAddress,
  updatePatientEmail
}