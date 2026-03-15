/**
 * Telegram API helper functions
 */

export async function checkChannelSubscription(token, userId, channelId) {
  const url = `https://api.telegram.org/bot${token}/getChatMember?chat_id=${channelId}&user_id=${userId}`;
  
  try {
    const response = await fetch(url);
    const data = await response.json();
    
    if (!data.ok) {
      return { subscribed: false, error: data.description };
    }
    
    const member = data.result;
    const subscribedStatuses = ['creator', 'administrator', 'member'];
    const isSubscribed = subscribedStatuses.includes(member.status);
    
    return { 
      subscribed: isSubscribed, 
      status: member.status,
      user: member.user
    };
  } catch (error) {
    return { subscribed: false, error: error.message };
  }
}

export function parseUserData(initData) {
  try {
    if (!initData) return null;
    
    const urlParams = new URLSearchParams(initData);
    const userParam = urlParams.get('user');
    
    if (!userParam) {
      return null;
    }
    
    return JSON.parse(userParam);
  } catch (error) {
    console.error('Failed to parse user data:', error);
    return null;
  }
}