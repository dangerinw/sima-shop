// Vercel Serverless Edge Function: Live China PUBG Account Details & Screenshots
module.exports = async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const { id, bianhao } = req.query;
    let targetId = id;
    let targetBianhao = bianhao;

    if (!targetId && !targetBianhao) {
      return res.status(400).json({ success: false, message: 'Missing id or bianhao parameter' });
    }

    const headers = {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json',
      'Origin': 'https://xuegaokk.ayxds.com',
      'Referer': 'https://xuegaokk.ayxds.com/',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36'
    };

    // Clean bianhao if prefixed with CN-
    if (targetBianhao) {
      targetBianhao = targetBianhao.replace(/^CN-/, '').trim();
    }

    // 1. If targetId is not a 8-9 digit number, resolve it via bianhao keyword search
    if (!targetId || targetId.length < 7 || isNaN(Number(targetId))) {
      const searchKeyword = targetBianhao || targetId;
      const listRes = await fetch('https://fzht.xuxug.com/api/api/newShangpinList', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          page: 1,
          size: 5,
          datainfo: { zuidijia: '', zuigaojia: '', guanjianci: searchKeyword, biaoqian: [], paixu: '' }
        })
      });

      if (listRes.ok) {
        const listData = await listRes.json();
        const found = listData?.data?.data?.[0];
        if (found) {
          targetId = found.id;
          if (!targetBianhao) targetBianhao = found.bianhao;
        }
      }
    }

    if (!targetId) {
      return res.status(404).json({ success: false, message: 'Account not found in Chinese registry' });
    }

    // 2. Fetch full item details & in-game screenshots
    const detailRes = await fetch('https://fzht.xuxug.com/api/api/newGoodsDetails', {
      method: 'POST',
      headers,
      body: JSON.stringify({ id: Number(targetId) })
    });

    if (!detailRes.ok) {
      return res.status(502).json({ success: false, message: `Chinese API HTTP ${detailRes.status}` });
    }

    const detailData = await detailRes.json();
    if (detailData.code !== 'true' || !detailData.data) {
      return res.status(404).json({ success: false, message: detailData.message || 'Details not found' });
    }

    const data = detailData.data;
    const coverImg = data.img || '';

    // Extract all detail screenshots from xiangqing HTML
    const detailImages = [];
    const imgRegex = /src=["']([^"']+)["']/g;
    let match;
    while ((match = imgRegex.exec(data.xiangqing || '')) !== null) {
      if (match[1] && !detailImages.includes(match[1]) && match[1] !== coverImg) {
        detailImages.push(match[1]);
      }
    }

    return res.status(200).json({
      success: true,
      rawId: data.id,
      bianhao: data.bianhao,
      title: data.title,
      coverImg,
      detailImages,
      specs: {
        shengcundengji: data.shengcundengji || '四阶段',
        xinyongdengji: data.xinyongdengji || '信誉等级三',
        shifoupaiwei: data.shifoupaiwei || '1',
        shoujiaRmb: data.shoujia || 0
      }
    });

  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};
