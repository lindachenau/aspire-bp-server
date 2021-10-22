const sql = require('mssql');
const { bpConfig } = require("./bp-config")

const contactsHeader =  [
  {id: 'ContactID', title: 'ID'},
  {id: 'Title', title: 'Title'},
  {id: 'Firstname', title: 'Firstname'}, 
  {id: 'Surname', title: 'Surname'},
  {id: 'Greeting', title: 'Greeting'},
  {id: 'Category', title: 'Category'},
  {id: 'AHPhone', title: 'AHPhone'},
  {id: 'MobilePhone', title: 'Mobile'},
  {id: 'Email', title: 'Email'},
  {id: 'ProviderNo', title: 'ProviderNo'},
  {id: 'URL', title: 'URL'},
  {id: 'Comment', title: 'Comment'}
]

const contactAddressesHeader =  [
  {id: 'ContactID', title: 'ID'},
  {id: 'Address1', title: 'Address'},
  {id: 'City', title: 'City'},
  {id: 'Postcode', title: 'Postcode'},
  {id: 'Phone', title: 'Phone'},
  {id: 'Fax', title: 'Fax'},
  {id: 'SiteEmail', title: 'SiteEmail'},
  {id: 'SiteComment', title: 'SiteComment'}
]

const createCsvWriter = require('csv-writer').createObjectCsvWriter;

const getContactAddresses = async () => {
  try {
    const pool = await sql.connect(bpConfig)
    const result = await pool.request()
    .query(`SELECT * from BPS_CONTACTADDRESSES`)

    const contacts = result.recordset.map((item) => {
      return {
        ContactID: item.ContactID,
        Address1: item.Address1?.trim(),
        City: item.City?.trim(),
        Postcode: item.Postcode?.trim(),
        Phone: item.Phone?.trim(),
        Fax: item.Fax?.trim(),
        SiteEmail: item.SiteEmail?.trim(),
        SiteComment: item.SiteComment?.trim()
      }
    })

    const csvWriter = createCsvWriter({
      path: 'contact-addresses.csv',
      header: contactAddressesHeader
    })

    csvWriter
    .writeRecords(contacts)
    .then(() => console.log('contact-addresses.csv was written successfully.'))

  } catch (err) {
    console.log(err)
  }
}

const getContacts = async () => {
  try {
    const pool = await sql.connect(bpConfig)
    const result = await pool.request()
    .query(`SELECT * from BPS_CONTACTS`)

    const contacts = result.recordset.map((item) => {
      return {
        ContactID: item.ContactID,
        Title: item.Title?.trim(),
        Firstname: item.Firstname?.trim(),
        Surname: item.Surname?.trim(),
        Greeting: item.Greeting?.trim(),
        Category: item.Category?.trim(),
        AHPhone: item.AHPhone?.trim(),
        MobilePhone: item.MobilePhone?.trim(),
        Email: item.Email?.trim(),
        ProviderNo: item.ProviderNo?.trim(),
        URL: item.URL?.trim(),
        Comment: item.Comment?.trim(),
      }
    })

    const csvWriter = createCsvWriter({
      path: 'contacts.csv',
      header: contactsHeader
    })

    csvWriter
    .writeRecords(contacts)
    .then(() => console.log('contacts.csv was written successfully.'))

  } catch (err) {
    console.log(err)
  }
}

getContacts()
getContactAddresses()
