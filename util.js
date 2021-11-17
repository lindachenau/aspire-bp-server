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

const aptTimeString = (value) => {
  // Time of the available appointment, measured in seconds since 00:00:00
  let hour = Math.floor(value / 3600)
  let min = Math.round(value % 3600 / 60)
  const amORpm = hour < 12 ? 'am' : 'pm'
  if (hour > 12) {hour = hour - 12}   
  if (min < 10) {min = "0" + min}
  const timeString = `${hour}:${min} ${amORpm}`
  return timeString
}

const aptsToStrings = (aptTimeArr) => {
  const result = aptTimeArr.map(value => aptTimeString(value))
  return result
}

// Convert slot in 9:00 am 2:15 pm format to seconds since 00:00:00
const slotToSeconds = (slot) => {
  const indexOfPeriod = slot.indexOf(":")
  const amORpm = slot.substr(-2, 2)
  let hour = parseInt(slot.slice(0, indexOfPeriod))
  if (amORpm == "pm") {hour = hour + 12}
  const minute = parseInt(slot.slice(indexOfPeriod + 1, indexOfPeriod + 3))
  const result = hour * 3600 + minute * 60
  return result
}

const slotToMinutes = (slot) => {
  const indexOfPeriod = slot.indexOf(":")
  const amORpm = slot.substr(-2, 2)
  let hour = parseInt(slot.slice(0, indexOfPeriod))
  if (amORpm == "pm") {hour = hour + 12}
  const minute = slot.slice(indexOfPeriod + 1, indexOfPeriod + 3)
  const result = hour * 60 + parseInt(minute)
  return result
}

const localDate = (aptDate, slot) => {
  const minutes = slotToMinutes(slot)
  const y = aptDate.slice(0, 4)
  const mon = aptDate.slice(5, 7) - 1 // Jan is 0
  const d = aptDate.slice(8)
  const h = Math.floor(minutes / 60)
  const min = minutes % 60
  return new Date(y, mon, d, h, min)
}

module.exports = {
  runStoredProcedure,
  aptTimeString,
  aptsToStrings,
  slotToSeconds,
  localDate
}
