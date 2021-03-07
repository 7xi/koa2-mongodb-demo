import mongoose from 'mongoose'
const Schema = mongoose.Schema

const userSchema = new Schema({
    nickName: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    gender: {
        type: Number
    },
    date: {
        type: Date,
        default: Date.now
    },
    token: {
        type: String,
        default: ''
      }
})

const UserModel = mongoose.model('User', userSchema)

export default UserModel
