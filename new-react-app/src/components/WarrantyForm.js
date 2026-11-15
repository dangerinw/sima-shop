import React, { useState, useEffect, useRef, useCallback } from 'react';

const CANVAS_WIDTH = 1240;
const CANVAS_HEIGHT = 1754;

export default function WarrantyForm({ onBack, initialAccount = null, storeSettings = {} }) {
  // Mobile Tab state ('form' | 'preview')
  const [mobileTab, setMobileTab] = useState('form');

  // Form State
  const [guarantorName, setGuarantorName] = useState('กิตติศักดิ์ ตันโพธิ์ธรรม (แอดซัน)');
  const [contractDate, setContractDate] = useState(() => {
    const today = new Date();
    const d = String(today.getDate()).padStart(2, '0');
    const m = String(today.getMonth() + 1).padStart(2, '0');
    const y = today.getFullYear() + 543;
    return `${d}/${m}/${y}`;
  });
  const [warrantyPeriod, setWarrantyPeriod] = useState('ตลอดชีพ');

  const [sellerName, setSellerName] = useState('');
  const [sellerPhone, setSellerPhone] = useState('');
  const [buyerName, setBuyerName] = useState('');
  const [idType, setIdType] = useState('thai'); // 'thai' | 'foreign'
  const [tradePrice, setTradePrice] = useState('');
  const [bankAccount, setBankAccount] = useState('');
  const [bankName, setBankName] = useState('');
  const [username, setUsername] = useState('');
  const [twoFactorCode, setTwoFactorCode] = useState('');

  const [middleAdminName, setMiddleAdminName] = useState('กิตติศักดิ์ ตันโพธิ์ธรรม (แอดซัน)');
  const [isWatermarkOn, setIsWatermarkOn] = useState(true);
  const [isStampOn, setIsStampOn] = useState(true);

  // References & Canvases
  const docCanvasRef = useRef(null);
  const sellerSigCanvasRef = useRef(null);
  const buyerSigCanvasRef = useRef(null);

  // Vector Signature Strokes
  const [sellerStrokes, setSellerStrokes] = useState([]);
  const [buyerStrokes, setBuyerStrokes] = useState([]);
  const isSigningSellerRef = useRef(false);
  const currentSellerStrokeRef = useRef(null);
  const isSigningBuyerRef = useRef(false);
  const currentBuyerStrokeRef = useRef(null);

  // ID Card Image Cache
  const [uploadedIdImg, setUploadedIdImg] = useState(null);
  const [idCardFileName, setIdCardFileName] = useState('');

  // Toast Notification State
  const [toast, setToast] = useState({ show: false, msg: '', isError: false });
  const showToast = (msg, isError = false) => {
    setToast({ show: true, msg, isError });
    setTimeout(() => {
      setToast({ show: false, msg: '', isError: false });
    }, 3200);
  };

  // Mobile Save Modal State
  const [mobileModalOpen, setMobileModalOpen] = useState(false);
  const [mobileModalImgUrl, setMobileModalImgUrl] = useState('');
  const savedBlobRef = useRef(null);
  const savedFilenameRef = useRef('');

  // Unique Contract Reference
  const [contractRefText] = useState(() => {
    const num = Math.floor(1000 + Math.random() * 9000);
    return `REF: PUBG-2026-${num}`;
  });

  // Pre-fill initial account if provided
  useEffect(() => {
    if (initialAccount) {
      if (initialAccount.id) setUsername(initialAccount.id);
      if (initialAccount.priceTHB) setTradePrice(Number(initialAccount.priceTHB).toLocaleString());
      if (initialAccount.region) {
        setIdType(initialAccount.region === 'th' ? 'thai' : 'foreign');
      }
      if (initialAccount.sellerName) setSellerName(initialAccount.sellerName);
      if (initialAccount.warranty) setWarrantyPeriod(initialAccount.warranty);
    }
  }, [initialAccount]);

  // Rounded rectangle helper
  const roundRect = (ctx, x, y, w, h, r) => {
    if (w < 2 * r) r = w / 2;
    if (h < 2 * r) r = h / 2;
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  };

  // Text Row with Dotted Line Helper
  const drawFieldRow = (ctx, label, value, x, y, width, font, labelColor, valueColor, suffix = '') => {
    ctx.font = font;
    ctx.fillStyle = labelColor;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'bottom';
    
    const labelWidth = ctx.measureText(label).width;
    ctx.fillText(label, x, y);

    let suffixWidth = 0;
    if (suffix) {
      ctx.fillStyle = '#475569';
      ctx.font = 'bold 17px "Prompt", "Sarabun", sans-serif';
      suffixWidth = ctx.measureText(suffix).width + 6;
      ctx.fillText(suffix, x + width - suffixWidth + 6, y);
    }

    const dotStartX = x + labelWidth + 8;
    const dotEndX = x + width - suffixWidth - 6;

    if (dotEndX > dotStartX) {
      ctx.save();
      ctx.setLineDash([2.5, 3.5]);
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.moveTo(dotStartX, y - 2);
      ctx.lineTo(dotEndX, y - 2);
      ctx.stroke();
      ctx.restore();

      if (value && String(value).trim() !== '') {
        ctx.save();
        ctx.font = 'bold 18px "Sarabun", "Prompt", sans-serif';
        ctx.fillStyle = valueColor;
        ctx.textAlign = 'left';
        ctx.beginPath();
        ctx.rect(dotStartX + 2, y - 30, dotEndX - dotStartX - 4, 38);
        ctx.clip();
        ctx.fillText(String(value), dotStartX + 6, y - 2);
        ctx.restore();
      }
    }
  };

  // Text Wrapper for terms
  const wrapText = (ctx, text, x, y, maxWidth, lineHeight) => {
    const words = text.split(' ');
    let line = '';
    let curY = y;

    for (let n = 0; n < words.length; n++) {
      const testLine = line + (line === '' ? '' : ' ') + words[n];
      const metrics = ctx.measureText(testLine);
      const testWidth = metrics.width;
      if (testWidth > maxWidth && n > 0) {
        ctx.fillText(line, x, curY);
        line = words[n];
        curY += lineHeight;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, x, curY);
    return curY;
  };

  // Redraw Signature Pad (Seller)
  const redrawSellerCanvas = useCallback(() => {
    const canvas = sellerSigCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    ctx.clearRect(0, 0, rect.width, rect.height);
    ctx.lineWidth = 2.8;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#0f172a';

    if (sellerStrokes.length > 0) {
      sellerStrokes.forEach((stroke) => {
        if (stroke.length < 2) return;
        ctx.beginPath();
        ctx.moveTo(stroke[0].x * rect.width, stroke[0].y * rect.height);
        for (let i = 1; i < stroke.length; i++) {
          ctx.lineTo(stroke[i].x * rect.width, stroke[i].y * rect.height);
        }
        ctx.stroke();
      });
    }
  }, [sellerStrokes]);

  // Redraw Signature Pad (Buyer)
  const redrawBuyerCanvas = useCallback(() => {
    const canvas = buyerSigCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    ctx.clearRect(0, 0, rect.width, rect.height);
    ctx.lineWidth = 2.8;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#0f172a';

    if (buyerStrokes.length > 0) {
      buyerStrokes.forEach((stroke) => {
        if (stroke.length < 2) return;
        ctx.beginPath();
        ctx.moveTo(stroke[0].x * rect.width, stroke[0].y * rect.height);
        for (let i = 1; i < stroke.length; i++) {
          ctx.lineTo(stroke[i].x * rect.width, stroke[i].y * rect.height);
        }
        ctx.stroke();
      });
    }
  }, [buyerStrokes]);

  // Wait for Google Fonts
  const waitForFonts = async () => {
    if (document.fonts) {
      try {
        await document.fonts.ready;
      } catch (_) {}
    }
  };

  // Main Document Render Function
  const renderDocumentCanvas = useCallback(() => {
    const canvas = docCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = CANVAS_WIDTH;
    const H = CANVAS_HEIGHT;

    // 1. Background White
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, W, H);

    // Outer Dark Border
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 3.5;
    roundRect(ctx, 30, 30, W - 60, H - 60, 16);
    ctx.stroke();

    // Inner Light Border
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 1.5;
    roundRect(ctx, 38, 38, W - 76, H - 76, 12);
    ctx.stroke();

    // Subtle Watermark Emblem
    ctx.save();
    ctx.globalAlpha = 0.03;
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.arc(W / 2, H / 2, 340, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // ==========================================
    // 2. HEADER: Title & Subheader
    // ==========================================
    const headerY = 50;
    const titleText = 'ใบรับประกันการซื้อขายไอดี PUBG PC';
    ctx.font = 'bold 32px "Prompt", "Sarabun", sans-serif';
    const titleWidth = ctx.measureText(titleText).width;

    const shieldW = 32;
    const shieldH = 38;
    const iconGap = 14;
    const totalHeaderWidth = shieldW + iconGap + titleWidth;
    const startX = (W - totalHeaderWidth) / 2;

    // Shield Icon
    const shieldX = startX;
    const shieldY = headerY;

    ctx.save();
    ctx.fillStyle = '#f59e0b';
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(shieldX, shieldY);
    ctx.lineTo(shieldX + (shieldW / 2), shieldY - 4);
    ctx.lineTo(shieldX + shieldW, shieldY);
    ctx.lineTo(shieldX + shieldW, shieldY + (shieldH * 0.45));
    ctx.quadraticCurveTo(shieldX + shieldW, shieldY + (shieldH * 0.9), shieldX + (shieldW / 2), shieldY + shieldH);
    ctx.quadraticCurveTo(shieldX, shieldY + (shieldH * 0.9), shieldX, shieldY + (shieldH * 0.45));
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Checkmark inside shield
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 3.5;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(shieldX + 9, shieldY + 18);
    ctx.lineTo(shieldX + 14, shieldY + 24);
    ctx.lineTo(shieldX + 23, shieldY + 12);
    ctx.stroke();
    ctx.restore();

    // Main Title
    ctx.fillStyle = '#090d16';
    ctx.font = 'bold 32px "Prompt", "Sarabun", sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(titleText, startX + shieldW + iconGap, shieldY + (shieldH / 2) + 2);

    // Subheader: ผู้รับประกัน & วันที่ทำสัญญา (ตรงตามแบบฟอร์ม 2 บรรทัดจัดกึ่งกลาง)
    const guarantorVal = guarantorName.trim() || '...................................................';
    const contractDateVal = contractDate.trim() || '...... / ...... / ............';

    const subRowW = 560;
    const subStartX = (W - subRowW) / 2;

    const sub1Y = headerY + 68;
    drawFieldRow(ctx, 'ผู้รับประกัน :', guarantorVal, subStartX, sub1Y, subRowW, 'bold 18px "Prompt", "Sarabun", sans-serif', '#1e293b', '#0284c7');

    const sub2Y = sub1Y + 36;
    drawFieldRow(ctx, 'วันที่ทำสัญญา :', contractDateVal, subStartX, sub2Y, subRowW, 'bold 18px "Prompt", "Sarabun", sans-serif', '#1e293b', '#0f172a');

    // ==========================================
    // 3. SECTION: 📌 รายละเอียดการซื้อขาย
    // ==========================================
    const sec1Y = sub2Y + 20;
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 20px "Prompt", "Sarabun", sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('📌 รายละเอียดการซื้อขาย', 65, sec1Y + 20);

    const box1Y = sec1Y + 30;
    const box1W = W - 130;
    const box1H = 250;

    ctx.fillStyle = '#ffffff';
    roundRect(ctx, 65, box1Y, box1W, box1H, 12);
    ctx.fill();
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    let rowY = box1Y + 36;
    const gapY = 38;

    // Row 1: ชื่อผู้ขาย + เบอร์ติดต่อ
    drawFieldRow(ctx, '1. ชื่อผู้ขาย :', sellerName, 85, rowY, 600, 'bold 17px "Prompt", "Sarabun", sans-serif', '#1e293b', '#1e40af');
    drawFieldRow(ctx, '(เบอร์ติดต่อ) :', sellerPhone, 710, rowY, box1W - 665, 'bold 17px "Prompt", "Sarabun", sans-serif', '#1e293b', '#1e40af');

    // Row 2: ชื่อผู้ซื้อ
    rowY += gapY;
    drawFieldRow(ctx, '2. ชื่อผู้ซื้อ :', buyerName, 85, rowY, box1W - 40, 'bold 17px "Prompt", "Sarabun", sans-serif', '#1e293b', '#065f46');

    // Row 3: ประเภทไอดี: [ ] ไอดีไทย   [ ] ไอดีนอก
    rowY += gapY;
    ctx.font = 'bold 17px "Prompt", "Sarabun", sans-serif';
    ctx.fillStyle = '#1e293b';
    ctx.fillText('3. ประเภทไอดี :', 85, rowY);

    const cb1X = 230;
    const cbY = rowY - 18;
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 2;
    roundRect(ctx, cb1X, cbY, 18, 18, 4);
    ctx.stroke();
    if (idType === 'thai') {
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(cb1X + 3, cbY + 3, 12, 12);
    }
    ctx.font = 'bold 17px "Prompt", "Sarabun", sans-serif';
    ctx.fillStyle = '#0f172a';
    ctx.fillText('ไอดีไทย', cb1X + 26, rowY);

    const cb2X = 350;
    roundRect(ctx, cb2X, cbY, 18, 18, 4);
    ctx.stroke();
    if (idType === 'foreign') {
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(cb2X + 3, cbY + 3, 12, 12);
    }
    ctx.font = 'bold 17px "Prompt", "Sarabun", sans-serif';
    ctx.fillStyle = '#0f172a';
    ctx.fillText('ไอดีนอก', cb2X + 26, rowY);

    // Row 4: ราคาไอดี + เลขที่บัญชี + ธนาคาร
    rowY += gapY;
    drawFieldRow(ctx, '4. ราคาไอดี :', tradePrice, 85, rowY, 260, 'bold 17px "Prompt", "Sarabun", sans-serif', '#1e293b', '#b45309', 'บาท');
    drawFieldRow(ctx, 'เลขที่บัญชี :', bankAccount, 375, rowY, 320, 'bold 17px "Prompt", "Sarabun", sans-serif', '#1e293b', '#0f172a');
    drawFieldRow(ctx, 'ธนาคาร :', bankName, 725, rowY, box1W - 680, 'bold 17px "Prompt", "Sarabun", sans-serif', '#1e293b', '#0f172a');

    // Row 5: USERNAME + รหัส 2 ชั้นในเกม
    rowY += gapY;
    drawFieldRow(ctx, '5. USERNAME (ไอดีที่ใช้เข้าเกม) :', username, 85, rowY, 570, 'bold 17px "Prompt", "Sarabun", sans-serif', '#1e293b', '#0f172a');
    drawFieldRow(ctx, '(รหัส 2 ชั้นในเกม) :', twoFactorCode || '-', 680, rowY, box1W - 635, 'bold 17px "Prompt", "Sarabun", sans-serif', '#1e293b', '#0f172a');

    // Row 6: ระยะเวลารับประกัน
    rowY += gapY;
    drawFieldRow(ctx, '6. ระยะเวลารับประกัน :', warrantyPeriod, 85, rowY, box1W - 40, 'bold 17px "Prompt", "Sarabun", sans-serif', '#1e293b', '#0284c7');

    // ==========================================
    // 4. SECTION: 🪪 สำเนาบัตรประชาชนผู้ขาย (ตัวจริง)
    // ==========================================
    const sec2Y = box1Y + box1H + 16;
    const idBoxW = box1W;
    const idBoxH = 345;

    ctx.fillStyle = '#ffffff';
    roundRect(ctx, 65, sec2Y, idBoxW, idBoxH, 12);
    ctx.fill();
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = '#0f172a';
    roundRect(ctx, 65, sec2Y, idBoxW, 36, 10);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 17px "Prompt", "Sarabun", sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('🪪  สำเนาบัตรประชาชนผู้ขาย (ตัวจริง)', 80, sec2Y + 24);

    const innerIdX = 85;
    const innerIdY = sec2Y + 48;
    const innerIdW = idBoxW - 40;
    const innerIdH = idBoxH - 60;

    if (uploadedIdImg) {
      ctx.save();
      roundRect(ctx, innerIdX, innerIdY, innerIdW, innerIdH, 10);
      ctx.clip();

      const imgRatio = uploadedIdImg.width / uploadedIdImg.height;
      const boxRatio = innerIdW / innerIdH;
      let drawW, drawH, drawX, drawY;

      if (imgRatio > boxRatio) {
        drawW = innerIdW;
        drawH = drawW / imgRatio;
        drawX = innerIdX;
        drawY = innerIdY + ((innerIdH - drawH) / 2);
      } else {
        drawH = innerIdH;
        drawW = drawH * imgRatio;
        drawX = innerIdX + ((innerIdW - drawW) / 2);
        drawY = innerIdY;
      }

      ctx.drawImage(uploadedIdImg, drawX, drawY, drawW, drawH);

      if (isWatermarkOn) {
        ctx.save();
        ctx.translate(innerIdX + (innerIdW / 2), innerIdY + (innerIdH / 2));
        ctx.rotate(-12 * Math.PI / 180);

        ctx.fillStyle = 'rgba(220, 38, 38, 0.45)';
        ctx.fillRect(-340, -22, 680, 44);

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 18px "Prompt", "Sarabun", sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('ใช้สำหรับรับประกันการซื้อขายไอดี PUBG PC ผ่านแอดซันเท่านั้น', 0, 0);
        ctx.restore();
      }

      ctx.restore();

      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 1.5;
      roundRect(ctx, innerIdX, innerIdY, innerIdW, innerIdH, 10);
      ctx.stroke();
    } else {
      ctx.save();
      ctx.setLineDash([8, 8]);
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 2;
      roundRect(ctx, innerIdX, innerIdY, innerIdW, innerIdH, 12);
      ctx.stroke();
      ctx.restore();

      const iconBoxW = 200;
      const iconBoxH = 110;
      const iconBoxX = innerIdX + (innerIdW - iconBoxW) / 2;
      const iconBoxY = innerIdY + 40;

      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 3;
      roundRect(ctx, iconBoxX, iconBoxY, iconBoxW, iconBoxH, 12);
      ctx.stroke();

      ctx.fillStyle = '#cbd5e1';
      ctx.beginPath();
      ctx.arc(iconBoxX + 45, iconBoxY + 45, 20, 0, Math.PI * 2);
      ctx.fill();

      ctx.beginPath();
      ctx.arc(iconBoxX + 45, iconBoxY + 95, 30, Math.PI, 0);
      ctx.fill();

      ctx.fillStyle = '#94a3b8';
      ctx.fillRect(iconBoxX + 90, iconBoxY + 35, 80, 10);
      ctx.fillRect(iconBoxX + 90, iconBoxY + 55, 60, 8);
      ctx.fillRect(iconBoxX + 90, iconBoxY + 75, 70, 8);

      ctx.fillStyle = '#334155';
      ctx.font = 'bold 20px "Prompt", "Sarabun", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('วางรูปบัตรประชาชนผู้ขายตรงนี้', innerIdX + (innerIdW / 2), iconBoxY + iconBoxH + 42);

      ctx.fillStyle = '#64748b';
      ctx.font = '16px "Sarabun", "Prompt", sans-serif';
      ctx.fillText('(ถ่ายชัดเจน เห็นข้อมูลครบ)', innerIdX + (innerIdW / 2), iconBoxY + iconBoxH + 72);
    }

    // ==========================================
    // 5. SECTION: 📝 เงื่อนไขการรับประกัน
    // ==========================================
    const sec3Y = sec2Y + idBoxH + 16;
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 20px "Prompt", "Sarabun", sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('📝 เงื่อนไขการรับประกัน', 65, sec3Y + 16);

    let termY = sec3Y + 38;
    const textW = box1W;

    // ข้อ 1
    ctx.font = 'bold 16.5px "Prompt", "Sarabun", sans-serif';
    ctx.fillStyle = '#0f172a';
    ctx.fillText('ข้อ 1.  การรับประกันไอดี', 65, termY);
    termY += 21;

    ctx.font = '14.5px "Sarabun", "Prompt", sans-serif';
    ctx.fillStyle = '#334155';
    const term1Text = 'ผู้ขาย / ผู้รับประกัน ขอรับรองว่าได้ขายไอดี PUBG PC ตามรายละเอียดข้างต้นให้แก่ผู้ซื้อจริง และยินดีรับผิดชอบตามเงื่อนไขที่กำหนดไว้ หากเกิดปัญหาไอดีถูกดึงคืน ถูกยึดคืนโดยเจ้าของเดิม หรือผู้ซื้อไม่สามารถเข้าใช้งานได้ เนื่องจากการกระทำของผู้ขายหรือบุคคลที่เกี่ยวข้องกับการขาย';
    termY = wrapText(ctx, term1Text, 95, termY, textW - 40, 20) + 26;

    // ข้อ 2
    ctx.font = 'bold 16.5px "Prompt", "Sarabun", sans-serif';
    ctx.fillStyle = '#0f172a';
    ctx.fillText('ข้อ 2.  การชดใช้ค่าเสียหาย', 65, termY);
    termY += 21;

    ctx.font = '14.5px "Sarabun", "Prompt", sans-serif';
    ctx.fillStyle = '#334155';
    const term2Text = 'หากเกิดเหตุการณ์ตามข้อ 1 และตรวจสอบได้ว่าเป็นความรับผิดชอบของผู้ขาย / ผู้รับประกัน ผู้ขาย / ผู้รับประกัน ต้องชดใช้ค่าเสียหายเต็มจำนวนจากราคาที่ขายไอดี หากไม่ชำระภายใน 3 วัน จำนวน ต้องชดใช้คืน 10 เท่าของ';
    termY = wrapText(ctx, term2Text, 95, termY, textW - 40, 20) + 24;

    const numRaw = parseFloat(String(tradePrice).replace(/,/g, '')) || 0;
    const formattedPrice = numRaw > 0 ? numRaw.toLocaleString('th-TH') : (tradePrice || '................................');
    const tenTimesVal = numRaw > 0 ? (numRaw * 10).toLocaleString('th-TH') : '................................';

    ctx.font = 'bold 15px "Prompt", "Sarabun", sans-serif';
    ctx.fillStyle = '#1e293b';
    ctx.fillText('•  ราคาซื้อขายไอดี :', 115, termY);
    ctx.font = 'bold 17px "Sarabun", "Prompt", sans-serif';
    ctx.fillStyle = '#0f172a';
    ctx.fillText(formattedPrice, 270, termY);
    ctx.save();
    ctx.setLineDash([2, 3]);
    ctx.strokeStyle = '#94a3b8';
    ctx.beginPath();
    ctx.moveTo(260, termY + 2);
    ctx.lineTo(580, termY + 2);
    ctx.stroke();
    ctx.restore();
    ctx.font = 'bold 15px "Prompt", "Sarabun", sans-serif';
    ctx.fillStyle = '#1e293b';
    ctx.fillText('บาท', 590, termY);
    termY += 25;

    ctx.font = 'bold 15px "Prompt", "Sarabun", sans-serif';
    ctx.fillStyle = '#b91c1c';
    ctx.fillText('•  จำนวนเงินชดใช้ 10 เท่า :', 115, termY);
    ctx.font = 'bold 17px "Sarabun", "Prompt", sans-serif';
    ctx.fillStyle = '#b91c1c';
    ctx.fillText(tenTimesVal, 320, termY);
    ctx.save();
    ctx.setLineDash([2, 3]);
    ctx.strokeStyle = '#f87171';
    ctx.beginPath();
    ctx.moveTo(310, termY + 2);
    ctx.lineTo(580, termY + 2);
    ctx.stroke();
    ctx.restore();
    ctx.font = 'bold 15px "Prompt", "Sarabun", sans-serif';
    ctx.fillStyle = '#b91c1c';
    ctx.fillText('บาท', 590, termY);
    termY += 26;

    // ข้อ 3
    ctx.font = 'bold 16.5px "Prompt", "Sarabun", sans-serif';
    ctx.fillStyle = '#0f172a';
    ctx.fillText('ข้อ 3.  กำหนดระยะเวลาชำระเงิน', 65, termY);
    termY += 21;

    ctx.font = '14.5px "Sarabun", "Prompt", sans-serif';
    ctx.fillStyle = '#334155';
    const term3Text = 'ผู้ขาย / ผู้รับประกันตกลงชำระเงินชดใช้ภายใน 3 วัน นับจากวันที่ได้รับแจ้งและมีหลักฐานยืนยันความรับผิดชอบ';
    termY = wrapText(ctx, term3Text, 95, termY, textW - 40, 20) + 26;

    // ข้อ 4
    ctx.font = 'bold 16.5px "Prompt", "Sarabun", sans-serif';
    ctx.fillStyle = '#0f172a';
    ctx.fillText('ข้อ 4.  กรณีไม่ชำระเงินตามกำหนด', 65, termY);
    termY += 21;

    ctx.font = '14.5px "Sarabun", "Prompt", sans-serif';
    ctx.fillStyle = '#334155';
    const term4Text = 'หากผู้ขาย / ผู้รับประกันไม่ชำระเงินภายในกำหนด ผู้ซื้อมีสิทธิดำเนินการตามกฎหมาย รวมถึงรวบรวมหลักฐาน เพื่อร้องเรียนต่อหน่วยงานที่เกี่ยวข้อง และเปิดเผยข้อเท็จจริงพร้อมหลักฐานตามความเหมาะสมและภายใต้กฎหมาย';
    termY = wrapText(ctx, term4Text, 95, termY, textW - 40, 20) + 16;

    // ==========================================
    // 6. SIGNATURE TABLE: 2 COLUMNS
    // ==========================================
    const sigBoxY = Math.max(termY, 1375);
    const sigBoxW = box1W;
    const sigBoxH = 185;

    ctx.fillStyle = '#ffffff';
    roundRect(ctx, 65, sigBoxY, sigBoxW, sigBoxH, 12);
    ctx.fill();
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 2;
    ctx.stroke();

    const midSigX = 65 + (sigBoxW / 2);
    ctx.beginPath();
    ctx.moveTo(midSigX, sigBoxY);
    ctx.lineTo(midSigX, sigBoxY + sigBoxH);
    ctx.stroke();

    // LEFT: ผู้ขาย / ผู้รับประกัน
    const leftColCenterX = 65 + (sigBoxW / 4);
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 18px "Prompt", "Sarabun", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('ผู้ขาย / ผู้รับประกัน', leftColCenterX, sigBoxY + 34);

    const sigLineY = sigBoxY + 120;
    ctx.font = '16px "Prompt", "Sarabun", sans-serif';
    ctx.fillStyle = '#334155';
    ctx.textAlign = 'left';
    ctx.fillText('ลงชื่อ', leftColCenterX - 180, sigLineY);

    ctx.save();
    ctx.setLineDash([3, 4]);
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(leftColCenterX - 130, sigLineY);
    ctx.lineTo(leftColCenterX + 180, sigLineY);
    ctx.stroke();
    ctx.restore();

    if (sellerStrokes.length > 0) {
      ctx.save();
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 2.6;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      const sTargetX = leftColCenterX - 110;
      const sTargetY = sigLineY - 60;
      const sTargetW = 240;
      const sTargetH = 55;

      sellerStrokes.forEach((stroke) => {
        if (stroke.length < 2) return;
        ctx.beginPath();
        ctx.moveTo(sTargetX + (stroke[0].x * sTargetW), sTargetY + (stroke[0].y * sTargetH));
        for (let i = 1; i < stroke.length; i++) {
          ctx.lineTo(sTargetX + (stroke[i].x * sTargetW), sTargetY + (stroke[i].y * sTargetH));
        }
        ctx.stroke();
      });
      ctx.restore();
    }

    ctx.font = 'bold 16px "Sarabun", "Prompt", sans-serif';
    ctx.fillStyle = '#0f172a';
    ctx.textAlign = 'center';
    const cleanSName = sellerName ? sellerName : '...................................................';
    ctx.fillText(`( ${cleanSName} )`, leftColCenterX, sigLineY + 32);

    // RIGHT: ผู้ซื้อ
    const rightColCenterX = midSigX + (sigBoxW / 4);
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 18px "Prompt", "Sarabun", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('ผู้ซื้อ', rightColCenterX, sigBoxY + 34);

    ctx.font = '16px "Prompt", "Sarabun", sans-serif';
    ctx.fillStyle = '#334155';
    ctx.textAlign = 'left';
    ctx.fillText('ลงชื่อ', rightColCenterX - 180, sigLineY);

    ctx.save();
    ctx.setLineDash([3, 4]);
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(rightColCenterX - 130, sigLineY);
    ctx.lineTo(rightColCenterX + 180, sigLineY);
    ctx.stroke();
    ctx.restore();

    if (buyerStrokes.length > 0) {
      ctx.save();
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 2.6;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      const bTargetX = rightColCenterX - 110;
      const bTargetY = sigLineY - 60;
      const bTargetW = 240;
      const bTargetH = 55;

      buyerStrokes.forEach((stroke) => {
        if (stroke.length < 2) return;
        ctx.beginPath();
        ctx.moveTo(bTargetX + (stroke[0].x * bTargetW), bTargetY + (stroke[0].y * bTargetH));
        for (let i = 1; i < stroke.length; i++) {
          ctx.lineTo(bTargetX + (stroke[i].x * bTargetW), bTargetY + (stroke[i].y * bTargetH));
        }
        ctx.stroke();
      });
      ctx.restore();
    }

    ctx.font = 'bold 16px "Sarabun", "Prompt", sans-serif';
    ctx.fillStyle = '#0f172a';
    ctx.textAlign = 'center';
    const cleanBName = buyerName ? buyerName : '...................................................';
    ctx.fillText(`( ${cleanBName} )`, rightColCenterX, sigLineY + 32);

    // ==========================================
    // 7. FOOTER NOTE & ADMIN STAMP
    // ==========================================
    const footerY = sigBoxY + sigBoxH + 42;
    const middleAdminVal = middleAdminName.trim() || 'กิตติศักดิ์ ตันโพธิ์ธรรม (แอดซัน)';

    ctx.font = 'bold 20px "Prompt", "Sarabun", sans-serif';
    ctx.fillStyle = '#0f172a';
    ctx.textAlign = 'center';
    ctx.fillText(`กลางโดยแอดมิน ${middleAdminVal}`, W / 2, footerY);

    if (isStampOn) {
      ctx.save();
      ctx.translate(W - 165, footerY - 5);
      ctx.rotate(-7 * Math.PI / 180);

      ctx.strokeStyle = '#dc2626';
      ctx.lineWidth = 3.2;
      ctx.beginPath();
      ctx.arc(0, 0, 48, 0, Math.PI * 2);
      ctx.stroke();

      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.arc(0, 0, 42, 0, Math.PI * 2);
      ctx.stroke();

      ctx.fillStyle = '#dc2626';
      ctx.font = '900 10px "Prompt", "Sarabun", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('PUBG PC VERIFIED', 0, -22);

      ctx.font = '900 15px "Prompt", "Sarabun", sans-serif';
      ctx.fillText('แอดซัน', 0, 2);

      ctx.font = 'bold 9.5px "Prompt", "Sarabun", sans-serif';
      ctx.fillText('กลางปลอดภัย 100%', 0, 18);
      ctx.fillText('GUARANTEED', 0, 29);

      ctx.restore();
    }

    ctx.fillStyle = '#94a3b8';
    ctx.font = '12px "Prompt", "Sarabun", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`[ ${contractRefText} ] • เอกสารใบรับประกันการซื้อขายไอดี PUBG PC มีผลผูกพันทางกฎหมาย`, W / 2, H - 44);
  }, [
    guarantorName, contractDate, warrantyPeriod,
    sellerName, sellerPhone, buyerName, idType,
    tradePrice, bankAccount, bankName, username, twoFactorCode,
    middleAdminName, isWatermarkOn, isStampOn,
    uploadedIdImg, sellerStrokes, buyerStrokes, contractRefText
  ]);

  // Redraw canvas whenever dependencies change
  useEffect(() => {
    const canvas = docCanvasRef.current;
    if (canvas) {
      canvas.width = CANVAS_WIDTH;
      canvas.height = CANVAS_HEIGHT;
      waitForFonts().then(() => {
        renderDocumentCanvas();
      });
    }
  }, [renderDocumentCanvas]);

  useEffect(() => {
    redrawSellerCanvas();
  }, [sellerStrokes, redrawSellerCanvas]);

  useEffect(() => {
    redrawBuyerCanvas();
  }, [buyerStrokes, redrawBuyerCanvas]);

  // Handle ID Card Upload
  const handleIdUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIdCardFileName(file.name);
    const reader = new FileReader();
    reader.onload = (evt) => {
      const rawImg = new Image();
      rawImg.onload = () => {
        const maxDim = 1920;
        let targetW = rawImg.width;
        let targetH = rawImg.height;

        if (targetW > maxDim || targetH > maxDim) {
          if (targetW > targetH) {
            targetH = Math.round((targetH * maxDim) / targetW);
            targetW = maxDim;
          } else {
            targetW = Math.round((targetW * maxDim) / targetH);
            targetH = maxDim;
          }
        }

        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = targetW;
        tempCanvas.height = targetH;
        const tempCtx = tempCanvas.getContext('2d');
        tempCtx.drawImage(rawImg, 0, 0, targetW, targetH);

        const optimizedImg = new Image();
        optimizedImg.onload = () => {
          setUploadedIdImg(optimizedImg);
          showToast('แนบรูปบัตรประชาชนเรียบร้อยแล้ว');
        };
        optimizedImg.src = tempCanvas.toDataURL('image/jpeg', 0.92);
      };
      rawImg.src = evt.target.result;
    };
    reader.readAsDataURL(file);
  };

  // Helper for touch & mouse coords
  const getNormalizedCoords = (canvas, e) => {
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
      x: Math.max(0, Math.min(1, (clientX - rect.left) / rect.width)),
      y: Math.max(0, Math.min(1, (clientY - rect.top) / rect.height))
    };
  };

  // Seller Signature Event Listeners
  const handleSellerStart = (e) => {
    const canvas = sellerSigCanvasRef.current;
    if (!canvas) return;
    isSigningSellerRef.current = true;
    currentSellerStrokeRef.current = [getNormalizedCoords(canvas, e)];
    setSellerStrokes((prev) => [...prev, currentSellerStrokeRef.current]);
  };
  const handleSellerMove = (e) => {
    const canvas = sellerSigCanvasRef.current;
    if (!isSigningSellerRef.current || !currentSellerStrokeRef.current || !canvas) return;
    currentSellerStrokeRef.current.push(getNormalizedCoords(canvas, e));
    redrawSellerCanvas();
    if (e.cancelable) e.preventDefault();
  };
  const handleSellerEnd = () => {
    if (isSigningSellerRef.current) {
      isSigningSellerRef.current = false;
      currentSellerStrokeRef.current = null;
      redrawSellerCanvas();
      renderDocumentCanvas();
    }
  };

  // Buyer Signature Event Listeners
  const handleBuyerStart = (e) => {
    const canvas = buyerSigCanvasRef.current;
    if (!canvas) return;
    isSigningBuyerRef.current = true;
    currentBuyerStrokeRef.current = [getNormalizedCoords(canvas, e)];
    setBuyerStrokes((prev) => [...prev, currentBuyerStrokeRef.current]);
  };
  const handleBuyerMove = (e) => {
    const canvas = buyerSigCanvasRef.current;
    if (!isSigningBuyerRef.current || !currentBuyerStrokeRef.current || !canvas) return;
    currentBuyerStrokeRef.current.push(getNormalizedCoords(canvas, e));
    redrawBuyerCanvas();
    if (e.cancelable) e.preventDefault();
  };
  const handleBuyerEnd = () => {
    if (isSigningBuyerRef.current) {
      isSigningBuyerRef.current = false;
      currentBuyerStrokeRef.current = null;
      redrawBuyerCanvas();
      renderDocumentCanvas();
    }
  };

  // Fill Sample Data
  const handleFillSample = () => {
    setGuarantorName('กิตติศักดิ์ ตันโพธิ์ธรรม (แอดซัน)');
    setSellerName('นายอัครเดช มงคลศิลป์');
    setSellerPhone('089-765-4321');
    setBuyerName('คุณวรัญญู รัตนโชติ');
    setIdType('thai');
    setTradePrice('4,500');
    setBankAccount('082-1-49281-9');
    setBankName('กสิกรไทย (KBANK)');
    setUsername('pubg_god_legend99');
    setTwoFactorCode('849201');
    setWarrantyPeriod('ตลอดชีพ');
    setMiddleAdminName('กิตติศักดิ์ ตันโพธิ์ธรรม (แอดซัน)');

    setSellerStrokes([
      [
        { x: 0.10, y: 0.65 },
        { x: 0.18, y: 0.25 },
        { x: 0.28, y: 0.85 },
        { x: 0.40, y: 0.35 },
        { x: 0.52, y: 0.18 },
        { x: 0.60, y: 0.70 },
        { x: 0.75, y: 0.48 },
        { x: 0.90, y: 0.42 }
      ],
      [
        { x: 0.20, y: 0.55 },
        { x: 0.85, y: 0.55 }
      ]
    ]);
    showToast('กรอกข้อมูลตัวอย่างเรียบร้อย');
  };

  // Reset Form
  const handleReset = () => {
    setSellerName('');
    setSellerPhone('');
    setBuyerName('');
    setIdType('thai');
    setTradePrice('');
    setBankAccount('');
    setBankName('');
    setUsername('');
    setTwoFactorCode('');
    setUploadedIdImg(null);
    setIdCardFileName('');
    setSellerStrokes([]);
    setBuyerStrokes([]);
    showToast('ล้างข้อมูลฟอร์มเรียบร้อย');
  };

  // Copy Image to Clipboard
  const handleCopyImage = async () => {
    try {
      await waitForFonts();
      renderDocumentCanvas();
      const canvas = docCanvasRef.current;
      if (!canvas) return;

      canvas.toBlob(async (blob) => {
        if (!blob) {
          showToast('ไม่สามารถคัดลอกรูปได้', true);
          return;
        }
        if (navigator.clipboard && navigator.clipboard.write) {
          await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
          showToast('คัดลอกรูปภาพลงคลิปบอร์ดแล้ว!');
        } else {
          showToast('เบราว์เซอร์ไม่รองรับการคัดลอกรูป กรุณาใช้ปุ่มบันทึกภาพ', true);
        }
      });
    } catch (_) {
      showToast('เกิดข้อผิดพลาดในการคัดลอกรูป', true);
    }
  };

  // Download High-Res PNG
  const handleDownloadPNG = async () => {
    try {
      await waitForFonts();
      renderDocumentCanvas();
      const canvas = docCanvasRef.current;
      if (!canvas) return;

      const cleanSeller = (sellerName.trim() || 'ผู้ขาย').replace(/[\s/\\:*?"<>|]/g, '_');
      const filename = `ใบรับประกัน_PUBG_PC_${cleanSeller}.png`;
      savedFilenameRef.current = filename;

      canvas.toBlob((blob) => {
        if (!blob) {
          showToast('ไม่สามารถสร้างรูปภาพได้', true);
          return;
        }
        savedBlobRef.current = blob;
        const blobUrl = URL.createObjectURL(blob);

        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || window.innerWidth < 1024;
        if (isMobile) {
          setMobileModalImgUrl(blobUrl);
          setMobileModalOpen(true);
        }

        const link = document.createElement('a');
        link.download = filename;
        link.href = blobUrl;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        showToast('สร้างภาพ A4 สำเร็จ!');
      }, 'image/png', 1.0);
    } catch (_) {
      showToast('เกิดข้อผิดพลาดในการสร้างรูป', true);
    }
  };

  // Download PDF
  const handleDownloadPDF = async () => {
    try {
      await waitForFonts();
      renderDocumentCanvas();
      const canvas = docCanvasRef.current;
      if (!canvas) return;

      if (!window.jspdf) {
        showToast('กำลังโหลดโมดูล PDF กรุณาลองใหม่อีกครั้ง', true);
        return;
      }

      const { jsPDF } = window.jspdf;
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
        compress: true
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.96);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);

      const cleanSeller = (sellerName.trim() || 'ผู้ขาย').replace(/[\s/\\:*?"<>|]/g, '_');
      const pdfFilename = `ใบรับประกัน_PUBG_PC_${cleanSeller}.pdf`;

      pdf.save(pdfFilename);
      showToast('ดาวน์โหลด PDF ขนาด A4 สำเร็จ!');
    } catch (e) {
      console.error(e);
      showToast('เกิดข้อผิดพลาดในการสร้าง PDF', true);
    }
  };

  // Print Canvas
  const handlePrint = () => {
    const canvas = docCanvasRef.current;
    if (!canvas) return;
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      window.print();
      return;
    }
    const dataUrl = canvas.toDataURL('image/png', 1.0);
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>พิมพ์ใบรับประกันไอดี PUBG PC</title>
          <style>
            @page { size: A4 portrait; margin: 0; }
            body { margin: 0; display: flex; justify-content: center; align-items: center; }
            img { width: 100vw; height: 100vh; object-fit: contain; }
          </style>
        </head>
        <body onload="window.print(); window.close();">
          <img src="${dataUrl}" />
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  // 10x penalty display
  const rawNum = parseFloat(String(tradePrice).replace(/,/g, '')) || 0;
  const tenTimesPenaltyDisplay = rawNum > 0 ? (rawNum * 10).toLocaleString('th-TH') + ' บาท' : '0 บาท';

  return (
    <div className="min-h-screen bg-[#080c15] text-slate-100 py-4 sm:py-6 px-3 sm:px-6 pb-24 lg:pb-8 flex flex-col items-center font-sans">
      
      {/* Top Header Navigation */}
      <header className="w-full max-w-7xl mb-4 sm:mb-6 text-center text-white">
        <div className="flex items-center justify-between gap-3 mb-2 flex-wrap">
          {onBack && (
            <button
              onClick={onBack}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl text-xs font-bold transition border border-slate-700 shadow"
            >
              <span>←</span>
              <span>ย้อนกลับ</span>
            </button>
          )}

          <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-amber-500/20 text-amber-400 border border-amber-500/40 rounded-full text-xs sm:text-sm font-semibold">
            <span>🛡️</span>
            <span>PUBG PC • ระบบทำสัญญาซื้อขายและออกใบรับประกันไอดี</span>
          </div>

          <a 
            href="/warranty.html" 
            target="_blank" 
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-amber-400 hover:text-amber-300 rounded-xl text-xs font-semibold transition border border-slate-700 shadow"
            title="เปิดในแท็บใหม่แบบเต็มหน้าจอ"
          >
            <span>↗</span>
            <span className="hidden sm:inline">เปิดหน้าเดี่ยว (Standalone)</span>
          </a>
        </div>

        <h1 className="text-xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white mb-1.5 flex items-center justify-center gap-2">
          <span>ใบรับประกันการซื้อขายไอดี PUBG PC</span>
        </h1>
        <p className="text-[11px] sm:text-sm text-slate-400 max-w-2xl mx-auto">
          ระบบอัตโนมัติ บันทึกภาพตรงกันเป๊ะทั้งบนมือถือและคอมพิวเตอร์ คมชัดสูงมาตรฐาน A4 พิมพ์หรือดาวน์โหลด PDF ได้ทันที
        </p>

        {/* Mobile View Switcher */}
        <div className="lg:hidden flex items-center bg-slate-900/90 p-1 rounded-xl border border-slate-800 mt-3 max-w-md mx-auto shadow-lg">
          <button 
            type="button" 
            onClick={() => setMobileTab('form')} 
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition flex items-center justify-center gap-1.5 ${
              mobileTab === 'form' ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>📝 1. กรอกข้อมูลสัญญา</span>
          </button>
          <button 
            type="button" 
            onClick={() => setMobileTab('preview')} 
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition flex items-center justify-center gap-1.5 ${
              mobileTab === 'preview' ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>📄 2. ดูตัวอย่าง & เซฟ A4</span>
          </button>
        </div>
      </header>

      {/* Main Grid Workspace */}
      <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT PANEL: Interactive Controls Form */}
        <div className={`lg:col-span-5 bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-2xl flex flex-col gap-4 ${
          mobileTab === 'preview' ? 'hidden lg:flex' : 'flex'
        }`}>
          
          {/* Top Action Bar */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h2 className="text-xs sm:text-sm font-bold text-amber-400 flex items-center gap-1.5">
              <span>⚙️</span>
              <span>กรอกข้อมูลสัญญา (อัปเดตแบบเรียลไทม์)</span>
            </h2>
            <div className="flex items-center gap-1.5">
              <button 
                type="button" 
                onClick={handleFillSample} 
                className="text-[11px] sm:text-xs bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30 px-2.5 py-1 rounded-lg transition font-medium flex items-center gap-1 active:scale-95"
              >
                <span>✨</span>
                <span>ตัวอย่าง</span>
              </button>
              <button 
                type="button" 
                onClick={handleReset} 
                className="text-[11px] sm:text-xs bg-red-950/60 hover:bg-red-900 text-red-300 border border-red-500/30 px-2.5 py-1 rounded-lg transition font-medium flex items-center gap-1 active:scale-95"
              >
                <span>↺</span>
                <span>ล้างฟอร์ม</span>
              </button>
            </div>
          </div>

          <form className="space-y-4 text-xs" onSubmit={(e) => e.preventDefault()}>
            
            {/* SECTION 1: หัวสัญญา & ผู้รับประกัน */}
            <div className="space-y-2.5 bg-slate-950/60 p-3 sm:p-3.5 rounded-xl border border-slate-800">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <span>🛡️</span>
                <span>1. ข้อมูลหัวสัญญา & ผู้รับประกัน</span>
              </label>
              <div>
                <label className="block text-slate-400 mb-1">ผู้รับประกัน *</label>
                <input 
                  type="text" 
                  value={guarantorName} 
                  onChange={(e) => setGuarantorName(e.target.value)} 
                  placeholder="เช่น กิตติศักดิ์ ตันโพธิ์ธรรม (แอดซัน)" 
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-500 transition"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-400 mb-1">วันที่ทำสัญญา *</label>
                  <input 
                    type="text" 
                    value={contractDate} 
                    onChange={(e) => setContractDate(e.target.value)} 
                    placeholder="เช่น 15/11/2569" 
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-500 transition"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">ระยะเวลารับประกัน *</label>
                  <input 
                    type="text" 
                    value={warrantyPeriod} 
                    onChange={(e) => setWarrantyPeriod(e.target.value)} 
                    placeholder="เช่น ตลอดชีพ / 30 วัน / 1 ปี" 
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-500 transition"
                  />
                </div>
              </div>
            </div>

            {/* SECTION 2: รายละเอียดการซื้อขาย */}
            <div className="space-y-2.5 bg-slate-950/60 p-3 sm:p-3.5 rounded-xl border border-slate-800">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <span>📌</span>
                <span>2. รายละเอียดผู้ขาย & ผู้ซื้อ</span>
              </label>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-400 mb-1">1. ชื่อผู้ขาย *</label>
                  <input 
                    type="text" 
                    value={sellerName} 
                    onChange={(e) => setSellerName(e.target.value)} 
                    placeholder="เช่น นายสมชาย สายลุย" 
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-500 transition"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">เบอร์ติดต่อผู้ขาย *</label>
                  <input 
                    type="tel" 
                    value={sellerPhone} 
                    onChange={(e) => setSellerPhone(e.target.value)} 
                    placeholder="เช่น 089-123-4567" 
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-500 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">2. ชื่อผู้ซื้อ *</label>
                <input 
                  type="text" 
                  value={buyerName} 
                  onChange={(e) => setBuyerName(e.target.value)} 
                  placeholder="เช่น คุณวรัญญู รัตนโชติ" 
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-500 transition"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">3. ประเภทไอดี *</label>
                <div className="grid grid-cols-2 gap-2">
                  <label className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer border transition ${
                    idType === 'thai' ? 'bg-amber-500/10 border-amber-500/50 text-amber-300' : 'bg-slate-800/80 border-slate-700 text-slate-300'
                  }`}>
                    <input 
                      type="radio" 
                      name="reactIdType" 
                      value="thai" 
                      checked={idType === 'thai'} 
                      onChange={() => setIdType('thai')} 
                      className="text-amber-500 focus:ring-amber-500 shrink-0"
                    />
                    <span className="font-semibold text-xs">🇹🇭 ไอดีไทย</span>
                  </label>
                  <label className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer border transition ${
                    idType === 'foreign' ? 'bg-amber-500/10 border-amber-500/50 text-amber-300' : 'bg-slate-800/80 border-slate-700 text-slate-300'
                  }`}>
                    <input 
                      type="radio" 
                      name="reactIdType" 
                      value="foreign" 
                      checked={idType === 'foreign'} 
                      onChange={() => setIdType('foreign')} 
                      className="text-amber-500 focus:ring-amber-500 shrink-0"
                    />
                    <span className="font-semibold text-xs">🌐 ไอดีนอก</span>
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div>
                  <label className="block text-slate-400 mb-1">4. ราคาไอดี (บาท) *</label>
                  <input 
                    type="text" 
                    value={tradePrice} 
                    onChange={(e) => setTradePrice(e.target.value)} 
                    placeholder="เช่น 4,500" 
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-amber-400 font-bold focus:outline-none focus:border-amber-500 transition"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">เลขที่บัญชีรับเงิน *</label>
                  <input 
                    type="text" 
                    value={bankAccount} 
                    onChange={(e) => setBankAccount(e.target.value)} 
                    placeholder="เช่น 123-4-56789-0" 
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-500 transition font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">ธนาคาร *</label>
                  <input 
                    type="text" 
                    value={bankName} 
                    onChange={(e) => setBankName(e.target.value)} 
                    placeholder="เช่น กสิกรไทย / พร้อมเพย์" 
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-500 transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-400 mb-1">5. USERNAME (ไอดีเข้าเกม) *</label>
                  <input 
                    type="text" 
                    value={username} 
                    onChange={(e) => setUsername(e.target.value)} 
                    placeholder="เช่น steam_pubg_god99" 
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-500 transition font-mono font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">รหัส 2 ชั้นในเกม (ถ้ามี)</label>
                  <input 
                    type="text" 
                    value={twoFactorCode} 
                    onChange={(e) => setTwoFactorCode(e.target.value)} 
                    placeholder="ระบุหากมีรหัสสำรอง / 2FA" 
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-500 transition font-mono"
                  />
                </div>
              </div>

              <div className="p-2.5 bg-amber-500/10 border border-amber-500/30 rounded-lg flex items-center justify-between text-xs">
                <span className="text-slate-300 font-medium">ค่าเสียหายกรณีไม่ชำระใน 3 วัน (10 เท่า):</span>
                <span className="text-amber-400 font-extrabold font-mono">{tenTimesPenaltyDisplay}</span>
              </div>
            </div>

            {/* SECTION 3: แนบรูปบัตรประชาชน */}
            <div className="space-y-3 bg-slate-950/60 p-3 sm:p-3.5 rounded-xl border border-slate-800">
              <div className="flex items-center justify-between">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                  <span>🪪</span>
                  <span>3. สำเนาบัตรประชาชนผู้ขาย (ตัวจริง)</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer text-[11px] text-amber-400 font-medium select-none">
                  <input 
                    type="checkbox" 
                    checked={isWatermarkOn} 
                    onChange={(e) => setIsWatermarkOn(e.target.checked)} 
                    className="rounded bg-slate-800 border-slate-700 text-amber-500"
                  />
                  <span>ปั๊มลายน้ำป้องกันรูป</span>
                </label>
              </div>

              <div>
                <input 
                  type="file" 
                  id="reactIdCardInput" 
                  accept="image/*" 
                  onChange={handleIdUpload} 
                  className="hidden" 
                />
                <button 
                  type="button" 
                  onClick={() => document.getElementById('reactIdCardInput')?.click()} 
                  className="w-full py-2.5 px-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-amber-400 text-xs font-semibold flex items-center justify-center gap-2 transition active:scale-95 shadow-sm"
                >
                  <span>📷</span>
                  <span>{idCardFileName ? `เลือกรูป: ${idCardFileName.substring(0, 20)}...` : 'แตะเพื่อแนบรูปบัตร (ถ่ายรูป / เลือกจากคลังภาพ)'}</span>
                </button>
              </div>
            </div>

            {/* SECTION 4: แอดมินคนกลาง & ตราประทับ */}
            <div className="space-y-2.5 bg-slate-950/60 p-3 sm:p-3.5 rounded-xl border border-slate-800">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <span>⭐</span>
                <span>4. แอดมินคนกลาง & ตราประทับ</span>
              </label>
              <div>
                <label className="block text-slate-400 mb-1">ชื่อแอดมินคนกลางใต้สัญญา</label>
                <input 
                  type="text" 
                  value={middleAdminName} 
                  onChange={(e) => setMiddleAdminName(e.target.value)} 
                  placeholder="เช่น กิตติศักดิ์ ตันโพธิ์ธรรม (แอดซัน)" 
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-500 transition"
                />
              </div>
              <label className="flex items-center gap-1.5 cursor-pointer text-xs text-slate-300">
                <input 
                  type="checkbox" 
                  checked={isStampOn} 
                  onChange={(e) => setIsStampOn(e.target.checked)} 
                  className="rounded bg-slate-800 border-slate-700 text-amber-500"
                />
                <span>แสดงตราประทับรับรองกลาง (Verified Admin Seal)</span>
              </label>
            </div>

            {/* SECTION 5: ลายเซ็นดิจิทัล */}
            <div className="space-y-3 bg-slate-950/60 p-3 sm:p-3.5 rounded-xl border border-slate-800">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <span>✍️</span>
                <span>5. เซ็นชื่อผู้ขาย / ผู้รับประกัน</span>
              </label>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-slate-400">ใช้นิ้วมือหรือเมาส์เซ็นลายมือชื่อผู้ขาย</label>
                  <button 
                    type="button" 
                    onClick={() => { setSellerStrokes([]); showToast('ล้างลายเซ็นผู้ขายเรียบร้อย'); }} 
                    className="text-[11px] text-red-400 hover:text-red-300 flex items-center gap-1 active:scale-95"
                  >
                    <span>🗑️ ล้างลายเซ็น</span>
                  </button>
                </div>
                <div className="border-2 border-slate-700 rounded-xl bg-white overflow-hidden shadow-inner relative">
                  <canvas 
                    ref={sellerSigCanvasRef} 
                    onMouseDown={handleSellerStart} 
                    onMouseMove={handleSellerMove} 
                    onMouseUp={handleSellerEnd} 
                    onTouchStart={handleSellerStart} 
                    onTouchMove={handleSellerMove} 
                    onTouchEnd={handleSellerEnd} 
                    className="w-full h-24 block cursor-crosshair touch-none bg-white"
                  />
                  {sellerStrokes.length === 0 && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-slate-400 text-xs font-medium">
                      เซ็นลายมือชื่อผู้ขายที่นี่
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800">
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-slate-400">ลายมือชื่อผู้ซื้อ (ถ้ามี หรือเว้นว่างให้ผู้ซื้อเซ็น)</label>
                  <button 
                    type="button" 
                    onClick={() => { setBuyerStrokes([]); showToast('ล้างลายเซ็นผู้ซื้อเรียบร้อย'); }} 
                    className="text-[11px] text-red-400 hover:text-red-300 flex items-center gap-1 active:scale-95"
                  >
                    <span>🗑️ ล้างลายเซ็น</span>
                  </button>
                </div>
                <div className="border-2 border-slate-700 rounded-xl bg-white overflow-hidden shadow-inner relative">
                  <canvas 
                    ref={buyerSigCanvasRef} 
                    onMouseDown={handleBuyerStart} 
                    onMouseMove={handleBuyerMove} 
                    onMouseUp={handleBuyerEnd} 
                    onTouchStart={handleBuyerStart} 
                    onTouchMove={handleBuyerMove} 
                    onTouchEnd={handleBuyerEnd} 
                    className="w-full h-24 block cursor-crosshair touch-none bg-white"
                  />
                  {buyerStrokes.length === 0 && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-slate-400 text-xs font-medium">
                      เซ็นลายมือชื่อผู้ซื้อที่นี่ (ไม่บังคับ)
                    </div>
                  )}
                </div>
              </div>
            </div>

          </form>
        </div>

        {/* RIGHT PANEL: Live Pure Canvas Preview & Actions */}
        <div className={`lg:col-span-7 flex flex-col gap-4 ${
          mobileTab === 'form' ? 'hidden lg:flex' : 'flex'
        }`}>
          
          {/* Top Canvas Controls Toolbar */}
          <div className="bg-slate-900/90 border border-slate-800 p-3 sm:p-3.5 rounded-2xl flex flex-wrap items-center justify-between gap-2.5 sm:gap-3 shadow-xl">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/30 rounded-lg text-xs font-semibold">
                <span>🖥️</span>
                <span>Live A4 Document</span>
              </span>
              <span className="text-xs font-mono text-slate-400">{contractRefText}</span>
            </div>

            <div className="flex items-center flex-wrap gap-2 w-full sm:w-auto justify-end">
              <button 
                onClick={handleCopyImage} 
                className="flex-1 sm:flex-initial px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition border border-slate-700 active:scale-95"
              >
                <span>📋</span>
                <span>คัดลอกรูป</span>
              </button>
              <button 
                onClick={handleDownloadPNG} 
                className="flex-1 sm:flex-initial px-3.5 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black flex items-center justify-center gap-1.5 transition shadow-md active:scale-95"
              >
                <span>💾</span>
                <span>บันทึกภาพ A4 (PNG)</span>
              </button>
              <button 
                onClick={handleDownloadPDF} 
                className="flex-1 sm:flex-initial px-3.5 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition shadow-md active:scale-95"
              >
                <span>📄</span>
                <span>ดาวน์โหลด PDF</span>
              </button>
              <button 
                onClick={handlePrint} 
                className="hidden sm:flex px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium items-center justify-center gap-1.5 transition border border-slate-700 active:scale-95"
              >
                <span>🖨️</span>
                <span>พิมพ์</span>
              </button>
            </div>
          </div>

          {/* Canvas Display Viewport */}
          <div className="rounded-2xl border-2 border-slate-800 p-2 sm:p-5 flex justify-center items-center overflow-auto shadow-2xl min-h-[480px] sm:min-h-[580px] bg-[#0f172a]">
            <canvas 
              ref={docCanvasRef} 
              className="w-full max-w-[640px] h-auto shadow-[0_20px_50px_rgba(0,0,0,0.8)] rounded-lg bg-white block border border-slate-300"
            />
          </div>

          {/* Live Notification / Quick Tips Box */}
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl text-xs text-slate-400 flex items-start gap-3">
            <span className="text-amber-400 text-lg flex-shrink-0 mt-0.5">🛡️</span>
            <div className="space-y-1">
              <p className="text-slate-200 font-semibold">ใบรับประกันมาตรฐานถูกต้อง 100% ตามแบบฟอร์มการซื้อขายไอดี PUBG PC</p>
              <p>
                อิงตามแบบฟอร์มทางการ มีรายละเอียดครบ 6 ข้อ, ช่องแนบรูปบัตรประชาชนพร้อมระบบปั๊มลายน้ำ, เงื่อนไขความรับผิดชอบ 4 ข้อ (ปรับ 10 เท่าหากไม่ชำระใน 3 วัน), ช่องลงชื่อ 2 ฝ่าย และข้อความรับรองกลางโดย แอดมิน {middleAdminName}
              </p>
            </div>
          </div>

        </div>

      </div>

      {/* Mobile Sticky Action Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-md border-t border-slate-800 p-2.5 px-3 flex items-center justify-between gap-2 shadow-[0_-10px_25px_rgba(0,0,0,0.8)]">
        <button 
          onClick={() => setMobileTab(mobileTab === 'form' ? 'preview' : 'form')} 
          className="flex-1 py-2.5 px-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition border border-slate-700 active:scale-95"
        >
          <span>{mobileTab === 'form' ? '👁️ ดูตัวอย่าง A4' : '📝 กลับไปแก้ไข'}</span>
        </button>
        <button 
          onClick={handleDownloadPNG} 
          className="flex-1 py-2.5 px-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black flex items-center justify-center gap-1.5 transition shadow-lg active:scale-95"
        >
          <span>💾 บันทึกรูป PNG</span>
        </button>
        <button 
          onClick={handleDownloadPDF} 
          className="py-2.5 px-3 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition shadow-lg active:scale-95"
        >
          <span>PDF</span>
        </button>
      </div>

      {/* Mobile Image Save Modal */}
      {mobileModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-4 sm:p-5 flex flex-col max-h-[92vh] shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                <span>✓</span>
                <span>สร้างภาพสัญญา A4 สำเร็จแล้ว</span>
              </div>
              <button onClick={() => setMobileModalOpen(false)} className="text-slate-400 hover:text-white p-1 rounded-lg">
                ✕
              </button>
            </div>

            <div className="my-3 p-2.5 bg-amber-500/10 border border-amber-500/30 rounded-xl text-xs text-amber-300 flex items-start gap-2">
              <span>📱</span>
              <div>
                <span className="font-bold">วิธีเซฟรูปลงมือถือ:</span> แตะค้างที่รูปภาพด้านล่าง แล้วเลือก <b>"บันทึกรูปภาพ"</b> (Save Image)
              </div>
            </div>

            <div className="flex-1 overflow-auto rounded-xl border border-slate-800 bg-slate-950 flex justify-center p-2 mb-3 min-h-[220px]">
              <img src={mobileModalImgUrl} alt="สัญญา A4" className="max-w-full h-auto rounded shadow-lg object-contain" />
            </div>

            <button 
              onClick={() => setMobileModalOpen(false)} 
              className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium flex items-center justify-center transition border border-slate-700 active:scale-95"
            >
              ปิดหน้าต่าง
            </button>
          </div>
        </div>
      )}

      {/* Custom Toast Notification */}
      <div 
        className={`fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-50 bg-slate-900 border text-white px-4 py-3 rounded-xl shadow-2xl transition-all transform flex items-center gap-3 ${
          toast.show ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0 pointer-events-none'
        } ${toast.isError ? 'border-red-500/50' : 'border-amber-500/50'}`}
      >
        <span className={toast.isError ? 'text-red-400' : 'text-emerald-400'}>
          {toast.isError ? '⚠️' : '✓'}
        </span>
        <div className="text-xs sm:text-sm font-medium">{toast.msg}</div>
      </div>

    </div>
  );
}
