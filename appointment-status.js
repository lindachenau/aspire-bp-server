const sql = require('mssql');
const { runStoredProcedure } = require("./util")
const { bpConfig } = require("./bp-config")
const moment = require('moment')

const appointmentStatus = async (aptID) => {

  const params = [{ "name": "AptID", "type": sql.Int, "value": aptID }];
  
  const pool = await sql.connect(bpConfig)
  const result1 = await runStoredProcedure(pool, 'BP_GetAppointmentDetails', params)
  const details = result1.recordset[0]
  const apt = {
    patient: `${details.Firstname.trim()} ${details.Surname.trim()}`,
    aptDate: moment(new Date(details.AppointmentDate)).format("YYYY-MM-DD"),
    aptTime: aptTimeString(details.AppointmentTime),
    aptType: details.AppointmentType,
    aptDescription: details.Description.trim(),
    provider: `${details.UserTitle.trim()} ${details.UserFirstname.trim()} ${details.UserSurname.trim()}`
  }

  const queryStr = `SELECT Appointments.RECORDSTATUS from Appointments where Appointments.RECORDID=${aptID}`
  const result2 = await pool.request()
    .query(queryStr)  

  apt.status = result2.recordset[0].RECORDSTATUS  
  
  return apt
}

(async () => {
  const result = await appointmentStatus(36455)
  console.log(result)
})()

module.exports = {
  appointmentStatus
}