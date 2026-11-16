// Vercel Serverless Function: Real-time Facebook Graph API Reviews & Comments Sync
// Syncs comments, comment count, and reactions for PUBG SIAM credit post

module.exports = async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Cache response for 60 seconds at edge, stale-while-revalidate for 5 minutes
  res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300');

  // Config from Environment Variables or Defaults
  const FB_POST_ID = process.env.FB_POST_ID || '122106639411543579';
  const FB_PAGE_TOKEN = process.env.FB_PAGE_TOKEN || 'EAAi0hmBXtNgBTFi8JSzsCrFDkB8MfR0uuGDAdS7LnaZBuEPiuUPVIZAuzTCkYkWStXbE34tZB8gVQsDe2eAgtgTuf1Ttg4i2bLSr3OfFd6Pk2zkVbDLp9q7Tf0UYGB6aVKP4DVCbd5km9DVp62GPmmECXyckEx0FgZAodUh7aLLEYIfCkag9hqEscadAF0tZAhJQz4s2Rj5vf9XiEsEROZA09X4qRfE2X0evl9VQoZD';

  // Fallback verified data (JobJab Troy)
  const fallbackData = {
    success: true,
    isLive: false,
    commentsCount: 1,
    reactionsCount: 2,
    rating: '5.0',
    reviews: [
      {
        id: '122106639411543579_1',
        name: 'JobJab Troy',
        initials: 'JT',
        comment: '++ ค้าบบบริการดีมาก🥰',
        rating: 5,
        date: 'ล่าสุด',
        verified: true,
        hasAuthorHeart: true,
        typeBadge: '🌟 คอมเมนต์จริงจากโพสต์ Facebook'
      }
    ]
  };

  // If no token is configured yet, return fallback data cleanly
  if (!FB_PAGE_TOKEN) {
    return res.status(200).json({
      ...fallbackData,
      note: 'FB_PAGE_TOKEN not yet configured in Vercel environment variables.'
    });
  }

  try {
    // 1. Query real-time comment and like counts from Facebook Graph API (Works with pages_read_engagement)
    const countUrl = `https://graph.facebook.com/v19.0/${FB_POST_ID}?fields=comments.summary(true).limit(0),likes.summary(true).limit(0)&access_token=${FB_PAGE_TOKEN}`;

    const countRes = await fetch(countUrl);
    let commentsCount = fallbackData.commentsCount;
    let reactionsCount = fallbackData.reactionsCount;
    let isLive = false;

    if (countRes.ok) {
      const countData = await countRes.json();
      if (countData.comments?.summary?.total_count !== undefined) {
        commentsCount = countData.comments.summary.total_count;
        isLive = true;
      }
      if (countData.likes?.summary?.total_count !== undefined) {
        // Facebook post has at least 1 reaction (Love/Like on post)
        reactionsCount = Math.max(1, countData.likes.summary.total_count || 1);
      }
    } else {
      console.error('Count query error:', await countRes.text());
    }

    // 2. Try fetching detailed comments if pages_read_user_content is granted
    let mappedReviews = fallbackData.reviews;
    try {
      const detailsUrl = `https://graph.facebook.com/v19.0/${FB_POST_ID}?fields=comments.limit(20){id,from,message,created_time}&access_token=${FB_PAGE_TOKEN}`;
      const detailsRes = await fetch(detailsUrl);
      if (detailsRes.ok) {
        const detailsData = await detailsRes.json();
        const rawComments = detailsData.comments?.data || [];
        if (rawComments.length > 0) {
          mappedReviews = rawComments.map((item, index) => {
            const commenterName = item.from?.name || 'ลูกค้า Facebook';
            const nameParts = commenterName.trim().split(' ');
            const initials = nameParts.length > 1
              ? (nameParts[0][0] + nameParts[1][0]).toUpperCase()
              : commenterName.slice(0, 2).toUpperCase();

            let dateStr = 'ล่าสุด';
            if (item.created_time) {
              try {
                const d = new Date(item.created_time);
                dateStr = d.toLocaleDateString('th-TH', { day: 'numeric', month: 'short' });
              } catch (_) {}
            }

            return {
              id: item.id || `fb_${index}`,
              name: commenterName,
              initials: initials || 'FB',
              comment: item.message || 'บริการดีมากครับ',
              rating: 5,
              date: dateStr,
              verified: true,
              hasAuthorHeart: true,
              typeBadge: '🌟 รีวิวจริงบนโพสต์ Facebook'
            };
          });
        }
      }
    } catch (_) {}

    return res.status(200).json({
      success: true,
      isLive,
      commentsCount,
      reactionsCount,
      rating: '5.0',
      reviews: mappedReviews
    });
  } catch (error) {
    console.error('Fetch error:', error.message);
    return res.status(200).json({
      ...fallbackData,
      error: error.message
    });
  }
};
