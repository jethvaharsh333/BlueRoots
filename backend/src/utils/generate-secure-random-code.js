import crypto from "crypto";

const generateSecureRandomCode = () => {
    const randomBytes = crypto.randomBytes(4);
    const randomNumber = randomBytes.readUInt32BE(0) % 1000000;
    return randomNumber.toString().padStart(6, '0');
}

export { generateSecureRandomCode };