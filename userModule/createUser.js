import express from 'express'
import mongoose from 'mongoose'
import userModel from '../models/user_model'

const createUser = express.Router()

createUser.use(express.urlencoded({
    extended = true
}))

createUser.use(express.json())

createUser.route('/').post((req, res, next) => {
    res.send(req.body)
})

module.exports = createUser