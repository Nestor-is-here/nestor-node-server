import express  from 'express'

// DB Driver import
import { DocumentStore } from 'ravendb'
import { mqClient } from './labPrototypes/mqttClient.js'

// for private.js
import * as fs from 'fs'

// Endpoint imports
import { createUser } from './userModule/createUser.js'
import { getUsers } from './userModule/getUsers.js'
import { userExists } from './userModule/userExists.js'
import { otpGenAndSend } from './userModule/otpGenAndSend.js'
import { prototypeSwitch } from './labPrototypes/prototypeRoute.js'
import { switchingMotor } from './labPrototypes/prototypeSwitchForTank.js'
import { otpValidation } from './userModule/otpValidation.js'


// express app initialization
const app = express()

app.get('/', (req,res) => {
    res.send('HELLO WORLD!')
})
// Routes
app.use('/createUser', createUser)
app.use('/getUsers',getUsers)
app.use('/userExists',userExists)
app.use('/otpGenAndSend',otpGenAndSend)
app.use('/prototypeSwitch', prototypeSwitch)
app.use('/validateOtp',otpValidation)
app.use('/tankControl',switchingMotor)


const server_options = {
    'cert_path': undefined,
    'raven_url': undefined,
    'mosquitto_broker_url': undefined,
    'db_name': undefined,
    'port': undefined
}

if( fs.existsSync('./private.js')) {
    let { debug_options } = await import('./private.js')
   server_options.cert_path = debug_options.cert_path
   server_options.db_name = debug_options.db_name
   server_options.mosquitto_broker_url = debug_options.mosquitto_broker_url
   server_options.raven_url = debug_options.raven_url
   server_options.port = debug_options.port
}
else {
    // deployment parameters HERE
    server_options.cert_path = process.env.CERT_PATH
    server_options.db_name = process.env.DB
    server_options.mosquitto_broker_url = process.env.MOSQUITTO_BROKER_URL
    server_options.raven_url = process.env.DB_URL
    server_options.port = process.env.NODE_PORT
}

// Raven Connection
const authOptions = {
    certificate: fs.readFileSync(server_options.cert_path),
    type: 'pfx', // or "pem"
    password: ''
};
const store = new DocumentStore(server_options.raven_url, server_options.db_name, authOptions)
const conventions = store.conventions
conventions.storeDatesInUtc = true
store.initialize()


// MQ PUBLISHER Object
const mqPublisher = new mqClient(server_options.mosquitto_broker_url)


// listening 
app.listen(server_options, () => {
    
    console.log('PORT: ' + server_options.port)
})

export default app
export { store, mqPublisher }
