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
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    memberList: {
        type: [String],
        default: [],
        required: true
    },
    guestList: {
        type: [String],
        default: [],
        required: true
    },
    deviceList: {
        type: [deviceModel],
        default: [],
        required: true
    }
},
{
    timestamps: true
})

var users = mongoose.model('user', UserSchema)

export default users
