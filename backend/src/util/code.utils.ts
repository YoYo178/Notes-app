export const VERIFICATION_CODE_TTL = 15 * 60 * 1000 // 15 minutes

export function generateVerificationCode(length: number = 6) {
    let chars = "0123456789"
    let result = '';
    for (let i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
    return result;
}