import mongoose from 'mongoose'
import { deviceModel } from './device_model.js'

const Schema = mongoose

const UserSchema = Schema ({
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
    memberList: [
        String
    ],
    guestList: [
        String
    ],
    deviceList: [deviceModel]

},
{
    timestamps: true
})

var users = mongoose.model('user', UserSchema)

export default users
