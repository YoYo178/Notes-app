import Env from '@src/common/Env';
import nodemailer, { Transporter } from 'nodemailer';
import logger from 'jet-logger';
import Mail from 'nodemailer/lib/mailer';
import SESTransport from 'nodemailer/lib/ses-transport';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import Stream from 'stream';

class MailService {
  private transporter: Transporter | null = null;

  public constructor() {
    this.init();
  }

  private async init() {
    if (Env.SmtpMock) {
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

    if (!Env.SmtpProvider || !Env.SmtpEmail || !Env.SmtpPass) {
      logger.err('SMTP Credentials not set!');
      logger.warn('Mail service not initalized!');
      return;
    }

    this.transporter = nodemailer.createTransport({
      service: Env.SmtpProvider,
      auth: {
        user: Env.SmtpEmail,
        pass: Env.SmtpPass,
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
        to: string | Mail.Address | (string | Mail.Address)[],
        subject: string,
        text?: string | Buffer | Stream.Readable | Mail.AttachmentLike,
        html?: string | Buffer | Stream.Readable | Mail.AttachmentLike,
        attachments?: Mail.Attachment[],
    }) {
    if (!this.transporter)
      return;

    if (Env.SmtpMock) {
      logger.info('New mail draft:');
      logger.info({ from: `"${Env.AppName}" <${Env.SmtpEmail}>`, to, subject, text, html, attachments });
    }

    const info: SESTransport.SentMessageInfo | SMTPTransport.SentMessageInfo = await this.transporter.sendMail({
      from: `"${Env.AppName}" <${Env.SmtpEmail}>`,
      to,
      subject,
      text,
      html,
      attachments,
    });

    if (Env.SmtpMock) {
      logger.info('Message sent:');
      logger.info(info.messageId);
      logger.info('Preview URL:');
      logger.info(nodemailer.getTestMessageUrl(info));
    }

    return info;
  }
}

export const mailService = new MailService(); 