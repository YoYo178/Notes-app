import ENV from '@src/common/env.js';
import logger from '@src/utils/logger.utils.js';
import nodemailer, { type Transporter } from 'nodemailer';
import Mail from 'nodemailer/lib/mailer/index.js';
import SESTransport from 'nodemailer/lib/ses-transport/index.js';
import SMTPTransport from 'nodemailer/lib/smtp-transport/index.js';
import Stream from 'stream';

class MailService {
  private transporter: Transporter | null = null;

  public constructor() {
    this.init();
  }

  private async init() {
    if (ENV.SMTP_MOCK) {
      const testAccount = await nodemailer.createTestAccount();
      logger.info('[MailService] Test account created:');
      logger.info(testAccount);

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

    if (!ENV.SMTP_PROVIDER || !ENV.SMTP_EMAIL || !ENV.SMTP_PASS) {
      logger.error('SMTP Credentials not set!');
      logger.warn('Mail service not initalized!');
      return;
    }

    this.transporter = nodemailer.createTransport({
      service: ENV.SMTP_PROVIDER,
      auth: {
        user: ENV.SMTP_EMAIL,
        pass: ENV.SMTP_PASS,
      },
    });
  }

  public async sendMail({
    to,
    subject,
    text,
    html,
    attachments,
  }: {
    to: string | Mail.Address | (string | Mail.Address)[];
    subject: string;
    text?: string | Buffer | Stream.Readable | Mail.AttachmentLike;
    html?: string | Buffer | Stream.Readable | Mail.AttachmentLike;
    attachments?: Mail.Attachment[];
  }) {
    if (!this.transporter) return;

    if (ENV.SMTP_MOCK) {
      logger.info('New mail draft:');
      logger.info({
        from: `"${ENV.APP_NAME}" <${ENV.SMTP_EMAIL}>`,
        to,
        subject,
        text,
        html,
        attachments,
      });
    }

    const info: SESTransport.SentMessageInfo | SMTPTransport.SentMessageInfo =
      await this.transporter.sendMail({
        from: `"${ENV.APP_NAME}" <${ENV.SMTP_EMAIL}>`,
        to,
        subject,
        text,
        html,
        attachments,
      });

    if (ENV.SMTP_MOCK) {
      logger.info('Message sent:');
      logger.info(info.messageId);
      logger.info('Preview URL:');
      logger.info(nodemailer.getTestMessageUrl(info));
    }

    return info;
  }
}

export const mailService = new MailService();
