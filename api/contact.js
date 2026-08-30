export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    const { name, phone, amount, content, message, agree, timestamp } = req.body;

    // Validation
    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: '이름이 필요합니다' });
    }

    if (!phone || !phone.trim()) {
      return res.status(400).json({ success: false, message: '연락처가 필요합니다' });
    }

    if (!agree) {
      return res.status(400).json({ success: false, message: '개인정보 동의가 필요합니다' });
    }

    // Get environment variables
    const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
      console.error('Missing Telegram environment variables');
      return res.status(500).json({
        success: false,
        message: '일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
      });
    }

    // Format message for Telegram
    const telegramMessage = formatTelegramMessage({
      name,
      phone,
      amount,
      content,
      message,
      timestamp,
    });

    // Send to Telegram
    const telegramResponse = await sendToTelegram(
      TELEGRAM_BOT_TOKEN,
      TELEGRAM_CHAT_ID,
      telegramMessage
    );

    if (!telegramResponse.ok) {
      console.error('Telegram API error:', telegramResponse);
      // Still consider it a success for the user, but log the error
    }

    // Log submission (optional - for your own records)
    console.log('[Consultation] New submission:', {
      name,
      phone,
      timestamp,
      telegramSent: telegramResponse.ok,
    });

    return res.status(200).json({
      success: true,
      message: '상담 신청이 접수되었습니다. 빠른 시간 내에 연락드리겠습니다.',
    });
  } catch (error) {
    console.error('Error processing consultation request:', error);
    return res.status(500).json({
      success: false,
      message: '일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
    });
  }
}

/**
 * Format consultation data into Telegram message
 */
function formatTelegramMessage(data) {
  const { name, phone, amount, content, message, timestamp } = data;

  // Parse amount display text
  const amountMap = {
    '5000': '5천만원 이하',
    '5000_10000': '5천만원 ~ 1억',
    '10000_30000': '1억 ~ 3억',
    '30000_50000': '3억 ~ 5억',
    '50000': '5억 이상',
  };

  // Parse content display text
  const contentMap = {
    'land': '토지 투자',
    'development': '개발 프로젝트',
    'consultation': '투자 상담',
    'etc': '기타',
  };

  const amountText = amountMap[amount] || '미입력';
  const contentText = contentMap[content] || '미입력';

  // Format timestamp
  const date = new Date(timestamp);
  const formattedTime = date.toLocaleString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });

  // Build message
  const msg = `🔔 새로운 상담 신청

━━━━━━━━━━━━━━━━━━

👤 이름
${name}

📱 연락처
${phone}

💰 투자 가능 금액
${amountText}

📋 상담 희망 내용
${contentText}

📝 기타 문의
${message || '없음'}

🕐 접수시간
${formattedTime}

━━━━━━━━━━━━━━━━━━`;

  return msg;
}

/**
 * Send message to Telegram
 */
async function sendToTelegram(botToken, chatId, message) {
  const url = `https://api.telegram.org/bot${botToken}/sendMessage`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'HTML',
      }),
    });

    return response;
  } catch (error) {
    console.error('Telegram API call failed:', error);
    return { ok: false, error };
  }
}
