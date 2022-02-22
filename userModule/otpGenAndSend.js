import express from 'express'
import { store } from  '../app.js'
import { sendOTPMail } from './emailOtp.js'

let otpGenAndSend = express.Router()

otpGenAndSend.use(express.urlencoded({
    extended : true
}))

otpGenAndSend.use(express.json())

otpGenAndSend.route('/').post(async(req,res) => {
    const emailId = req.body.email
    
    try{
        const result = await generateOtp(emailId)
        console.log("result"+result)
        let serviceName = "EmailService"
        const session = store.openSession()
        const isServiceUp = await session.query({collection: 'ServiceStat'})
            .selectFields('status')
            .whereEquals('Name',serviceName)
            .first()
        console.log("isServiceUp ::"+isServiceUp)    
        if(isServiceUp == true){
            sendOTPMail(emailId,result)
            res.status(200).send("OTP is generated and sent!!")
        }else{
            res.status(500).send("OTP sending failed")
        }
    }catch(err){
            console.log("Error in processing")
    }      
})
  
 
async function generateOtp(emailId){
    const session = store.openSession()
    const otp = generateRandomNumber(1000, 9999)
    console.log("otp is "+otp)
    //UTC Time.Change to Locale wherever needed. 
    const expiryTime = new Date(Date.now() + 10*60000)
    const authValues = {
        'emailId': emailId,
        'otp': otp,
        'expiryTime': expiryTime,
        '@metadata': {
            '@collection': 'Authorizer'
        }
    }
    console.log(authValues)
    session.store(authValues,"otp|")
    session.saveChanges()    
    return otp   
}

//OTP Generator
function generateRandomNumber(min, max) {  
    return Math.floor(
      Math.random() * (max - min + 1) + min
    )
}

export { otpGenAndSend }