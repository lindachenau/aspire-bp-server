const sql = require('mssql');
const { bpConfig } = require("./bp-config")

const runQuery = async (query, table) => {
  try {
    const pool = await sql.connect(bpConfig)
    const result = await pool.request()
    .query(`SELECT ${query} from ${table}`)

    console.log(result.recordset)

  } catch (err) {
    console.log(err)
  }
}

runQuery('USERID,FIRSTNAME,SURNAME', 'USERS')

