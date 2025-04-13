import nodemailer, { Transporter } from "nodemailer";
import Mail from "nodemailer/lib/mailer";
import Stream from "stream";

function isDevEnv() {
    return process.env.NODE_ENV === 'development';
}

class MailService {
    private transporter: Transporter | null = null;

    constructor() {
        this.init();
    }

    private async init() {
        if (isDevEnv()) {
            const testAccount = await nodemailer.createTestAccount();
            console.log("[MailService] Test account created: ", testAccount)

            this.transporter = nodemailer.createTransport({
                host: testAccount.smtp.host,
                port: testAccount.smtp.port,
                secure: testAccount.smtp.secure,
                auth: {
                    user: testAccount.user,
                    pass: testAccount.pass,
                },
            });

            return;
        }

        if (!process.env.SMTP_PROVIDER || !process.env.SMTP_EMAIL || !process.env.SMTP_PASS) {
            console.error("SMTP Credentials not set!");
            console.warn("Mail service not initalized!");
            return;
        }

        this.transporter = nodemailer.createTransport({
            service: process.env.SMTP_PROVIDER,
            auth: {
                user: process.env.SMTP_EMAIL,
                pass: process.env.SMTP_PASS
            }
        })
    }

    async sendMail({
        to,
        subject,
        text,
        html,
        attachments
    }: {
        to: string | Mail.Address | (string | Mail.Address)[],
        subject: string,
        text?: string | Buffer<ArrayBufferLike> | Stream.Readable | Mail.AttachmentLike,
        html?: string | Buffer<ArrayBufferLike> | Stream.Readable | Mail.AttachmentLike,
        attachments?: Mail.Attachment[]
    }) {
        if (!this.transporter)
            return;

        if (isDevEnv()) {
            console.log('New mail draft:', { from: `"${process.env.APP_NAME}" <${process.env.SMTP_EMAIL}>`, to, subject, text, html, attachments })
        }

        const info = await this.transporter.sendMail({
            from: `"${process.env.APP_NAME}" <${process.env.SMTP_EMAIL}>`,
            to,
            subject,
            text,
            html,
            attachments
        });

        if (isDevEnv()) {
            console.log('Message sent: %s', info.messageId);
            console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
        }

        return info;
    }
}

export const mailService = new MailService(); 