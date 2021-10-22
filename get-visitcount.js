const sql = require('mssql');
const { bpConfig } = require("./bp-config")

const getNumVisits = async (id) => {
  const pool = await sql.connect(bpConfig)
  const result = await pool.request()
  .query(`SELECT VISITDATE from VISITS where INTERNALID = ${id}`)

return result.recordset.length
}

// (async () => {
//   const result = await getNumVisits(30633)
//   console.log(result)
// })()

module.exports = {
  getNumVisits
}
