import express from 'express'
import { store } from  '../app.js'

let otpGenAndSend = express.Router()

otpGenAndSend.use(express.urlencoded({
    extended : true
}))

otpGenAndSend.use(express.json())

otpGenAndSend.route('/newUser').post(async(req,res) => {
    const otpNew = generateRandomNumber(1000,9999)
    console.log("otpNew ::"+otpNew)
    const emailId = req.body.email
    var dateTime = new Date();
    const session = store.openSession()
    const authValues = {
        'emailId': emailId,
        'otp': otpNew,
        'flag': 1,
        'time': dateTime,        
        '@metadata': {
            '@collection': 'Authorizer'
        }
    }
    console.log(authValues)
    session.store(authValues,"otp|");
    session.saveChanges(); 
    res.status(200).send("OTP generated and sent for new user")
})

otpGenAndSend.route('/').post(async(req,res) => {
    const emailId = req.body.email
    try{
        const checkFlag = await getFlagValue(emailId)
        console.log("flag value is"+ checkFlag)
        const result = await checkCondition(checkFlag,emailId)
        console.log("result"+result)
        if(result == true){
            res.status(200).send("OTP is generated and sent!!")
        }else{
            res.status(500).send("OTP sending failed")
        }
    }catch(err){
            console.log("Error in processing")
    }      
})
  
 
async function checkCondition(chkFlag,emailId){
    const session = store.openSession()
    console.log("chkFlag value in checkCondition :::::"+chkFlag)

    if(chkFlag == 2 || chkFlag == 5){
        const otp = generateRandomNumber(1000, 9999)
        console.log("otp is "+otp)
        var dateTime = new Date();
        console.log("DateTime is"+dateTime)
        const authValues = {
            'emailId': emailId,
            'otp': otp,
            'flag': 1,
            'time': dateTime,        
            '@metadata': {
                '@collection': 'Authorizer'
            }
        }
        console.log(authValues)
        session.store(authValues,"otp|");
        session.saveChanges();   
        return true;    
    }
    else{
        return false;
    }
}

//OTP Generator
function generateRandomNumber(min, max) {  
    return Math.floor(
      Math.random() * (max - min + 1) + min
    )
}
//check flag value before generating otp
function getFlagValue(emailId){
    const session = store.openSession()
    const flag = session.query({collection:'Authorizer'})
    .selectFields('flag')
    .whereEquals('emailId', emailId)
    .orderByDescending('time')
    .first()
    .then((flagVal) => {
        return flagVal
    })
    //Invalid Operation Exception => to be handled
    .catch((err) => {
        console.log(err)
    })
    session.saveChanges()
    console.log("Flag inside getFlagValue function"+flag)
    return flag
}

//Sending OTP to SIM800L to be implemented

export { otpGenAndSend }