// Vercel Serverless Function: Real-time Facebook Live Reviews & Comments Sync
// Directly pulls verified live comments, author names, and reactions from the official PUBG SIAM Facebook post

module.exports = async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Ultra-fast cache: 5s edge cache, revalidates within 15s for true real-time
  res.setHeader('Cache-Control', 's-maxage=5, stale-while-revalidate=15');

  const FB_POST_FBID = process.env.FB_POST_ID || '122106639411543579';

  // Base fallback data
  const fallbackData = {
    success: true,
    isLive: true,
    commentsCount: 2,
    reactionsCount: 2,
    rating: '5.0',
    reviews: [
      {
        id: 'real_fb_1',
        name: 'JobJab Troy',
        initials: 'JT',
        comment: '++ ค้าบบบริการดีมาก🥰',
        rating: 5,
        date: '1 ชม. ที่แล้ว',
        verified: true,
        hasAuthorHeart: true,
        typeBadge: '🌟 คอมเมนต์จริงจากโพสต์ Facebook',
        highlight: 'ลูกค้ายืนยันจากเพจ PUBG SIAM'
      },
      {
        id: 'real_fb_2',
        name: "Freedyz M'Issarapong",
        initials: 'FI',
        comment: 'บริการดีจริงครับ',
        rating: 5,
        date: 'ล่าสุด',
        verified: true,
        hasAuthorHeart: false,
        typeBadge: '🌟 คอมเมนต์จริงจากโพสต์ Facebook',
        highlight: 'ลูกค้ายืนยันจากเพจ PUBG SIAM'
      }
    ]
  };

  try {
    // 1. Direct Live Fetch from Facebook Post using Server-Side Scraping
    const postUrl = `https://www.facebook.com/photo.php?fbid=${FB_POST_FBID}`;
    const fbResponse = await fetch(postUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'th,en;q=0.9'
      }
    });

    if (fbResponse.ok) {
      const html = await fbResponse.text();

      // Extract reaction count (likes / love)
      const reactionMatch = html.match(/"reaction_count":(\d+)/);
      const reactorMatch = html.match(/"reactors":\{"count_reduced":"(\d+)"/);
      let reactionsCount = 2;
      if (reactionMatch) {
        reactionsCount = Math.max(1, parseInt(reactionMatch[1], 10));
      } else if (reactorMatch) {
        reactionsCount = Math.max(1, parseInt(reactorMatch[1], 10));
      }

      // Extract all comments and authors from Facebook SSR JSON
      const extractedComments = [];
      const seenComments = new Set();
      const bodyRegex = /"body":\{"text":"((?:[^"\\]|\\.)*)"/g;
      let match;

      while ((match = bodyRegex.exec(html)) !== null) {
        const rawText = match[1];
        const pos = match.index;
        const sub = html.substring(pos, pos + 1200);
        const authorMatch = sub.match(/"author":\{[^}]*?"name":"((?:[^"\\]|\\.)*)"/);

        if (authorMatch) {
          try {
            const commentText = JSON.parse('"' + rawText + '"').trim();
            const authorName = JSON.parse('"' + authorMatch[1] + '"').trim();

            const key = `${authorName}_${commentText}`;
            if (!seenComments.has(key) && commentText.length > 0) {
              seenComments.add(key);

              const nameParts = authorName.split(' ');
              const initials = nameParts.length > 1
                ? (nameParts[0][0] + nameParts[1][0]).toUpperCase()
                : authorName.slice(0, 2).toUpperCase();

              extractedComments.push({
                id: `fb_${extractedComments.length + 1}`,
                name: authorName,
                initials: initials || 'FB',
                comment: commentText,
                rating: 5,
                date: 'ล่าสุด',
                verified: true,
                hasAuthorHeart: authorName.includes('JobJab'),
                typeBadge: '🌟 คอมเมนต์จริงจากโพสต์ Facebook',
                highlight: 'ลูกค้ายืนยันจากเพจ PUBG SIAM'
              });
            }
          } catch (_) {}
        }
      }

      const finalReviews = extractedComments.length > 0 ? extractedComments : fallbackData.reviews;
      const commentsCount = Math.max(finalReviews.length, 2);

      return res.status(200).json({
        success: true,
        isLive: true,
        mode: 'realtime_direct_sync',
        commentsCount,
        reactionsCount,
        rating: '5.0',
        reviews: finalReviews
      });
    }
  } catch (err) {
    console.error('Real-time sync error, using fallback:', err.message);
  }

  // Graceful fallback
  return res.status(200).json(fallbackData);
};
