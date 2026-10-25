// Pure JavaScript PromptPay EMVCo QR & VietQR Generator
// Conforms to Bank of Thailand (BOT) Standard & Vietnam Napas 24/7 VietQR

// Helper: Format EMVCo TLV (Tag-Length-Value)
function formatTlv(tag, value) {
  const valStr = String(value);
  const lenStr = String(valStr.length).padStart(2, '0');
  return `${tag}${lenStr}${valStr}`;
}

// CRC16-CCITT (0x1021, Initial 0xFFFF)
function crc16(data) {
  let crc = 0xFFFF;
  for (let i = 0; i < data.length; i++) {
    crc ^= data.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j++) {
      if ((crc & 0x8000) !== 0) {
        crc = ((crc << 1) ^ 0x1021) & 0xFFFF;
      } else {
        crc = (crc << 1) & 0xFFFF;
      }
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, '0');
}

/**
 * Generate PromptPay EMVCo Payload
 * @param {string} target - Mobile number (10 digits e.g. 0812345678) or National ID / Tax ID (13 digits)
 * @param {number} amount - Amount in THB (e.g. 16000 or 16000.00)
 */
export function generatePromptPayPayload(target, amount) {
  if (!target) return '';
  const cleanTarget = String(target).replace(/[^0-9]/g, '');

  let merchantInfo = '';
  // Tag 00: PromptPay AID
  const aid = formatTlv('00', 'A000000677010111');

  if (cleanTarget.length === 10) {
    // Mobile phone: prefix 0066 and drop leading 0
    const phoneFormatted = '0066' + cleanTarget.substring(1);
    const phoneTlv = formatTlv('01', phoneFormatted);
    merchantInfo = formatTlv('29', aid + phoneTlv);
  } else if (cleanTarget.length === 13) {
    // National ID / Tax ID
    const idTlv = formatTlv('02', cleanTarget);
    merchantInfo = formatTlv('29', aid + idTlv);
  } else {
    // Fallback as phone
    const phoneFormatted = '0066' + cleanTarget.substring(1);
    const phoneTlv = formatTlv('01', phoneFormatted);
    merchantInfo = formatTlv('29', aid + phoneTlv);
  }

  // EMVCo Base Elements
  const pfi = formatTlv('00', '01'); // Payload Format Indicator
  const pointOfInitiation = formatTlv('01', amount ? '12' : '11'); // 12 = Dynamic (with amount), 11 = Static
  const currency = formatTlv('53', '764'); // THB (ISO 4217)
  const country = formatTlv('58', 'TH'); // Thailand

  let payload = pfi + pointOfInitiation + merchantInfo + currency;

  if (amount && Number(amount) > 0) {
    const formattedAmount = Number(amount).toFixed(2);
    payload += formatTlv('54', formattedAmount);
  }

  payload += country;

  // Tag 63: CRC placeholder
  const payloadForCrc = payload + '6304';
  const checksum = crc16(payloadForCrc);

  return payload + formatTlv('63', checksum);
}

/**
 * Generate PromptPay QR Code Image URL
 */
export function getPromptPayQrImageUrl(target, amount, size = 300) {
  const payload = generatePromptPayPayload(target, amount);
  if (!payload) return '';
  return `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(payload)}&size=${size}x${size}&margin=10`;
}

/**
 * Generate VietQR Image URL (Napas 247 standard)
 * @param {string} bankId - E.g. 'MB', 'VCB', 'TCB', 'VPB', 'ICB'
 * @param {string} accountNo - Bank Account Number
 * @param {number} amount - Amount in VND
 * @param {string} orderId - Transfer Memo / AddInfo
 * @param {string} accountName - Account Owner Name
 */
export function getVietQrImageUrl(bankId = 'MB', accountNo = '0987654321', amount = 0, orderId = '', accountName = 'SIMA SHOP') {
  const cleanBank = bankId.trim().toUpperCase() || 'MB';
  const cleanAcc = accountNo.trim() || '0987654321';
  const cleanAmt = Math.round(Number(amount) || 0);
  const cleanMemo = encodeURIComponent(orderId || 'SIMA SHOP');
  const cleanName = encodeURIComponent(accountName || 'SIMA SHOP');

  return `https://img.vietqr.io/image/${cleanBank}-${cleanAcc}-compact2.png?amount=${cleanAmt}&addInfo=${cleanMemo}&accountName=${cleanName}`;
}
