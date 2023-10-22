const router = require("express").Router();
const { refreshToken,}  = require("../controller/refreshTOken")
router.get('/refresh', refreshToken)
module.exports = router