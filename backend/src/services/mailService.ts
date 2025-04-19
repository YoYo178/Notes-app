import { NodeEnvs } from "@src/common/constants";
import Env from "@src/common/Env";
import nodemailer, { Transporter } from "nodemailer";
import Mail from "nodemailer/lib/mailer";
import SESTransport from "nodemailer/lib/ses-transport";
import SMTPTransport from "nodemailer/lib/smtp-transport";
import Stream from "stream";

function isDevEnv() {
    return Env.NodeEnv === NodeEnvs.Production
}

class MailService {
    private transporter: Transporter | null = null;

    constructor() {
        this.init();
    }

    private async init() {
        if (isDevEnv()) {
            const testAccount = await nodemailer.createTestAccount();
            console.log("[MailService] Test account created:", testAccount)

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

        if (!Env.SmtpProvider || !Env.SmtpEmail || !Env.SmtpPass) {
            console.error("SMTP Credentials not set!");
            console.warn("Mail service not initalized!");
            return;
        }

        this.transporter = nodemailer.createTransport({
            service: Env.SmtpProvider,
            auth: {
                user: Env.SmtpEmail,
                pass: Env.SmtpPass
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
        text?: string | Buffer | Stream.Readable | Mail.AttachmentLike,
        html?: string | Buffer | Stream.Readable | Mail.AttachmentLike,
        attachments?: Mail.Attachment[]
    }) {
        if (!this.transporter)
            return;

        if (isDevEnv()) {
            console.log('New mail draft:', { from: `"${Env.AppName}" <${Env.SmtpEmail}>`, to, subject, text, html, attachments })
        }

        const info: SESTransport.SentMessageInfo | SMTPTransport.SentMessageInfo = await this.transporter.sendMail({
            from: `"${Env.AppName}" <${Env.SmtpEmail}>`,
            to,
            subject,
            text,
            html,
            attachments
        });

        if (isDevEnv()) {
            console.log('Message sent:', info.messageId);
            console.log('Preview URL:', nodemailer.getTestMessageUrl(info));
        }

        return info;
    }
}

export const mailService = new MailService(); 