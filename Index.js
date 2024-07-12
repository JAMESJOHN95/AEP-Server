const axios = require('axios');

const getToken = async () => {
  const config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: 'https://ims-na1.adobelogin.com/ims/token/v2',
    params: {
      grant_type: 'client_credentials',
      client_id: '2383827e418049e3ad41507d03374c2f',
      client_secret: 'p8e-BFwVvzGn6O6ir39CaaMdkvDta0Dww2vu',
      scope: 'openid,AdobeID,read_organizations,additional_info.projectedProductContext,session'
    },
    headers: { 
      'Cookie': 'ftrset=545; relay=667041c1-1a29-4ec2-b375-aa760049df64'
    }
  };

  try {
    const response = await axios(config);
    const token = response.data.access_token;
    console.log('Token:', token); // Log the token to the console or do further processing

    // You can return the token or handle it as needed
    return token;
  } catch (error) {
    console.error('Error fetching token:', error);
    throw error; // Handle errors appropriately in your application
  }
};

module.exports = { getToken };