import express from 'express'
import { store } from  '../app.js'

let createNewUser = express.Router()

createNewUser.use(express.urlencoded({
    extended: true
}))

createNewUser.use(express.json())

createNewUser.route('/').post((req,res) => {
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

export { createNewUser } 