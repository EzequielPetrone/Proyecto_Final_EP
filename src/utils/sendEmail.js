import nodemailer from "nodemailer"

const AUTH_USER = 'steve69@ethereal.email'
const AUTH_PASS = '6reV5J2USjCnA95u6z'

// create reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: AUTH_USER,
        pass: AUTH_PASS
    }
});

async function sendEmail(mailOptions) {
    // send mail with defined transport object
    const info = await transporter.sendMail(mailOptions);

    // Preview only available when sending through an Ethereal account
    return nodemailer.getTestMessageUrl(info)
}

export { sendEmail }

