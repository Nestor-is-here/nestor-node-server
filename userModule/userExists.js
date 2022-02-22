import express from 'express'
import { store } from '../app.js'

let userExists = express.Router()

userExists.use(express.urlencoded({
    extended : true
}))

userExists.use(express.json())

userExists.route('/').post((req,res) => {

    const emailId = req.body.email
    const session = store.openSession()
    session.query({collection:'User'})
    .selectFields(['username','emailId','phoneNumber'])
    .whereEquals('emailId',emailId)
    .first()
    .then((result) => {
        console.log("Username :: "+result)
        res.status(200).send(result)
    })
    .catch((err) => {
        console.log(err)
        res.status(500).send("New User")
    })

})

export { userExists }