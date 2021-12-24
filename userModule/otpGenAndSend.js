import express from 'express'
import { store } from  '../app.js'

let otpGenAndSend = express.Router()

otpGenAndSend.use(express.urlencoded({
    extended : true
}))

otpGenAndSend.use(express.json())

otpGenAndSend.route('/').post((req,res) => {
    const session = store.openSession()
    const phoneNumber = req.body.phoneNumber;
    console.log('phone -> ' + phoneNumber)
    getUserInfoBasedOnFlag()
    async function getUserInfoBasedOnFlag(){
        try{
            const checkFlag = await getFlagValue(phoneNumber)
            console.log("flag value is"+ checkFlag)
            const result = await checkCondition(checkFlag)
            console.log("result"+result)
            if(result == true){
                res.sendStatus(200)
            }else{
                res.sendStatus(500)
            }
        }catch(err){
            console.log("Error in processing")
        }
       
    }
    
async function checkCondition(chkFlag){
    console.log("chkFlag value in checkCondition :::::"+chkFlag)
    let result = true;
    if(chkFlag == 2 || chkFlag == 5){
        const otp = betweenRandomNumber(1000, 9999)
        console.log("otp is "+otp)
        var dateTime = new Date();
        console.log("DateTime is"+dateTime)
        const authValues = {
            'phoneNumber': req.body.phoneNumber,
            'otp': otp,
            'flag': 1,
            'time': dateTime,        
            '@metadata': {
                '@collection': 'Authorizer'
            }
        }
        session.store(authValues,"otp|");
        session.saveChanges();
        result = true;
        
    }
    else{
        result = false;
    }
    console.log("RESULT SENT ::"+result)
    return result
}
})
//OTP Generator
function betweenRandomNumber(min, max) {  
    return Math.floor(
      Math.random() * (max - min + 1) + min
    )
}
//check flag value before generating otp
function getFlagValue(phoneNumber){
    const session = store.openSession()
    const flag = session.query({collection:'Authorizer'})
    .selectFields('flag')
    .whereEquals('phoneNumber', phoneNumber)
    .orderByDescending('time')
    .first()
    .then((flagVal) => {
        return flagVal
    })
    .catch((err) => {
        console.log(err)
    })
    session.saveChanges()
    console.log("Flag inside getFlagValue function")
    return flag
}

//Sending OTP to SIM800L to be implemented

export { otpGenAndSend }