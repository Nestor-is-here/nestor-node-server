import express from 'express'
import { store } from  '../app.js'

let createNewUser = express.Router()

createNewUser.use(express.urlencoded({
    extended: true
}))

createNewUser.use(express.json())

createNewUser.route('/').get((req,res) => {
    const session = store.openSession()
    req.body['@metadata'] = {
        '@collection': 'Tests'
    }
    const user = req.body


    session.store(user, 'test_user')
    session.saveChanges();

    res.send(req.body)
})

export { createNewUser } 