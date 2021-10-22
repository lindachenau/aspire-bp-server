const sql = require('mssql')
const moment = require('moment')
const { bpConfig } = require("./bp-config")

const runStoredProcedure = async (pool, sPName, sqlParams) => {
  try {
    const result = await pool.request()
    sqlParams.forEach(function (param) {
        result.input(param.name, param.type, param.value);
    })
    return await result.execute(sPName)    
  } catch (err) {
    console.log(err)
  }
} 

const aptsToStrings = (aptTimeArr) => {
  let result = [] 
  const aptTimeString = (value, index, array) => {
    // Time of the available appointment, measured in seconds since 00:00:00
    let hour = Math.floor(value / 3600)
    let min = value % 3600 / 60
    const amORpm = hour < 12 ? 'am' : 'pm'
    if (hour > 12) {hour = hour - 12}   
    if (min < 10) {min = "0" + min}
    const timeString = `${hour}:${min} ${amORpm}`
    result.push(timeString)
  }

  aptTimeArr.forEach(aptTimeString)  
  return result
}

const getFreeApts = (pool, startDate, numDays, userList = []) => {
  const allUsers = userList.length > 0 ? userList : [1, 23, 47, 57]
  let allSlots = []

  const getAptsForUser = async (userID) => {
    let userAppointments = {
      "bpId": userID,
      "appointments": []
    }

    let curTick = startDate.getTime()
    for (let i = 0; i < numDays; i++) {
      let date = new Date(curTick)
      if (date.getDay() == 0) {
        curTick = date.getTime() + 86400000
        date = new Date(curTick)
      }

      const params = [{ "name": "AptDate", "type": sql.Date, "value": date },
        { "name": "UserID", "type": sql.Int, "value": userID }];

      const result = await runStoredProcedure(pool, 'BP_GetFreeAppointments', params)
      let oneDay = {
        "date": moment(date).format("YYYY-MM-DD"),
        "slots": aptsToStrings(result.recordset.map(item => item.AppointmentTime))
      }
      userAppointments.appointments.push(oneDay)
      curTick = date.getTime() + 86400000
    }
    return userAppointments
  }

  return new Promise ((resolve, reject) => {
    Promise.allSettled(allUsers.map(userID => getAptsForUser(userID)))
    .then((results) => {
      results.forEach(result => {
        if (result.status == "fulfilled") {
          allSlots.push(result.value)
        }
      })
      resolve(allSlots)
    })
  })
}

const connect = async () => {
  try {
    const pool = await sql.connect(bpConfig)
    // const result1 = await pool.request()
    //   .input('input_parameter', sql.NVarChar, '1966-10-04')
    //   .query('select RECORDSTATUS,IHISTATUS,IHIVALIDATED,MEDICARENO,MEDICARELINENO,INTERNALID,FIRSTNAME,SURNAME,DOB from Patients where dob = @input_parameter')
    
    // console.log(result1.recordset)

    const result2 = await getFreeApts(pool, new Date(), 5)
    console.log(result2)
    
  } catch (err) {
    console.log(err)
  }
}

connect()