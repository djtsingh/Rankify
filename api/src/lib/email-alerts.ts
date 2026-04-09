/**
 * Email Alerts Service
 * Sends alerts on scan completion, issues found, performance drops
 */

import nodemailer from 'nodemailer';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  projectName: string;
}

interface ScanAlertData {
  projectName: string;
  domain: string;
  score: number;
  previousScore?: number;
  issuesCount: number;
  criticalCount: number;
  url: string;
  timestamp: Date;
}

/**
 * Initialize email transporter
 * Supports SendGrid, Gmail, or custom SMTP
 */
function getEmailTransporter() {
  const provider = process.env.EMAIL_PROVIDER || 'sendgrid';

  if (provider === 'sendgrid') {
    return nodemailer.createTransport({
      host: 'smtp.sendgrid.net',
      port: 587,
      auth: {
        user: 'apikey',
        pass: process.env.SENDGRID_API_KEY || '',
      },
    });
  }

  // Fallback to generic SMTP
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

/**
 * Generate scan alert HTML email
 */
function generateScanAlertHTML(data: ScanAlertData): string {
  const scoreChange = data.previousScore ? data.score - data.previousScore : null;
  const changeIndicator = scoreChange ? (scoreChange > 0 ? '📈' : '📉') : '';

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #00e5d1 0%, #00d4bf 100%); color: #080b0f; padding: 30px; border-radius: 8px 8px 0 0; }
        .header h1 { margin: 0; font-size: 24px; }
        .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 8px 8px; }
        .score-box { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #00e5d1; }
        .score-value { font-size: 48px; font-weight: bold; color: #00e5d1; }
        .issues { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .issue-item { padding: 10px; border-left: 3px solid #ff6b6b; margin: 10px 0; }
        .footer { text-align: center; padding: 20px; color: #999; font-size: 12px; }
        .button { display: inline-block; padding: 12px 24px; background: #00e5d1; color: #080b0f; text-decoration: none; border-radius: 4px; font-weight: bold; margin: 10px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🔍 SEO Scan Complete</h1>
          <p style="margin: 10px 0 0 0;">Rankify - ${data.projectName}</p>
        </div>
        
        <div class="content">
          <p>Your website scan is complete. Here's what we found:</p>
          
          <div class="score-box">
            <div class="score-value">${data.score}/100 ${changeIndicator}</div>
            <div style="color: #999; margin-top: 10px;">
              ${data.previousScore ? `<span>Previous: ${data.previousScore}/100 (${scoreChange > 0 ? '+' : ''}${scoreChange})</span>` : ''}
            </div>
          </div>
          
          <div class="issues">
            <h3 style="margin: 0 0 15px 0;">Issues Found</h3>
            <p><strong>${data.issuesCount}</strong> total issues</p>
            <p style="color: #ff6b6b; font-weight: bold;">${data.criticalCount} critical</p>
            
            <div class="issue-item">
              <strong>Domain:</strong> ${data.domain}
            </div>
          </div>
          
          <p style="text-align: center; margin: 30px 0;">
            <a href="${data.url}" class="button">View Full Report</a>
          </p>
          
          <p style="color: #999; font-size: 12px;">
            Scan completed at: ${data.timestamp.toLocaleString()}
          </p>
        </div>
        
        <div class="footer">
          <p>Rankify - Enterprise SEO Analysis Platform</p>
          <p>© 2026. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

/**
 * Send scan alert email
 */
export async function sendScanAlertEmail(userEmail: string, data: ScanAlertData): Promise<boolean> {
  try {
    const transporter = getEmailTransporter();

    const mailOptions = {
      from: process.env.EMAIL_FROM || 'alerts@rankify.ai',
      to: userEmail,
      subject: `📊 SEO Scan Complete: ${data.projectName} - Score: ${data.score}/100`,
      html: generateScanAlertHTML(data),
    };

    const result = await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${userEmail}:`, result.messageId);
    return true;
  } catch (error) {
    console.error('Failed to send email:', error);
    return false;
  }
}

/**
 * Send performance drop alert
 */
export async function sendPerformanceDropAlert(userEmail: string, projectName: string, drop: number): Promise<boolean> {
  try {
    const transporter = getEmailTransporter();

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .alert { background: #ffe5e5; border-left: 4px solid #ff6b6b; padding: 20px; border-radius: 4px; }
          .alert h2 { color: #ff6b6b; margin: 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="alert">
            <h2>⚠️ Performance Drop Detected</h2>
            <p><strong>${projectName}</strong> has experienced a performance drop of ${drop} points.</p>
            <p>This may indicate issues with your site. Log in to Rankify to investigate.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const mailOptions = {
      from: process.env.EMAIL_FROM || 'alerts@rankify.ai',
      to: userEmail,
      subject: `⚠️ Performance Alert: ${projectName}`,
      html,
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Failed to send performance alert:', error);
    return false;
  }
}

/**
 * Send digest email (weekly summary)
 */
export async function sendWeeklyDigest(userEmail: string, projectName: string, stats: any): Promise<boolean> {
  try {
    const transporter = getEmailTransporter();

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #00e5d1; color: #080b0f; padding: 20px; border-radius: 4px; }
          .stat { display: inline-block; width: 48%; margin: 10px 1%; padding: 10px; background: #f0f0f0; text-align: center; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📊 Weekly Digest - ${projectName}</h1>
          </div>
          <p style="margin-top: 20px;">Here's your weekly SEO summary:</p>
          <div class="stat"><strong>Scans</strong><br/>${stats.scans || 0}</div>
          <div class="stat"><strong>Avg Score</strong><br/>${stats.avgScore || 0}/100</div>
          <div class="stat"><strong>Issues Found</strong><br/>${stats.issuesCount || 0}</div>
          <div class="stat"><strong>Improved</strong><br/>${stats.improved ? '✅' : '❌'}</div>
        </div>
      </body>
      </html>
    `;

    const mailOptions = {
      from: process.env.EMAIL_FROM || 'alerts@rankify.ai',
      to: userEmail,
      subject: `📊 Weekly Digest: ${projectName}`,
      html,
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Failed to send digest:', error);
    return false;
  }
}
