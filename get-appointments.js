const moment = require('moment')
const sql = require('mssql');
const { runStoredProcedure, aptTimeString } = require("./util")
const { bpConfig } = require("./bp-config");
const { parseTwoDigitYear } = require('moment');
//Every 5th slot will be dropped for clinic booking
const RESERVED_FOR_CLINIC_BOOKING = 5

const getFreeApts = (pool, secondsFromMidNight, startDate, numDays, userList) => {
  let allSlots = []
  const todayMidNight = new Date(moment(new Date()).format("YYYY-MM-DD")).getTime()
  
  const getAptsForUser = async (userID) => {
    let userAppointments = {
      "bpId": userID,
      "appointments": []
    }

    let curTick = startDate.getTime()
    let oneDay
    for (let i = 0; i < numDays; i++) {
      let date = new Date(curTick)
      // Skip Sundays
      if (date.getDay() == 0) {
        curTick = date.getTime() + 86400000
        date = new Date(curTick)
      }

      try {
        const params = [{ "name": "AptDate", "type": sql.Date, "value": date },
          { "name": "UserID", "type": sql.Int, "value": userID }];

        const result = await runStoredProcedure(pool, 'BP_GetFreeAppointments', params)
        let slots = []
        let slotNum = 0
        if (curTick === todayMidNight) {
          // Filter out obsolete slots and slots reserved for clinic booking
          result.recordset.forEach(item => {
            if (item.AppointmentTime >= secondsFromMidNight && (slotNum % RESERVED_FOR_CLINIC_BOOKING) > 0)
            slots.push({
              start: aptTimeString(item.AppointmentTime),
              duration: Math.floor(item.AppointmentLength / 60)
            })
            slotNum = slotNum + 1
          })
        } else {
          result.recordset.forEach(item => {
            if ((slotNum % RESERVED_FOR_CLINIC_BOOKING) > 0)
            slots.push({
              start: aptTimeString(item.AppointmentTime),
              duration: Math.floor(item.AppointmentLength / 60)
            })
            slotNum = slotNum + 1
          })
        }
        oneDay = {
          "date": moment(date).format("YYYY-MM-DD"),
          "slots": slots
        }
      } catch(err) {
        oneDay = {
          "date": moment(date).format("YYYY-MM-DD"),
          "slots": []
        }
      }
     
      userAppointments.appointments.push(oneDay)
      curTick = date.getTime() + 86400000
    }
    return userAppointments
  }

  return new Promise ((resolve, reject) => {
    Promise.allSettled(userList.map(userID => getAptsForUser(userID)))
    .then((results) => {
      results.forEach(result => {
        if (result.status == "fulfilled") {
          allSlots.push(result.value)
        }
      })
      // console.log(allSlots)
      resolve(allSlots)
    })
  })
}

const getAppointments = (req) => {
  return new Promise (async(resolve, reject) => {
    try {
      const pool = await sql.connect(bpConfig)
      const secondsFromMidNight = req.body.secondsFromMidNight
      const startDate = new Date(req.body.startDate)
      const { numDays, userList } = req.body
      const result = await getFreeApts(pool, secondsFromMidNight, startDate, numDays, userList)
      resolve(result)
      
    } catch (err) {
      reject(err)
    }
  })
}

module.exports = {
  getAppointments
}

// const getAptsTest = async (userID, startDate) => {
//   const params = [{ "name": "AptDate", "type": sql.Date, "value": startDate },
//   { "name": "UserID", "type": sql.Int, "value": userID }];

//   try {
//     const pool = await sql.connect(bpConfig)
//     const result = await runStoredProcedure(pool, 'BP_GetFreeAppointments', params)
//     console.log(result.recordset)
//   } catch(err) {
//     console.log('Practitioner is away')
//   }
// }

// getAptsTest(2000000564, '2021-10-11')