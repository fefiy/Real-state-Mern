const {auth} = require('express-oauth2-jwt-bearer')

const jwtCheck = auth({
    audience: "http://localhost:4200",
    issuerBaseURL: "https://dev-rjj5bt2epjmnc3j6.us.auth0.com/api/v2/",
    tokenSigningAlg: "RS256",
})

module.exports = jwtCheck