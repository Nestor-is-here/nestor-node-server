import express  from 'express'
import { DocumentStore } from 'ravendb'
import { createUser } from './userModule/createUser.js'
import { createNewUser } from './userModule/createNewUser.js'
import { getUsers } from './userModule/getUsers.js'
import { debug_options } from './private.js'
import * as fs from 'fs'


// express app initialization
const app = express()

app.get('/', (req,res) => {
    res.send('HELLO WORLD!')
})
// Routes
app.use('/createUser', createUser)
app.use('/createNewUser', createNewUser)
app.use('/getUsers',getUsers)
const server_options = {
    'cert_path': undefined,
    'raven_url': undefined,
    'db_name': undefined,
    'port': undefined
}

if( fs.existsSync('./private.js')) {
   server_options.cert_path = debug_options.cert_path,
   server_options.db_name = debug_options.db_name,
   server_options.raven_url = debug_options.raven_url,
   server_options.port = debug_options.port
}
else {
    // deployment parameters HERE
    server_options.port = process.env.NODE_PORT
}

// Raven Connection
const authOptions = {
    certificate: fs.readFileSync(server_options.cert_path),
    type: 'pfx', // or "pem"
    password: ''
};
const store = new DocumentStore(server_options.raven_url, server_options.db_name, authOptions)
store.initialize()

// listening 
app.listen(server_options, () => {
    
    console.log('PORT: ' + server_options.port)
})

export default app
export { store }
