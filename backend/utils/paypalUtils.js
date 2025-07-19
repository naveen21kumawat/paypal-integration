const axios = require("axios");

const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET;

exports.getAccessToken = async () => {
  const response = await axios({
    url: "https://api-m.sandbox.paypal.com/v1/oauth2/token",
    method: "post",
    headers: {
      Accept: "application/json",
      "Accept-Language": "en_US",
      "Content-Type": "application/x-www-form-urlencoded",
    },
    auth: {
      username: PAYPAL_CLIENT_ID,
      password: PAYPAL_CLIENT_SECRET,
    },
    data: "grant_type=client_credentials",
  });

  return response.data.access_token;
};
