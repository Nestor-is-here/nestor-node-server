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
        .selectFields('otp','flag')
        .whereEquals('emailId',emailId)
        .whereIn('flag',['2','5'])
        .orderByDescending('time')
        .andAlso()
        .whereLessThan('expiryTime',time)
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
        const flag = 3;
        //await session.load(otpInDB.Id);
        otpInDB.flag = flag;
        session.saveChanges();
        res.status(200).send("Valid user")
    }else{
        res.status(500).send("Not a valid user")
    }

})

export { otpValidation }