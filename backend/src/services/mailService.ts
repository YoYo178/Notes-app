import nodemailer, { Transporter } from "nodemailer";
import Mail from "nodemailer/lib/mailer";
import Stream from "stream";

class MailService {
    private transporter: Transporter | null = null;

    constructor() {
        this.init();
    }

    private async init() {
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

        return await this.transporter.sendMail({
            from: `"${process.env.APP_NAME}" <${process.env.SMTP_EMAIL}>`,
            to,
            subject,
            text,
            html,
            attachments
        });
    }
}

export const mailService = new MailService(); 