export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

export async function sendTransactionalEmail(options: EmailOptions): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM || 'GANIT ADDA <notifications@ganitadda.in>';

  if (!apiKey || apiKey.includes('placeholder')) {
    console.log(`[Dev Email Simulation] To: ${options.to} | Subject: ${options.subject}`);
    return true;
  }

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to: options.to,
        subject: options.subject,
        html: options.html,
      }),
    });

    return res.ok;
  } catch (err) {
    console.error('[Email Send Error]', err);
    return false;
  }
}

export function generateOrderConfirmationHtml(order: {
  orderNumber: string;
  customerName: string;
  totalPaise: number;
  items: Array<{ title: string; classLevel: string; pricePaise: number }>;
}): string {
  const itemsHtml = order.items
    .map(
      (item) => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #eadfce;">${item.title} (Class ${item.classLevel})</td>
      <td style="padding: 10px; border-bottom: 1px solid #eadfce; text-align: right;">₹${(item.pricePaise / 100).toFixed(0)}</td>
    </tr>
  `
    )
    .join('');

  return `
    <div style="font-family: 'DM Sans', Arial, sans-serif; max-width: 600px; margin: auto; padding: 24px; background: #fffdf8; border: 1px solid #eadfce; border-radius: 16px;">
      <div style="text-align: center; margin-bottom: 24px;">
        <h1 style="color: #651b32; margin: 0; font-family: Georgia, serif;">GANIT <span style="color: #c69a45;">ADDA</span></h1>
        <p style="color: #716875; margin: 4px 0;">Maths Made Simple, One Step at a Time.</p>
      </div>

      <div style="background: #fbf6ed; padding: 18px; border-radius: 12px; margin-bottom: 20px;">
        <h2 style="color: #651b32; margin-top: 0;">Payment Confirmed!</h2>
        <p>Dear <strong>${order.customerName}</strong>,</p>
        <p>Thank you for purchasing from Ganit Adda. Your order <strong>#${order.orderNumber}</strong> has been successfully processed. Your worksheets are now unlocked and ready for download in your dashboard.</p>
      </div>

      <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
        <thead>
          <tr style="background: #3e1022; color: #fff8ee;">
            <th style="padding: 10px; text-align: left;">Resource</th>
            <th style="padding: 10px; text-align: right;">Price</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHtml}
          <tr>
            <td style="padding: 12px; font-weight: bold; border-top: 2px solid #651b32;">Total Paid</td>
            <td style="padding: 12px; font-weight: bold; text-align: right; color: #651b32; font-size: 18px; border-top: 2px solid #651b32;">₹${(order.totalPaise / 100).toFixed(0)}</td>
          </tr>
        </tbody>
      </table>

      <div style="text-align: center; margin: 28px 0;">
        <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://ganit-adda.vercel.app'}/dashboard/downloads" style="background: #c69a45; color: #281b1f; padding: 14px 28px; text-decoration: none; border-radius: 999px; font-weight: bold; display: inline-block;">
          Go to My Downloads
        </a>
      </div>

      <hr style="border: none; border-top: 1px solid #eadfce; margin: 24px 0;" />
      <p style="font-size: 13px; color: #716875; text-align: center;">
        Need support? Call us at 9874169625 or email madeeasyganit@gmail.com.<br/>
        © ${new Date().getFullYear()} GANIT ADDA. All rights reserved.
      </p>
    </div>
  `;
}
