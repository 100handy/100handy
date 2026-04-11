/**
 * Generate Apple client_secret JWT for Supabase
 *
 * Usage:
 *   node scripts/generate-apple-secret.mjs \
 *     --key-file /path/to/AuthKey_XXXXXXXX.p8 \
 *     --key-id YOUR_KEY_ID \
 *     --team-id W4F9QDD498 \
 *     --client-id com.100handy.web
 */

import { readFileSync } from 'fs';
import { createPrivateKey, createSign } from 'crypto';

const args = process.argv.slice(2);
function getArg(name) {
  const idx = args.indexOf(`--${name}`);
  if (idx === -1 || idx + 1 >= args.length) {
    console.error(`Missing --${name}`);
    process.exit(1);
  }
  return args[idx + 1];
}

const keyFile = getArg('key-file');
const keyId = getArg('key-id');
const teamId = getArg('team-id');
const clientId = getArg('client-id');

const privateKeyPem = readFileSync(keyFile, 'utf8');
const privateKey = createPrivateKey(privateKeyPem);

// JWT Header
const header = {
  alg: 'ES256',
  kid: keyId,
};

// JWT Payload — valid for 180 days (Apple max is 6 months)
const now = Math.floor(Date.now() / 1000);
const payload = {
  iss: teamId,
  iat: now,
  exp: now + 180 * 24 * 60 * 60,
  aud: 'https://appleid.apple.com',
  sub: clientId,
};

function base64url(obj) {
  return Buffer.from(JSON.stringify(obj))
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

const headerB64 = base64url(header);
const payloadB64 = base64url(payload);
const signingInput = `${headerB64}.${payloadB64}`;

const sign = createSign('SHA256');
sign.update(signingInput);
const derSig = sign.sign(privateKey);

// Convert DER signature to raw r||s format for ES256
function derToJose(derSig) {
  let offset = 2;
  const rLength = derSig[offset + 1];
  offset += 2;
  let r = derSig.subarray(offset, offset + rLength);
  offset += rLength;
  const sLength = derSig[offset + 1];
  offset += 2;
  let s = derSig.subarray(offset, offset + sLength);

  // Remove leading zeros
  if (r.length > 32) r = r.subarray(r.length - 32);
  if (s.length > 32) s = s.subarray(s.length - 32);

  // Pad to 32 bytes
  const rPad = Buffer.alloc(32);
  const sPad = Buffer.alloc(32);
  r.copy(rPad, 32 - r.length);
  s.copy(sPad, 32 - s.length);

  return Buffer.concat([rPad, sPad]);
}

const joseSig = derToJose(derSig);
const sigB64 = joseSig
  .toString('base64')
  .replace(/=/g, '')
  .replace(/\+/g, '-')
  .replace(/\//g, '_');

const jwt = `${signingInput}.${sigB64}`;

console.log('\n--- Apple client_secret JWT ---\n');
console.log(jwt);
console.log('\n--- Expires in 180 days ---\n');
