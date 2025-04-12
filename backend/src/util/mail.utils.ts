import { mailService } from "@src/services/mailService";
import Mail from "nodemailer/lib/mailer";

export async function sendVerificationMail(to: string | Mail.Address | (string | Mail.Address)[], code: string) {
    return await mailService.sendMail({
        to,
        subject: `${process.env.APP_NAME} | Verify your email`,
        html: `<p>Your code: <strong>${code}</strong></p>`
    })
}

export async function sendPasswordResetEmail(to: string | Mail.Address | (string | Mail.Address)[], code: string) {
    return await mailService.sendMail({
        to,
        subject: `${process.env.APP_NAME} | Reset your Password`,
        html: `<p>Use this code to reset your password: <strong>${code}</strong></p>`
    })
}