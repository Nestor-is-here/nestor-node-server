import express from 'express'
import mongoose from 'mongoose'
import userModel from '../models/user_model'

let createUser = express.Router()

createUser.use(express.urlencoded({
    extended: true
}))

createUser.use(express.json())

createUser.route('/').post((req, res, next) => {
    res.send(req.body)
})

export default createUser