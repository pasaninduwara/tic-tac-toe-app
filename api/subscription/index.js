/**
 * Channel subscription verification endpoint
 */
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { checkChannelSubscription } = await import('../../lib/telegram.js');

  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'User ID required' });
    }

    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const channelUsername = process.env.CHANNEL_USERNAME;

    if (!botToken || !channelUsername) {
      return res.status(200).json({
        success: true,
        subscribed: true,
        message: 'Subscription check not configured'
      });
    }

    // Check subscription
    const result = await checkChannelSubscription(
      botToken,
      userId,
      `@${channelUsername}`
    );

    return res.status(200).json({
      success: true,
      subscribed: result.subscribed,
      status: result.status,
      channelUsername
    });

  } catch (error) {
    console.error('Subscription check error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}