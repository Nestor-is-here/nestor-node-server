import mongoose  from "mongoose";
const { Schema } = mongoose

const deviceSchema = new Schema ({
    deviceId: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    }
})

var devices = mongoose.model('device', deviceSchema)

module.exports = devices