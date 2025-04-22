import Env from '@src/common/Env';
import { mailService } from '@src/services/mailService';
import Mail from 'nodemailer/lib/mailer';

export function obfuscateEmail(email: string) {
  const [user, domain] = email.split('@');
    
  const obfuscatedUser = user.length <= 2
    ? user[0] + '*'
    : user.slice(0, 3) + '*'.repeat(user.length - 6) + user.slice(-3);
    
  const [domainName, domainTLD] = domain.split('.');
  const obfuscatedDomain = domainName[0] + '*'.repeat(domainName.length - 1);

  return `${obfuscatedUser}@${obfuscatedDomain}.${domainTLD}`;
}

export async function sendVerificationMail(to: string | Mail.Address | (string | Mail.Address)[], code: string) {
  return await mailService.sendMail({
    to,
    subject: `${Env.AppName} | Verify your email`,
    html: `<p>Your code: <strong>${code}</strong></p>`,
  });
}

export async function sendPasswordResetEmail(to: string | Mail.Address | (string | Mail.Address)[], code: string) {
  return await mailService.sendMail({
    to,
    subject: `${Env.AppName} | Reset your Password`,
    html: `<p>Use this code to reset your password: <strong>${code}</strong></p>`,
  });
}