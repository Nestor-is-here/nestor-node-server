import mongoose from 'mongoose'
import deviceModel from './device_model.js'
const { Schema } = mongoose

const UserSchema = new Schema ({
    userId: {
        type: String,
        unique: true,
        required: true
    },
    userName: {
        type: String
    },
    phoneNumber: {
        type: String
    },
    memberList: {
        type: [String],
        default: []
    },
    guestList: {
        type: [String],
        default: []
    },
    deviceList: {
        type: [deviceModel],
        default: []
    }
},
{
    timestamps: true
})

var users = mongoose.model('user', UserSchema)

export default users
