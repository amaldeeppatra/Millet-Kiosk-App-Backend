require('dotenv').config();
const express = require('express');
const router = express.Router();
const {OAuth2Client} = require('google-auth-library');

async function getUserData(access_token){
    const response = await fetch(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${access_token}`);
    const data = await response.json();
    console.log('data: ', data);
}

router.get('/', async (req, res, next) => {
    const code = req.query.code;
    try{
        const redirectUrl = 'http://localhost:5000/auth/google/callback';
        const oAuth2Client = new OAuth2Client(
            process.env.GOOGLE_CLIENT_ID,
            process.env.GOOGLE_CLIENT_SECRET,
            redirectUrl
        );
        const res = await oAuth2Client.getToken(code);
        await oAuth2Client.setCredentials(res.tokens);
        console.log('Tokens acquired');
        const user = oAuth2Client.credentials;
        console.log('credentials: ', user);
        await getUserData(user.access_token);
    }
    catch(err){
        console.log('Error: ', err);
    }
});

module.exports = router;