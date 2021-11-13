import express  from 'express'
import mongoose from 'mongoose'
import createUser from './userModule/createUser.js'


// express app initialization
const app = express()


// connect to database
const url = 'mongodb://developer:developer@192.168.0.105:6001/nestorDevDb';
mongoose.connect(url,{
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then( console.log('DB Connected'))
.catch((err) => console.log(err.reason))

app.get('/', (req,res) => {
    res.send('HELLO WORLD!')
})
// Routes
app.use('/createUser', createUser)



// listening
app.listen(process.env.NODE_PORT, () => {
    console.log('PORT: ' + toString(process.env.NODE_PORT))
})

export default app