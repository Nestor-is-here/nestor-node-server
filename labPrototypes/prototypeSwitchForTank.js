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

    //update threshold set by the user
    session.saveChanges()

    res.statusCode = 200
    res.statusMessage = "Threshold defined successfully"
    res.status(res.statusCode).send(res.statusMessage)
})

switchingMotor.route('/switchMotor').post(async(req,res) => {

    const waterLevel = req.body.level
    console.log("Waterlevel frm req::"+waterLevel)
    const sensorDeviceId = `devices/${req.body.sensorDeviceId}`
    const sensorApplianceId = req.body.sensorApplianceId
    const session = store.openSession()
    let statusMessage = "Threshold not reached"
    
    let sensorDetails = await session.query({collection : 'Devices'})
        .whereEquals('id',sensorDeviceId)
        .firstOrNull()

    const switchDeviceId = sensorDetails.appliances[sensorApplianceId].motorSwitchDetails.deviceId
    const switchApplianceId = sensorDetails.appliances[sensorApplianceId].motorSwitchDetails.applianceId    
    
    let switchDetails = await session.query({collection : 'Devices'})
        .whereEquals('id',switchDeviceId)
        .firstOrNull()    
      
    if(sensorDetails != null){
        if(waterLevel <= sensorDetails.appliances[sensorApplianceId].thresholdPercent){
            if(switchDetails.operationState == true && switchDetails.appliances[switchApplianceId].state == false){
                switchDetails.appliances[switchApplianceId].state = true 
                mqPublisher.publish('test', switchDetails.appliances[switchApplianceId].state.toString())
                statusMessage = "Motor switched ON"
            }
        }else if(waterLevel == 100){
            if(switchDetails.operationState == true && switchDetails.appliances[switchApplianceId].state == true){
                switchDetails.appliances[switchApplianceId].state = false
                mqPublisher.publish('test', switchDetails.appliances[switchApplianceId].state.toString())
                statusMessage = "Motor switched OFF"
            }
        }    
        sensorDetails.appliances[sensorApplianceId].levelPercent = waterLevel   
        res.status(200).send(statusMessage)
    }else{
        res.status(500).send("Error controlling motor switch")
    }
    
    await session.saveChanges()  
    res.send()
})
    
export { switchingMotor }