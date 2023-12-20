require('dotenv').config()

const bpConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  server: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  pool: {
    max: 15,
    min: 0,
    idleTimeoutMillis: 10000
  },
  options: {
    cryptoCredentialsDetails: {
      minVersion: 'TLSv1'
    }
  }
}

//Appt length based on appt type
const newPatientAptType = 4
const longApptType = 2
const followupApptType = 110
const initialApptType = 109

const telephoneConsultation = 30
const telehealthCconsultation = 29
const apptRecordBooked = 1
const apptStatusBooked = 1
const apptStatusDNA = 10

const userIDs = {
  "1" : "Vaccination Clinic",
  "2000000570": "Kai Yu",
  "5" : "Lina Wee",
  "43" : "Adrian Wan",
  "44" : "Yiping Zeng",
  "17" : "Matthew Kong",
  "18" : "Catherine Lok",
  "22" : "Emilia Tiainen"
}

module.exports = {
  bpConfig,
  newPatientAptType,
  longApptType,
  followupApptType,
  initialApptType,
  telephoneConsultation,
  telehealthCconsultation,  
  apptRecordBooked,
  apptStatusBooked,
  apptStatusDNA,
  userIDs
}
