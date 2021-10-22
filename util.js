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
  const minute = slot.slice(indexOfPeriod + 1, indexOfPeriod + 3)
  const result = hour * 3600 + minute * 60
  return result
}

module.exports = {
  runStoredProcedure,
  aptTimeString,
  aptsToStrings,
  slotToSeconds
}
