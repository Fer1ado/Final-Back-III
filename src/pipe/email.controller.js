import { transporter } from "./email.service.js";
import "dotenv/config.js"

export const sendGmail = async(req,res, next) => {
    try {
        const {dest, name} = req.body
        const gmailOptions = {
            from: process.env.MAIL_ADRESS,
            to: dest,
            subject: `Welcome to our website, ${name}!`,
            html: `<!DOCTYPE html>
            <html>
            <head>
                <title>Welcome to our website</title>
            </head>
            <body>
            <h5>Hi ${name} Thank you for joining our platform. We're excited to see your talent and passion for technology.</h5>
            </body>`
        }

        await transporter.sendMail(gmailOptions)
        res.status(200).send("Email sent successfully")

    } catch (error) {
        res.status(500).send(error)
    }
}
