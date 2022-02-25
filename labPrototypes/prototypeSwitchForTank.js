import express from 'express'
import { store,mqPublisher } from '../app.js'

let switchingMotor = express.Router()

switchingMotor.use(express.urlencoded({
    extended : true
}))

switchingMotor.use(express.json())

// store threshold value set by user
switchingMotor.route('/getThreshold').post(async(req,res) => {

    const thresholdValue = req.body.thresholdValue
    console.log("Threshold set :: "+thresholdValue)
    const session = store.openSession()

    let tankParams = {
        'deviceId' : '0404',
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

switchingMotor.route('/switchMotor').post(async(req,res) => {

    const waterLevel = req.body.level
    console.log("Waterlevel frm req::"+waterLevel)
    const sensorDeviceId = req.body.sensorDeviceId
    const sensorApplianceId = req.body.sensorApplianceId
    const switchDeviceId = req.body.switchDeviceId
    const switchApplianceId = req.body.switchApplianceId 
    const resSession = store.openSession()
    
    let result = await resSession.query({collection : 'prototypes'})
    .selectFields(['appliances','id'])
    .whereEquals('deviceId',sensorDeviceId)
    .firstOrNull()
    console.log(result)
    if(result != null){
        const switchSession = store.openSession()
        var switchState = await switchSession.query({collection : 'prototypes'})
        .selectFields(['appliances','id'])    
        .whereEquals('deviceId',switchDeviceId)
        .firstOrNull()
        console.log(switchState)
        if(switchState != null){
            if(waterLevel <= result.appliances[sensorApplianceId]['threshold%']){
                var motorControl = true
                console.log("ID is"+switchState.id)
                //switchSession.advanced.patch(switchState.id,`appliances.${switchApplianceId}.state`,motorControl)
                switchSession.advanced.patch(switchState.id,`appliances.${switchApplianceId}.state`,motorControl)
                mqPublisher.publish('test', motorControl.toString())
            }else if(waterLevel == 100){
                var motorControl = false
                switchSession.advanced.patch(switchState.id,`appliances.${switchApplianceId}.state`,motorControl)
                mqPublisher.publish('test', motorControl.toString())
            }               
        }
        resSession.advanced.patch(result.id,`appliances.${sensorApplianceId}.level%`,waterLevel)
        resSession.saveChanges()
        switchSession.saveChanges()
        res.status(200)
    }else{
        res.status(500)
    }
    
    res.send()
})

    
export { switchingMotor }