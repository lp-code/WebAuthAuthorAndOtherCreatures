/*
A module for getting quotes using the quotes api.
Strategy

- Use the O-B-O flow to get an access token for the quotes api
- Hit the quotes api with the access token and get a quote

*/



const got = require('got');
const FormData = require('form-data');

//The assertion param is the accesstoken we use in the assertion field when using the bob flow
async function getAccessToken(assertion) {

    console.log('Trying use exchange ' + assertion + ' for a new token O-B-O');
    const form = new FormData();

    //Build the form for the AT request using o-b-o
    form.append('grant_type','urn:ietf:params:oauth:grant-type:jwt-bearer');
    form.append('client_id',process.env.CLIENT_ID);
    form.append('client_secret',process.env.CLIENT_SECRET);
    form.append('assertion',assertion);
    form.append('scope','api://b7f6e800-ffa7-4ffc-920f-000ec3343bce/GetQuote');  //The scope we request for the Quote Api
    form.append('requested_token_use','on_behalf_of');
    

    //Creating a new instance of the got library which handles our http requests
    const atRequest = got.extend({
        prefixUrl: 'https://login.microsoftonline.com/3aa4a235-b6e2-48d5-9195-7fcf05b459b0/oauth2/v2.0/',
    });

    try {
        const response = await atRequest.post('token', {body: form});

        console.log(response.body);
        
        const body = JSON.parse(response.body);
        return body.access_token;
      } 
      catch (error) {
        console.log('Error getting AT for Quote API :: ' + error);
        return '';
    }   

};


async function getQuote(assertion) {

    var quote = 'No Quote is also a quote';

    const accessToken = await getAccessToken(assertion);
  
    try {
      const response = await got.get('http://localhost:3200/quote',{
      headers: {
          Authorization : 'Bearer ' + accessToken
      }});
      return response.body;
    } 
    catch (error) {
      console.log('Error getting Quote :: ' + error);
      return 'Quote Error'
    }
  
  };

module.exports = {getQuote};