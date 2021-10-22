const sql = require('mssql');
const { runStoredProcedure } = require("./util")
const { bpConfig } = require("./bp-config")

const getAllUsers = async () => {

  const params = [];
  
  const pool = await sql.connect(bpConfig)
  const result = await runStoredProcedure(pool, 'BP_GetAllUsers', params)

  const users = result.recordset.map(item => {
    return {
      userID: item.UserID, 
      surname: item.Surname,
      firstname: item.Firstname,
      role: item.GroupName,
      hasAppointments: item.Appointments
    }
  })

  return users
}

(async () => {
  const result = await getAllUsers()
  console.log(result)
})()