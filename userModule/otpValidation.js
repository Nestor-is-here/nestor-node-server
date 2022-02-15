import express from 'express'
import { store } from '../app.js'

let otpValidation = express.Router()

otpValidation.use(express.urlencoded({
    extended : true
}))

otpValidation.use(express.json())

otpValidation.route('/').post(async(req,res) => {

    const otp = req.body.otp
    console.log("otpfrmReq ::::"+otp)
    const emailId = req.body.email
    const session = store.openSession()
    const otpInDB = await session.query({collection:'Authorizer'})
        .selectFields('otp')
        .whereEquals('emailId',emailId)
        .orderByDescending('expiryTime')
        .first()
        .then((otpVal) => {
            console.log("otpVal"+otpVal)
            return otpVal
        })
        .catch((err) => {
            console.log("Error in receiving data from collection")
        })
    console.log("checking otpReq and otpDB are same")    
    console.log("otpfrmDB::"+otpInDB)
    if(otp == otpInDB.otp){
        expiryTime = new Date(Date.now())
        console.log("expiryTime updated after otp usage"+ expiryTime)
        session.saveChanges()
        res.status(200).send("Valid user")
    }else{
        res.status(500).send("Invalid User")
    }

})

export { otpValidation }