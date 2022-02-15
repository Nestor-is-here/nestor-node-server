import express from 'express'
import { store } from '../app.js'

let switchingMotor = express.Router()

switchingMotor.use(express.urlencoded({
    extended : true
}))

switchingMotor.use(express.json())

// store threshold value set by user
switchingMotor.route('/').post(async(req,res) => {

    const thresholdValue = req.body.thresholdValue
    console.log("Threshold set :: "+thresholdValue)
    const session = store.openSession()

    let tankParams = {
        'deviceId' : '0100',
        'thresholdLevel' : thresholdValue,
        'pumpState' : false,
        'waterLevel' : 90,
        '@metadata': {
            '@collection': 'labPrototypeTank'
        }             
    }
    session.store(tankParams,"labPrototypeTank|")
    session.saveChanges()

    res.statusCode = 200
    res.statusMessage = "Threshold defined successfully"
    res.status(res.statusCode).send(res.statusMessage)
})

switchingMotor.route('/').post(async(req,res) => {

    const waterLevel = req.body.level
    console.log("Waterlevel in tank ::"+waterLevel)
    const deviceId = req.body.deviceId
    const session = store.openSession()
    
    session.query({collection: 'labPrototypeTank'})
    .selectFields('thresholdLevel','waterLevel','pumpSwitch')
    .whereEquals(deviceId,'deviceId')
    .first()
    .then((result) => {
        if(waterLevel <= result.thresholdLevel){
            session.query({collection: 'prototypes'})
            .selectFields('appliances')
            //now all switches are in one device(nodemcu) for test purposes
            .whereEquals(deviceId,pumpSwitch.deviceId)
            .then((appliances) => {
                for (appliance in appliances){
                    if(appliance.applianceId  == pumpSwitch.applianceId){
                        appliance.state = true
                        mqPublisher.publish('test', appliance.state.toString())
                    }
                }
            })
            .then(() => {
                session.saveChanges()
            })    
        }else{
            result.pumpState = false
        }
        result.waterLevel = waterLevel
    })
    .then(() => {
        session.saveChanges()
    })
    
})

switchingMotor.route('/').post(async(req,res) => {

    const waterLevel = req.body.level
    console.log("Waterlevel in tank ::"+waterLevel)
    const deviceId = req.body.deviceId
    const session = store.openSession()
    
    session.query({collection: 'labPrototypeTank'})
    .selectFields('thresholdLevel','waterLevel','pumpSwitch')
    .whereEquals(deviceId,'deviceId')
    .first()
    .then((result) => {
        if(waterLevel <= result.thresholdLevel){

            result.pumpState = true
            mqPublisher.publish('test', result.pumpState.toString())
        }else{
            result.pumpState = false
        }
        result.waterLevel = waterLevel
    })
    .then(() => {
        session.saveChanges()
    })
    
})