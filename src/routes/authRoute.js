const express = require('express')
const router = express.Router()
const {registerUser,loginUser,otpUser} = require('./../controller/authCon')

router.post('/register',registerUser)
router.post('/login',loginUser)
router.get('/otp/:id/:code',otpUser)

module.exports = router