const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();
const gql = require('graphql-tag');
const graphql = require('graphql');
const { print } = graphql;

const contactByPhoneGql = gql`
query ContactByPhone(
  $phone: String
  $sortDirection: ModelSortDirection
  $filter: ModelContactFilterInput
  $limit: Int
  $nextToken: String
) {
  contactByPhone(
    phone: $phone
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      id
      firstName
      lastName
      phone
      email
      companyName
      createdAt
      updatedAt
    }
    nextToken
  }
}
`;

const contactByPhone = async (phone) => {
  try {
    const graphqlData = await axios({
      url: process.env.API_URL,
      method: 'post',
      headers: {
        'x-api-key': process.env.API_KEY
      },
      data: {
        query: print(contactByPhoneGql),
        variables: {
          phone: phone
        }
      }
    });
    const contacts = graphqlData.data.data.contactByPhone.items
    if (contacts.length > 0)
      return contacts[0]
    else
      return {}

  } catch (err) {
    console.log('error contactByPhone : ', err);
  } 
}

module.exports = {
  contactByPhone
}