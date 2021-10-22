const sql = require('mssql');
const moment = require('moment')
const { bpConfig } = require("./bp-config")

const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const csvWriter = createCsvWriter({
  path: 'patients.csv',
  header: [
    {id: 'INTERNALID', title: 'ID'},
    {id: 'MEDICARENO', title: 'Medicare No'},
    {id: 'DOB', title: 'DOB'},
    {id: 'SURNAME', title: 'Surname'},
    {id: 'FIRSTNAME', title: 'First name'},
    {id: 'SEXCODE', title: 'Sex code'},
    {id: 'EMAIL', title: 'Email'},
    {id: 'VISITS', title: 'No. of visits'}
  ]
});

const csvWriter2 = createCsvWriter({
  path: 'duplicated-patients.csv',
  header: [
    {id: 'INTERNALID', title: 'ID'},
    {id: 'MEDICARENO', title: 'Medicare No'},
    {id: 'DOB', title: 'DOB'},
    {id: 'SURNAME', title: 'Surname'},
    {id: 'FIRSTNAME', title: 'First name'},
    {id: 'SEXCODE', title: 'Sex code'},
    {id: 'EMAIL', title: 'Email'},
    {id: 'VISITS', title: 'No. of visits'}
  ]
});

const checkNumVisits = async (pool, id) => {
  const result = await pool.request()
    .query(`SELECT VISITDATE from VISITS where INTERNALID = ${id}`)
  
  return result.recordset.length
}

const getActivePatients = async () => {
  try {
    const pool = await sql.connect(bpConfig)
    const result = await pool.request()
      .query('SELECT Patients.INTERNALID,Patients.MEDICARENO,Patients.FIRSTNAME,Patients.SURNAME,Patients.DOB,Patients.SEXCODE,EMAIL.EMAIL from Patients LEFT JOIN EMAIL ON Patients.INTERNALID=EMAIL.INTERNALID where Patients.RECORDSTATUS = 1')
      
    const patients = result.recordset.map((item) => {
      return {
        INTERNALID: item.INTERNALID,
        MEDICARENO: item.MEDICARENO,
        DOB: moment(item.DOB).format("YYYY-MM-DD"),
        SURNAME : item.SURNAME.trim(),
        FIRSTNAME: item.FIRSTNAME.trim(),
        SEXCODE: item.SEXCODE,
        EMAIL: item.EMAIL,
        VISITS: 0,
        STRING: `${item.DOB} ${item.SURNAME.toUpperCase()} ${item.SEXCODE}`
      }
    })
    let sortedPatients = Object.values(patients).sort((a, b) => {
      let patient1 = a.DOB + a.SURNAME + a.SEXCODE
      let patient2 = b.DOB + b.SURNAME + b.SEXCODE
      if (patient1 < patient2)
        return -1
      else if (patient1 > patient2)
        return 1
      else
        return 0
    })
    
    console.log(`There are ${sortedPatients.length} patient records.`)

    const fetchNumVisits = async (startIndex, endIndex) => {
      console.log(`Fetching ${startIndex} to ${endIndex}`)
      await Promise.allSettled(sortedPatients.slice(startIndex, endIndex).map(patient => checkNumVisits(pool, patient.INTERNALID)))
      .then((results) => {
        console.log(`Fetched ${startIndex} to ${endIndex}`)
        results.forEach((result, index, array) => {
          if (result.status == "fulfilled") {
            sortedPatients[index + startIndex].VISITS = result.value
          } else {
            sortedPatients[index + startIndex].VISITS = '?'
          }
        })
      })
    }
    
    /*
    * Check how many visits for each patient
    * There are 40,000+ records. Split into sets of 10,000 async queries otherwise the later promises will be rejected.
    */
    const batch = 10000
    const lastBatch = Math.floor(sortedPatients.length / batch)
    for (let i = 0; i <= lastBatch; i++) {
      const startIndex = batch * i
      const endIndex = i === lastBatch? sortedPatients.length : batch * (i + 1)
      await fetchNumVisits(startIndex, endIndex)
    }

    //Remove patients with ZERO visit
    const visitedPatients = sortedPatients.filter(patient => patient.VISITS > 0)

    csvWriter
      .writeRecords(visitedPatients)
      .then(() => console.log('patients.csv was written successfully.'))

    let duplicatedPatients = []
    let duplications = 0
    for (let i  = 1; i < visitedPatients.length;)
    {
      const patient1 = visitedPatients[i - 1]
      const patient2 = visitedPatients[i]      
      if (patient1.STRING == patient2.STRING) {
        let name1 = patient1.FIRSTNAME.toUpperCase()
        let name2 = patient2.FIRSTNAME.toUpperCase()
        const len1 = name1.split(' ').length
        const len2 = name2.split(' ').length
        name1 = name1.replace(/-| /g,'')
        name2 = name2.replace(/-| /g,'')
        // Don't try to match single word names such as Heng != Hen
        if ((len1 == 1 && len2 == 1 && name1 == name2) || ((len1 + len2) > 2 && (name1.includes(name2) || name2.includes(name1)))) {
          duplicatedPatients.push(patient1)
          duplicatedPatients.push(patient2)
          duplications++
          i = i + 2
        } else {
          i++
        }
      } else {
        i++
      }
    }

    console.log(`There are ${duplications} duplicated patient records.`)

    csvWriter2
      .writeRecords(duplicatedPatients)
      .then(() => console.log('duplicated-patients.csv was written successfully.'))

  } catch (err) {
    console.log(err)
  }
}

getActivePatients()