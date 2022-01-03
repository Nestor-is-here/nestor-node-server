import nodemailer from 'nodemailer'
import * as fs from 'fs'

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
    // deployment parameters HERE
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
        text: 'Your Login OTP is ' + OTP + '. This OTP will be valid for the next 15 minutes.'
    }

    transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
            console.log(err);
        }
        else {
            console.log('Email sent: ', info.response)
        }
    })
}

export { sendOTPMail }