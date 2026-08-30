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

    // Validate environment variables
    if (!TELEGRAM_BOT_TOKEN) {
      console.error('[Telegram] ERROR: TELEGRAM_BOT_TOKEN is not defined in environment variables');
      return res.status(500).json({
        success: false,
        message: '일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
      });
    }

    if (!TELEGRAM_CHAT_ID) {
      console.error('[Telegram] ERROR: TELEGRAM_CHAT_ID is not defined in environment variables');
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

    console.log('[Telegram] Sending message to Telegram API...');

    // Send to Telegram
    const telegramResult = await sendToTelegram(
      TELEGRAM_BOT_TOKEN,
      TELEGRAM_CHAT_ID,
      telegramMessage
    );

    if (telegramResult.success) {
      console.log('[Telegram] SUCCESS: Message sent to Telegram');
    } else {
      console.error('[Telegram] FAILED:', telegramResult.error);
    }

    // Log submission
    console.log('[Consultation] New submission received:', {
      name: name.substring(0, 2) + '*'.repeat(Math.max(0, name.length - 2)),
      phone: phone.replace(/\d(?=\d{4})/g, '*'),
      timestamp,
      telegramSent: telegramResult.success,
    });

    return res.status(200).json({
      success: true,
      message: '상담 신청이 접수되었습니다. 빠른 시간 내에 연락드리겠습니다.',
    });
  } catch (error) {
    console.error('[Consultation] ERROR processing request:', error.message);
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
  const { name, phone, timestamp } = data;

  // Format timestamp to Korean date format
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const period = date.getHours() < 12 ? '오전' : '오후';
  const displayHours = date.getHours() % 12 || 12;

  const formattedTime = `${year}. ${month}. ${day}. ${period} ${displayHours}:${minutes}`;

  const msg = `🔔 새로운 상담 신청

━━━━━━━━━━━━━━━━━━

👤 이름
${name}

📱 연락처
${phone}

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

    // Check HTTP status
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[Telegram] HTTP Error ${response.status}:`, errorText);
      return {
        success: false,
        error: `HTTP ${response.status}: ${errorText}`,
      };
    }

    // Parse JSON response
    const data = await response.json();

    // Check Telegram API response
    if (!data.ok) {
      console.error('[Telegram] API Error:', {
        error_code: data.error_code,
        description: data.description,
      });
      return {
        success: false,
        error: `Telegram API error: ${data.description || 'Unknown error'}`,
      };
    }

    // Success
    console.log('[Telegram] Message sent successfully. Message ID:', data.result.message_id);
    return {
      success: true,
      messageId: data.result.message_id,
    };
  } catch (error) {
    console.error('[Telegram] Fetch error:', error.message);
    return {
      success: false,
      error: `Network error: ${error.message}`,
    };
  }
}
