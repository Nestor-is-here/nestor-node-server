import express, { urlencoded } from 'express'
import { store } from '../app.js'

let otpValidation = express.Router()

otpValidation.use(express.urlencoded({
    extended : true
}))

otpValidation.use(express.json())

otpValidation.route('/').post