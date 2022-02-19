import express from 'express'
import { store } from '../app.js'

let otpValidation = express.Router()

otpValidation.use(express.urlencoded({
    extended : true
}))

otpValidation.use(express.json())

otpValidation.route('/').post(async(req,res) => {

    const otp = req.body.otp
    const emailId = req.body.email
    const timeUpdate = new Date(Date.now())
    const session = store.openSession()
    try{
        let record = await session.query({collection:'Authorizer'})
        .selectFields(['id'])
        .whereEquals('emailId',emailId)
        .andAlso()
        .whereGreaterThanOrEqual('expiryTime', timeUpdate)
        .andAlso()
        .whereEquals('otp',otp)
        .firstOrNull()
        console.log(record)
        session.advanced.patch(record,'expiryTime',timeUpdate)
        await session.saveChanges()
        res.status(200).send("Valid User!!")
    } catch(err){
        res.status(500).send("Invalid user!!")
    }   
})

export { otpValidation }