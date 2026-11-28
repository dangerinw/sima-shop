// Vercel Serverless Edge Function: Multi-Source Live China PUBG Account Details & Screenshots
// Supports 4 Chinese platforms:
// Link 1: https://xf.ayxds.com/pc/ (Origin: https://xf.ayxds.com)
// Link 2: www.yyyxkch.com (Origin: https://www.yyyxkch.com)
// Link 3: https://xmgg.ayxds.com/pc/ (Origin: https://xmgg.ayxds.com)
// Link 4: https://xuegaokk.ayxds.com/pc/ (Origin: https://xuegaokk.ayxds.com)

function calculateTieredPrice(rmbPrice, cnyRateThb = 5.2, cnyRateVnd = 3700) {
  const rawRmb = Number(rmbPrice || 0);
  const rawThb = rawRmb * Number(cnyRateThb || 5.2);
  const rawVnd = rawRmb * Number(cnyRateVnd || 3700);

  let priceTHB = 0;
  let profitTHB = 0;
  let activeMarkupPercent = 0;

  if (rawThb < 500) {
    // ไอดีที่ต่ำกว่า 500 บาท บวกเพิ่ม 50 บาท
    profitTHB = 50;
    priceTHB = Math.round((rawThb + 50) / 10) * 10;
    activeMarkupPercent = rawThb > 0 ? Math.round((50 / rawThb) * 100) : 0;
  } else if (rawThb <= 1000) {
    // ไอดีที่ 500 - 1000 บาท บวกเพิ่ม 100 บาท
    profitTHB = 100;
    priceTHB = Math.round((rawThb + 100) / 10) * 10;
    activeMarkupPercent = rawThb > 0 ? Math.round((100 / rawThb) * 100) : 0;
  } else {
    // ไอดีที่มากกว่า 1000 บาท คิด 10%
    activeMarkupPercent = 10;
    profitTHB = Math.round(rawThb * 0.10);
    priceTHB = Math.round((rawThb * 1.10) / 10) * 10;
  }

  const multiplier = rawThb > 0 ? priceTHB / rawThb : 1.10;
  const priceVND = Math.round((rawVnd * multiplier) / 1000) * 1000;

  return {
    rawRmb,
    rawThb,
    priceTHB,
    priceVND,
    originalPriceTHB: Math.round(priceTHB * 1.15),
    originalPriceVND: Math.round(priceVND * 1.15),
    markupPercent: activeMarkupPercent,
    profitTHB
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

    // 1. Direct Numeric ID (Top Priority from account.rawId or URL query)
    let directNumericId = null;
    if (id && /^\d+$/.test(String(id).trim())) {
      directNumericId = String(id).trim();
    }

    const rawInput = String(url || bianhao || id || '').trim();
    if (!rawInput && !directNumericId) {
      return res.status(400).json({ success: false, message: 'กรุณากรอกลิงก์ หรือรหัสไอดีจีน (Missing id, bianhao, or url parameter)' });
    }

    // Extract ID from URL if full URL is passed
    const mId = rawInput.match(/[?&#]id=([0-9]+)/i);
    if (mId) {
      directNumericId = mId[1];
    } else if (!directNumericId && /^\d+$/.test(rawInput)) {
      directNumericId = rawInput;
    }

    // Extract Clean Code
    let cleanCode = String(bianhao || rawInput).trim();
    cleanCode = cleanCode.replace(/^CN-/i, '').trim();

    const mBianhao = rawInput.match(/[?&#]bianhao=([^&#]+)/i);
    if (mBianhao) {
      cleanCode = decodeURIComponent(mBianhao[1]).trim();
    }

    // Check code prefix for source hints
    let prefixSource = null;
    if (/^XMGG[-_]/i.test(cleanCode)) {
      prefixSource = 'xmgg';
      cleanCode = cleanCode.replace(/^XMGG[-_]/i, '').trim();
    } else if (/^XGKK[-_]/i.test(cleanCode)) {
      prefixSource = 'xgkk';
      cleanCode = cleanCode.replace(/^XGKK[-_]/i, '').trim();
    } else if (/^XF[-_]/i.test(cleanCode)) {
      prefixSource = 'xf';
      cleanCode = cleanCode.replace(/^XF[-_]/i, '').trim();
    } else if (/^DLMX[-_]/i.test(cleanCode)) {
      prefixSource = 'yyy';
    }

    // Detect Source Platform
    let detectedSource = source ? String(source).toLowerCase().trim() : null;
    if (detectedSource) {
      if (detectedSource.includes('xmgg') || detectedSource === 'link 3') detectedSource = 'xmgg';
      else if (detectedSource.includes('xgkk') || detectedSource.includes('xuegao') || detectedSource === 'link 4') detectedSource = 'xgkk';
      else if (detectedSource.includes('xf') || detectedSource === 'link 1') detectedSource = 'xf';
      else if (detectedSource.includes('yyy') || detectedSource === 'link 2') detectedSource = 'yyy';
    }

    if (!detectedSource && prefixSource) {
      detectedSource = prefixSource;
    }

    if (!detectedSource) {
      if (/xf\.ayxds\.com/i.test(rawInput)) {
        detectedSource = 'xf';
      } else if (/yyyxkch\.com/i.test(rawInput) || /^DLMX/i.test(cleanCode)) {
        detectedSource = 'yyy';
      } else if (/xmgg\.ayxds\.com/i.test(rawInput)) {
        detectedSource = 'xmgg';
      } else if (/xuegaokk\.ayxds\.com/i.test(rawInput)) {
        detectedSource = 'xgkk';
      }
    }

    // ================================================================
    // SOURCE 2: YYYXKCH (www.yyyxkch.com)
    // ================================================================
    if (detectedSource === 'yyy' || (!detectedSource && /^DLMX/i.test(cleanCode))) {
      try {
        let yyyItem = null;

        // If numeric ID and detected as yyy (e.g. from yyyxkch.com URL)
        if (directNumericId && (detectedSource === 'yyy' || Number(directNumericId) < 1000000)) {
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
    const ayxdsOrigins = {
      xmgg: { origin: 'https://xmgg.ayxds.com', code: 'XMGG', name: 'XMGG Shop (Link 3)', url: 'https://xmgg.ayxds.com/pc/' },
      xgkk: { origin: 'https://xuegaokk.ayxds.com', code: 'XGKK', name: 'XueGaoKK (Link 4)', url: 'https://xuegaokk.ayxds.com/pc/' },
      xf: { origin: 'https://xf.ayxds.com', code: 'XF', name: 'XF Shop (Link 1)', url: 'https://xf.ayxds.com/pc/' }
    };

    const candidateOrigins = [];
    if (detectedSource === 'xmgg') {
      candidateOrigins.push(ayxdsOrigins.xmgg, ayxdsOrigins.xgkk, ayxdsOrigins.xf);
    } else if (detectedSource === 'xgkk') {
      candidateOrigins.push(ayxdsOrigins.xgkk, ayxdsOrigins.xmgg, ayxdsOrigins.xf);
    } else if (detectedSource === 'xf') {
      candidateOrigins.push(ayxdsOrigins.xf, ayxdsOrigins.xmgg, ayxdsOrigins.xgkk);
    } else {
      candidateOrigins.push(ayxdsOrigins.xmgg, ayxdsOrigins.xgkk, ayxdsOrigins.xf);
    }

    for (const item of candidateOrigins) {
      try {
        let targetId = directNumericId ? Number(directNumericId) : null;

        // Try direct lookup with targetId first if available
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
            body: JSON.stringify({ id: targetId })
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

        // If no direct ID or direct ID not found on this origin, search newShangpinList with cleanCode
        if (cleanCode) {
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
            const list = listData?.data?.data || [];
            
            // STRICT MATCHING: Only accept item if its bianhao, id, or clean code matches!
            // Never blindly pick list[0] to prevent mismatching accounts!
            const matched = list.find(it => {
              if (!it) return false;
              if (String(it.id) === String(cleanCode)) return true;
              const itBianhao = String(it.bianhao || '').trim().toLowerCase();
              const target = String(cleanCode).trim().toLowerCase();
              if (itBianhao === target) return true;
              if (itBianhao.includes(target) || target.includes(itBianhao)) return true;
              return false;
            });

            if (matched && matched.id) {
              const detailRes = await fetch('https://fzht.xuxug.com/api/api/newGoodsDetails', {
                method: 'POST',
                headers: {
                  'Accept': 'application/json, text/plain, */*',
                  'Content-Type': 'application/json',
                  'Origin': item.origin,
                  'Referer': `${item.origin}/`,
                  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                },
                body: JSON.stringify({ id: Number(matched.id) })
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
