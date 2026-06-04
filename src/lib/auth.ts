import crypto from "crypto";

function hashPassword(password: string) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

function verifyPassword(password: string, stored: string) {
  const [salt, hash] = stored.split(":");
  const hashToVerify = crypto.scryptSync(password, salt, 64).toString("hex");
  return crypto.timingSafeEqual(
    Buffer.from(hash, "hex"),
    Buffer.from(hashToVerify, "hex"),
  );
}
