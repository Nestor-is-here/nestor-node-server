import express  from 'express'
import { DocumentStore } from 'ravendb'
import { createUser } from './userModule/createUser.js'
import * as fs from 'fs'


// express app initialization
const app = express()

app.get('/', (req,res) => {
    res.send('HELLO WORLD!')
})
// Routes
app.use('/createUser', createUser)

const server_options = {
    'cert_path': undefined,
    'raven_url': undefined,
    'db_name': undefined,
    'port': undefined
}

if( fs.existsSync('./private.js')) {
    let { debug_options } = await import('./private.js')
   server_options.cert_path = debug_options.cert_path,
   server_options.db_name = debug_options.db_name,
   server_options.raven_url = debug_options.raven_url,
   server_options.port = debug_options.port
}
else {
    // deployment parameters HERE
    server_options.cert_path = process.env.CERT_PATH
    server_options.db_name = process.env.DB
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
store.initialize()

// listening 
app.listen(server_options, () => {
    
    console.log('PORT: ' + server_options.port)
})

export default app
export { store }
