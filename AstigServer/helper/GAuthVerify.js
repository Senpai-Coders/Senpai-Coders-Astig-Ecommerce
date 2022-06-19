const { OAuth2Client } = require('google-auth-library')

//GoogleVerify OAUTH
const client = new OAuth2Client(process.env.GCLIENTID)

//para iverify ang google front end issued jwt
const verifyGauth = async (token, client_id) => {
    const ticket = await client.verifyIdToken({ idToken: token, audience: client_id });
    const payload = ticket.getPayload();
    const userid = payload['sub'];
    return payload
}

module.exports = verifyGauth