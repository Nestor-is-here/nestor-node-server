import express from 'express'
import { store, mqPublisher } from  '../app.js'


let prototypeSwitch = express.Router()

prototypeSwitch.use(express.urlencoded({
    extended : true
}))

prototypeSwitch.use(express.json())

prototypeSwitch.route('/').post(async (req,res) => {
    const session = store.openSession()
    const state = req.body.state;
    await session.query({collection: 'prototypes'})
    .first()
    .then((switchPrototype) => {
        switchPrototype.state = state
    })
    .then(() => {
        session.saveChanges()
    })
    .catch((err) => {
        console.log(err)
    })

    mqPublisher.publish('test', state.toString())
    res.send(`Switch is ${ state? 'ON':'OFF' }`)
    
})

export { prototypeSwitch }