import mongoose from "mongoose"
const { Schema } = mongoose

const dataSchema = new Schema ({
    dataRecordId: {
        type: String,
        required: true,
        unique: true
    },
    deviceId: {
        type: String,
        required: true,
        unique: true
    }, 
    dataValue: {
        type: String
    },
    dataUnit: {
        type: String
    }
},{timestamps: true})

var data = mongoose.model('data',dataSchema)

export default data


