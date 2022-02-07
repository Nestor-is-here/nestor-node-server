import express, { response } from 'express'
import { store, mqPublisher } from  '../app.js'


let prototypeSwitch = express.Router()

prototypeSwitch.use(express.urlencoded({
    extended : true
}))

prototypeSwitch.use(express.json())

prototypeSwitch.route('/').get(async (req,res) => {
    const session = store.openSession()
    await session.query({collection: 'prototypes'})
    .first()
    .then((switchPrototype) => {
        var response = {
            'state': switchPrototype.state
        }
        res.status(200)
        .json(response)
        .send()
    })
    .catch((err) => {
        console.log(err)
        res.status((500)).send(err)
    })
})

prototypeSwitch.route('/').post(async (req,res) => {
    const session = store.openSession()
    const state = req.body.state
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