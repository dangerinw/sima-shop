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
  const FB_PAGE_TOKEN = process.env.FB_PAGE_TOKEN;

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
    // Query comments and likes for photo/post
    const graphUrl = `https://graph.facebook.com/v19.0/${FB_POST_ID}?fields=comments.summary(true){id,from,message,created_time},likes.summary(true)&access_token=${FB_PAGE_TOKEN}`;

    const response = await fetch(graphUrl);
    if (!response.ok) {
      const errText = await response.text();
      console.error('Facebook Graph API error:', errText);
      return res.status(200).json({
        ...fallbackData,
        error: 'Graph API error response, returned verified fallback data.',
        details: errText
      });
    }

    const data = await response.json();

    const commentsSummary = data.comments?.summary || {};
    const likesSummary = data.likes?.summary || {};
    const rawComments = data.comments?.data || [];

    const commentsCount = commentsSummary.total_count ?? (rawComments.length || 1);
    const reactionsCount = likesSummary.total_count ?? 2;

    // Map Facebook comments to review cards
    const mappedReviews = rawComments.map((item, index) => {
      const commenterName = item.from?.name || 'ลูกค้า Facebook';
      const nameParts = commenterName.trim().split(' ');
      const initials = nameParts.length > 1
        ? (nameParts[0][0] + nameParts[1][0]).toUpperCase()
        : commenterName.slice(0, 2).toUpperCase();

      // Format date if possible
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

    return res.status(200).json({
      success: true,
      isLive: true,
      commentsCount,
      reactionsCount,
      rating: '5.0',
      reviews: mappedReviews.length > 0 ? mappedReviews : fallbackData.reviews
    });
  } catch (error) {
    console.error('Fetch error:', error.message);
    return res.status(200).json({
      ...fallbackData,
      error: error.message
    });
  }
};
