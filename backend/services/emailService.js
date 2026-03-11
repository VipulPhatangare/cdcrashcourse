const nodemailer = require('nodemailer');

// Create reusable transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

// Send OTP Email
const sendOTPEmail = async (email, otp) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: 'Email Verification - Campus Dekho Crash Course',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              background-color: #f4f4f4;
              margin: 0;
              padding: 0;
            }
            .container {
              max-width: 600px;
              margin: 40px auto;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              padding: 40px;
              border-radius: 10px;
              box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            }
            .content {
              background: white;
              padding: 30px;
              border-radius: 8px;
            }
            h1 {
              color: #667eea;
              margin-top: 0;
            }
            .otp-box {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              padding: 20px;
              text-align: center;
              font-size: 32px;
              font-weight: bold;
              letter-spacing: 8px;
              border-radius: 8px;
              margin: 25px 0;
            }
            .info {
              color: #666;
              font-size: 14px;
              line-height: 1.6;
            }
            .footer {
              text-align: center;
              color: white;
              margin-top: 20px;
              font-size: 12px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="content">
              <h1>🎓 Campus Dekho</h1>
              <h2>Email Verification</h2>
              <p>Hello!</p>
              <p>Thank you for registering for the <strong>Campus Dekho Admission Crash Course</strong>.</p>
              <p>Your One-Time Password (OTP) for email verification is:</p>
              <div class="otp-box">${otp}</div>
              <p class="info">
                ⏰ This OTP is valid for <strong>10 minutes</strong>.<br>
                🔒 Please do not share this OTP with anyone.<br>
                ❓ If you didn't request this, please ignore this email.
              </p>
            </div>
            <div class="footer">
              <p>© 2026 Campus Dekho. All rights reserved.</p>
              <p>Your partner in college admission guidance</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ' + info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error: error.message };
  }
};

module.exports = { sendOTPEmail };
