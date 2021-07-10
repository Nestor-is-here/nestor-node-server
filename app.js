import express  from 'express';




// express app initialization
const app = express()

app.get('/', (req,res) => {
    res.send('HELLO WORLD!')
})

// listening
app.listen(process.env.NODE_PORT, () => {
    console.log('PORT: ' + toString(process.env.NODE_PORT))
})