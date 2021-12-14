import express from 'express'
import { store } from  '../app.js'

let createUser = express.Router()

createUser.use(express.urlencoded({
    extended: true
}))

createUser.use(express.json())

createUser.route('/').post((req,res) => {
    const session = store.openSession()
    req.body['@metadata'] = {
        '@collection': 'User'
    }
    const user = req.body
    //users| for incrementing identity in collection
    session.store(user,"users|")
    session.saveChanges();

    res.statusCode = 200
    res.statusMessage = "User added successfully"
    res.status(res.statusCode).send(res.statusMessage)
})

export { createUser } 