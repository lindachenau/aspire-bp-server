const sql = require('mssql');
const { runStoredProcedure } = require("./util")
const { bpConfig } = require("./bp-config")

const getPatientInfo = async (patientID) => {

  const params = [{ "name": "PatientID", "type": sql.Int, "value": patientID }];
  
  const pool = await sql.connect(bpConfig)
  const result = await runStoredProcedure(pool, 'BP_GetPatientByInternalID', params)
  const record = result.recordset[0]
  const {InternalID, MedicareNo, MedicareLineNo, MedicareExpiry, PensionCode, PensionNo, PensionExpiry, 
    HomePhone, WorkPhone, MobilePhone, Address1, City, Postcode, Email, DVACode, DVANo} = record
    
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
    email: Email?.trim(),
    dVACode: DVACode,
    dVANo: DVANo?.trim()
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

const updatePatientDVA = async (patientID, dVACode, dVANo) => {

  const params = [{ "name": "PatientID", "type": sql.Int, "value": patientID },
    { "name": "DVACode", "type": sql.Int, "value": dVACode },
    { "name": "DVANo", "type": sql.VarChar, "value": dVANo }];
  
  const pool = await sql.connect(bpConfig)
  const result = await runStoredProcedure(pool, 'BP_UpdatePatientDVA', params)
  
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

const setEmergencyContact = async (patientID, firstname, surname, contactPhone, relationship) => {

  const params = [{ "name": "InternalId", "type": sql.Int, "value": patientID },
    { "name": "TitleCode", "type": sql.Int, "value": 0 },
    { "name": "Surname", "type": sql.VarChar, "value": surname },
    { "name": "Firstname", "type": sql.VarChar, "value": firstname },
    { "name": "Address", "type": sql.VarChar, "value": "" },
    { "name": "City", "type": sql.VarChar, "value": "" },
    { "name": "Postcode", "type": sql.VarChar, "value": "" },
    { "name": "ContactPhone", "type": sql.VarChar, "value": contactPhone },
    { "name": "Relationship", "type": sql.VarChar, "value": relationship },
    { "name": "ContactPhone2", "type": sql.VarChar, "value": "" }];
  
  const pool = await sql.connect(bpConfig)
  const result = await runStoredProcedure(pool, 'BP_SetEmergencyContact', params)

  return result.returnValue
}

const updateHealthFund = async (patientID, healthFundNo, healthFundName, healthFundExpiry) => {

  const params = [{ "name": "PatientID", "type": sql.Int, "value": patientID },
  { "name": "HealthfundNo", "type": sql.VarChar, "value": healthFundNo },
  { "name": "HealthFundName", "type": sql.VarChar, "value": healthFundName },
  { "name": "HealthFundID", "type": sql.Int, "value": 0 },
  { "name": "HealthFundExpiry", "type": sql.Date, "value": healthFundExpiry }];
  
  const pool = await sql.connect(bpConfig)
  const result = await runStoredProcedure(pool, 'BP_UpdatePatientHealthFund', params)

  return result.returnValue
}

const updatePatient = async (patientID, titleCode, firstname, surname, dob, sexCode, address1, city, postcode, 
  email, homePhone, workPhone, mobilePhone, medicareNo, medicareLineNo, medicareExpiry, 
  pensionCode, pensionNo, pensionExpiry, dVACode, dVANo) => {

  const params = [{ "name": "PatientID", "type": sql.Int, "value": patientID },
    { "name": "TitleCode", "type": sql.Int, "value": titleCode },
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
    { "name": "DVACode", "type": sql.Int, "value": dVACode },
    { "name": "DVANo", "type": sql.VarChar, "value": dVANo },
    { "name": "RecordNo", "type": sql.VarChar, "value": "" },
    { "name": "ExternalID", "type": sql.VarChar, "value": "" },
    { "name": "Email", "type": sql.VarChar, "value": email }];
  
  const pool = await sql.connect(bpConfig)
  const result = await runStoredProcedure(pool, 'BP_UpdatePatient', params)
  
  return result.returnValue
}

// (async () => {
//   const result = await getPatientInfo(27)
//   console.log(result)
// })()

// (async () => {
//   const result = await updatePatientMedicare(46954, "1234567890", "1", "11/2024")
//   console.log(result)
// })()

module.exports = {
  getPatientInfo,
  updatePatientMedicare,
  updatePatientPension,
  updatePatientDVA,
  updatePatientContacts,
  updatePatientAddress,
  updatePatientEmail,
  setEmergencyContact,
  updateHealthFund,
  updatePatient
}
