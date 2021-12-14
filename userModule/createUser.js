import express from 'express'
import { store } from '../app.js'

let createUser = express.Router()

createUser.use(express.urlencoded({
    extended: true
}))

createUser.use(express.json())

createUser.route('/').get((req, res, next) => {
    const session = store.openSession()
    session.query({collection: 'Tests'}).all()
    .then((tests) => {
        console.log(tests)
        return tests
    })
    .then((tests) => {
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.json(tests)
    })
    .catch((err) => {
        console.log(err)
    })
})

export { createUser }