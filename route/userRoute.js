const express= require('express')
const router = express.Router()
const { userRegistration, userLogin, deleteUser } = require('../controller/userController')

router.post('/register', userRegistration)
router.post('/login', userLogin)
router.delete('/delete', deleteUser)

module.exports = router

