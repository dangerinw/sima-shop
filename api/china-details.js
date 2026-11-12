// Vercel Serverless Edge Function: Multi-Source Live China PUBG Account Details & Screenshots
// Supports 4 Chinese platforms:
// Link 1: https://xf.ayxds.com/pc/ (Origin: https://xf.ayxds.com)
// Link 2: www.yyyxkch.com (Origin: https://www.yyyxkch.com)
// Link 3: https://xmgg.ayxds.com/pc/ (Origin: https://xmgg.ayxds.com)
// Link 4: https://xuegaokk.ayxds.com/pc/ (Origin: https://xuegaokk.ayxds.com)

function calculateTieredPrice(rmbPrice, cnyRateThb = 5.2, cnyRateVnd = 3700) {
  const rawRmb = Number(rmbPrice || 0);
  const rawThb = rawRmb * cnyRateThb;
  const rawVnd = rawRmb * cnyRateVnd;

  let activeMarkupPercent = 10;
  if (rawThb >= 100000) {
    activeMarkupPercent = 13;
  }

  const multiplier = 1 + (activeMarkupPercent / 100);
  const priceTHB = Math.round((rawThb * multiplier) / 10) * 10;
  const priceVND = Math.round((rawVnd * multiplier) / 1000) * 1000;

  return {
    rawRmb,
    priceTHB,
    priceVND,
    originalPriceTHB: Math.round(priceTHB * 1.15),
    originalPriceVND: Math.round(priceVND * 1.15),
    markupPercent: activeMarkupPercent
  };
}

module.exports = async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const { id, bianhao, url, source } = req.query;
    const queryInput = String(url || bianhao || id || '').trim();

    if (!queryInput) {
      return res.status(400).json({ success: false, message: 'กรุณากรอกลิงก์ หรือรหัสไอดีจีน (Missing id, bianhao, or url parameter)' });
    }

    // Detect Source Platform from URL or code
    let detectedSource = source ? String(source).toLowerCase() : null;
    let cleanCode = queryInput.replace(/^CN-/, '').trim();
    let directNumericId = null;

    if (/xf\.ayxds\.com/i.test(queryInput) || /^XF/i.test(queryInput)) {
      detectedSource = 'xf';
    } else if (/yyyxkch\.com/i.test(queryInput)) {
      detectedSource = 'yyy';
    } else if (/xmgg\.ayxds\.com/i.test(queryInput)) {
      detectedSource = 'xmgg';
    } else if (/xuegaokk\.ayxds\.com/i.test(queryInput) || /^XGKK/i.test(queryInput)) {
      detectedSource = 'xgkk';
    }

    // Extract ID or Code from URL if full URL is passed
    const mId = queryInput.match(/[?&#]id=([0-9]+)/i);
    const mBianhao = queryInput.match(/[?&#]bianhao=([A-Za-z0-9_-]+)/i);

    if (mId) {
      directNumericId = mId[1];
      cleanCode = mId[1];
    } else if (mBianhao) {
      cleanCode = mBianhao[1];
    } else if (/^\d+$/.test(cleanCode)) {
      directNumericId = cleanCode;
    } else {
      const mCode = queryInput.match(/([A-Za-z0-9_-]{4,30})/);
      if (mCode && !queryInput.startsWith('http')) {
        cleanCode = mCode[1];
      }
    }

    // ================================================================
    // SOURCE 2: YYYXKCH (www.yyyxkch.com)
    // ================================================================
    if (detectedSource === 'yyy' || (!detectedSource && /^DLMX/i.test(cleanCode))) {
      try {
        let yyyItem = null;

        // If numeric ID and detected as yyy (e.g. from yyyxkch.com URL)
        if (directNumericId && (detectedSource === 'yyy' || Number(directNumericId) < 100000)) {
          const infoRes = await fetch('https://www.yyyxkch.com/api/goods_info', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
              'Referer': 'https://www.yyyxkch.com/'
            },
            body: JSON.stringify({ id: Number(directNumericId) })
          });
          if (infoRes.ok) {
            const infoData = await infoRes.json();
            if (infoData?.data && infoData.data.title) {
              yyyItem = infoData.data;
            }
          }
        }

        // If not found by direct ID, search goods_list by keyword (code)
        if (!yyyItem) {
          const listRes = await fetch('https://www.yyyxkch.com/api/goods_list', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
              'Referer': 'https://www.yyyxkch.com/'
            },
            body: JSON.stringify({ page: 1, limit: 10, cate_id: 5, keyword: cleanCode })
          });
          if (listRes.ok) {
            const listData = await listRes.json();
            const list = listData?.data?.list || [];
            const found = list.find(it => 
              (it.code && it.code.toLowerCase() === cleanCode.toLowerCase()) ||
              (it.title && it.title.toLowerCase().includes(cleanCode.toLowerCase())) ||
              (String(it.id) === String(cleanCode))
            );
            if (found) {
              const infoRes = await fetch('https://www.yyyxkch.com/api/goods_info', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                  'Referer': 'https://www.yyyxkch.com/'
                },
                body: JSON.stringify({ id: found.id })
              });
              if (infoRes.ok) {
                const infoData = await infoRes.json();
                yyyItem = infoData?.data || found;
              } else {
                yyyItem = found;
              }
            }
          }
        }

        if (yyyItem) {
          const priceInfo = calculateTieredPrice(yyyItem.price);
          return res.status(200).json({
            success: true,
            source: 'YYYXKCH',
            sourceName: 'YiYou PUBG',
            sourceUrl: 'https://www.yyyxkch.com/',
            rawId: yyyItem.id,
            bianhao: yyyItem.code || cleanCode,
            title: yyyItem.title,
            coverImg: yyyItem.logo || '',
            detailImages: Array.isArray(yyyItem.images) ? yyyItem.images : (yyyItem.images ? [yyyItem.images] : []),
            specs: {
              shengcundengji: yyyItem.new?.find(n => n.parent === '生存等级')?.son || '三阶段',
              xinyongdengji: '信誉良好',
              shifoupaiwei: '1',
              shoujiaRmb: yyyItem.price || 0
            },
            priceTHB: priceInfo.priceTHB,
            priceVND: priceInfo.priceVND,
            originalPriceTHB: priceInfo.originalPriceTHB,
            originalPriceVND: priceInfo.originalPriceVND,
            shoujiaRmb: yyyItem.price || 0
          });
        }
      } catch (err) {
        console.error('YYYXKCH lookup error:', err);
      }
    }

    // ================================================================
    // SOURCES 1, 3, 4: AYXDS Platform (XF, XMGG, XGKK)
    // ================================================================
    const candidateOrigins = [];
    if (detectedSource === 'xf') {
      candidateOrigins.push({ origin: 'https://xf.ayxds.com', code: 'XF', name: 'XF Shop', url: 'https://xf.ayxds.com/pc/' });
    } else if (detectedSource === 'xmgg') {
      candidateOrigins.push({ origin: 'https://xmgg.ayxds.com', code: 'XMGG', name: 'XMGG Shop', url: 'https://xmgg.ayxds.com/pc/' });
    } else if (detectedSource === 'xgkk') {
      candidateOrigins.push({ origin: 'https://xuegaokk.ayxds.com', code: 'XGKK', name: 'XueGaoKK', url: 'https://xuegaokk.ayxds.com/pc/' });
    } else {
      // Prioritize based on code prefix if recognizable
      if (/^XF/i.test(cleanCode)) {
        candidateOrigins.push({ origin: 'https://xf.ayxds.com', code: 'XF', name: 'XF Shop', url: 'https://xf.ayxds.com/pc/' });
      } else if (/^XGKK/i.test(cleanCode)) {
        candidateOrigins.push({ origin: 'https://xuegaokk.ayxds.com', code: 'XGKK', name: 'XueGaoKK', url: 'https://xuegaokk.ayxds.com/pc/' });
      } else if (/^DLMX/i.test(cleanCode)) {
        candidateOrigins.push({ origin: 'https://xmgg.ayxds.com', code: 'XMGG', name: 'XMGG Shop', url: 'https://xmgg.ayxds.com/pc/' });
      }
      
      // Fallback candidates
      [
        { origin: 'https://xf.ayxds.com', code: 'XF', name: 'XF Shop', url: 'https://xf.ayxds.com/pc/' },
        { origin: 'https://xmgg.ayxds.com', code: 'XMGG', name: 'XMGG Shop', url: 'https://xmgg.ayxds.com/pc/' },
        { origin: 'https://xuegaokk.ayxds.com', code: 'XGKK', name: 'XueGaoKK', url: 'https://xuegaokk.ayxds.com/pc/' }
      ].forEach(cand => {
        if (!candidateOrigins.some(c => c.origin === cand.origin)) {
          candidateOrigins.push(cand);
        }
      });
    }

    for (const item of candidateOrigins) {
      try {
        let targetId = directNumericId && Number(directNumericId) > 1000000 ? directNumericId : null;

        // Search in newShangpinList if not a direct numeric ID
        if (!targetId) {
          const listRes = await fetch('https://fzht.xuxug.com/api/api/newShangpinList', {
            method: 'POST',
            headers: {
              'Accept': 'application/json, text/plain, */*',
              'Content-Type': 'application/json',
              'Origin': item.origin,
              'Referer': `${item.origin}/`,
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            },
            body: JSON.stringify({
              page: 1,
              datainfo: { zuidijia: '', zuigaojia: '', guanjianci: cleanCode, biaoqian: [], paixu: '' }
            })
          });

          if (listRes.ok) {
            const listData = await listRes.json();
            const found = listData?.data?.data?.[0];
            if (found && found.id) {
              targetId = found.id;
            }
          }
        }

        if (targetId) {
          const detailRes = await fetch('https://fzht.xuxug.com/api/api/newGoodsDetails', {
            method: 'POST',
            headers: {
              'Accept': 'application/json, text/plain, */*',
              'Content-Type': 'application/json',
              'Origin': item.origin,
              'Referer': `${item.origin}/`,
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            },
            body: JSON.stringify({ id: Number(targetId) })
          });

          if (detailRes.ok) {
            const detailData = await detailRes.json();
            if (detailData.code === 'true' && detailData.data && detailData.data.title) {
              const data = detailData.data;
              const coverImg = data.img || '';
              const detailImages = [];
              const imgRegex = /src=["']([^"']+)["']/g;
              let match;
              while ((match = imgRegex.exec(data.xiangqing || '')) !== null) {
                if (match[1] && !detailImages.includes(match[1]) && match[1] !== coverImg) {
                  detailImages.push(match[1]);
                }
              }

              const priceInfo = calculateTieredPrice(data.shoujia || 0);

              return res.status(200).json({
                success: true,
                source: item.code,
                sourceName: `${item.name}`,
                sourceUrl: item.url,
                rawId: data.id,
                bianhao: data.bianhao || cleanCode,
                title: data.title,
                coverImg,
                detailImages,
                specs: {
                  shengcundengji: data.shengcundengji || 'สี่ขั้นตอน (Tier 4)',
                  xinyongdengji: data.xinyongdengji || 'ระดับ 3 (สมบูรณ์)',
                  shifoupaiwei: data.shifoupaiwei || '1',
                  shoujiaRmb: data.shoujia || 0
                },
                priceTHB: priceInfo.priceTHB,
                priceVND: priceInfo.priceVND,
                originalPriceTHB: priceInfo.originalPriceTHB,
                originalPriceVND: priceInfo.originalPriceVND,
                shoujiaRmb: data.shoujia || 0
              });
            }
          }
        }
      } catch (err) {
        console.error(`AYXDS [${item.code}] lookup error:`, err);
      }
    }

    return res.status(404).json({
      success: false,
      message: `ไม่พบข้อมูลไอดี "${cleanCode}" ในระบบคลังจีนทั้ง 4 แพลตฟอร์ม (XF, YYYXKCH, XMGG, XGKK) กรุณาตรวจสอบลิงก์หรือรหัสอีกครั้ง`
    });

  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};
