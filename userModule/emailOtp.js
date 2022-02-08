import nodemailer from 'nodemailer'
import * as fs from 'fs'
import { store } from '../app.js'

const auth = {
    'email': undefined,
    'password': undefined
}

if( fs.existsSync('private.js')) {
    let { emailAuth } = await import('../private.js')
   auth.email = emailAuth.email
   auth.password = emailAuth.password
}
else {
    auth.email = process.env.EMAILID
    auth.password = process.env.PASSWORD
}

function sendOTPMail(receiverEmail, OTP) {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: auth.email,
            pass: auth.password
        }
    })

    const mailOptions = {
        from: auth.email,
        to: receiverEmail,
        subject: 'Nestor LogIn OTP',
        text: 'Your Login OTP is ' + OTP + '. This OTP will be valid for the next 10 minutes.'
    }

    transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
            const session = store.openSession()
            session.query({collection: 'ServiceStat'})
            .first()
            .then((service) => {
                service.status = false
            })
            .then(() => {
                session.saveChanges()
            }) 
            .catch((err) => {
                console.log(err)
            })   
        }
        else {
            console.log('Email sent: ', info.response)
        }
    })
}

export { sendOTPMail }