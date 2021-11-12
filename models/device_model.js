import mongoose  from "mongoose";
const { Schema } = mongoose

const deviceSchema = new Schema ({
    deviceId: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String
    },
    description: {
        type: String
    }
})

var devices = mongoose.model('device', deviceSchema)

module.exports = devices