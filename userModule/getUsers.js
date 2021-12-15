import express from 'express'
import { store } from  '../app.js'

let getUsers = express.Router()

getUsers.use(express.urlencoded({
    extended: true
}))

getUsers.use(express.json())

getUsers.route('/').get((req,res) => {
    const session = store.openSession()
    session.query({collection: 'User'})
    .selectFields(["username","connections"]).all()
    .then((users) => {
        res.statusCode = 200
        res.send(users)
    })
    .catch((err) => {
        console.log(err)
    })
})

export { getUsers }