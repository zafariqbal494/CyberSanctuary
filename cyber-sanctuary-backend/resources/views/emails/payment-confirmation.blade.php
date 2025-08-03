<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Payment Confirmation - Cyber Sanctuary</title>
  <style>
    body {
      font-family: 'Arial', sans-serif;
      line-height: 1.6;
      color: #000;
      background-color: #ffffff;
      margin: 0;
      padding: 0;
    }

    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }

    .header {
      background-color: #f1f1f1;
      padding: 20px;
      text-align: center;
      border-bottom: 3px solid #00cc44;
    }

    .content {
      background-color: #ffffff;
      padding: 20px;
      border-radius: 5px;
      margin-top: 20px;
      border: 1px solid #ddd;
    }

    .footer {
      margin-top: 20px;
      text-align: center;
      font-size: 12px;
      color: #666;
    }

    h1, h2, h3 {
      font-family: 'Courier New', monospace;
      color: #00aa33;
    }

    .order-details {
      background-color: #f9f9f9;
      border: 1px solid #ccc;
      padding: 15px;
      margin: 20px 0;
      border-radius: 5px;
    }

    .order-row {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
      border-bottom: 1px solid #ddd;
    }

    .order-row:last-child {
      border-bottom: none;
    }

    .highlight {
      color: #00aa33;
      font-weight: bold;
    }

    .status {
      display: inline-block;
      background-color: #ffc107;
      color: #000;
      padding: 5px 10px;
      border-radius: 3px;
      font-weight: bold;
      font-size: 14px;
    }

    .note {
      background-color: #f1fff1;
      border-left: 4px solid #00cc44;
      padding: 10px 15px;
      margin: 20px 0;
      color: #005500;
    }

    @media only screen and (max-width: 600px) {
      .order-row {
        flex-direction: column;
        align-items: flex-start;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>CYBER SANCTUARY</h1>
      <p>Payment Confirmation</p>
    </div>

    <div class="content">
      <h2>Thank You for Your Payment</h2>

      <p>Hello {{ $payment->username }},</p>

      <p>We have received your payment for the following course:</p>

      <div class="order-details">
        <div class="order-row">
          <span>Order ID:</span>
          <span class="highlight">{{ $payment->order_id }}</span>
        </div>
        <div class="order-row">
          <span>Course:</span>
          <span>{{ $course->name }}</span>
        </div>
        <div class="order-row">
          <span>Amount:</span>
          <span class="highlight">${{ number_format($payment->amount, 2) }}</span>
        </div>
        <div class="order-row">
          <span>Date:</span>
          <span>{{ $payment->created_at->format('M d, Y H:i') }}</span>
        </div>
        <div class="order-row">
          <span>Status:</span>
          <span class="status">PENDING VERIFICATION</span>
        </div>
      </div>

      <div class="note">
        <p><strong>What happens next?</strong></p>
        <p>Our team will verify your payment within 1–24 hours. Once approved, you'll receive your login credentials and course access via email.</p>
      </div>

      <p>If you have any questions, please contact our support team.</p>

      <p>Thank you for choosing Cyber Sanctuary for your cybersecurity education.</p>

      <p>Best regards,<br />The Cyber Sanctuary Team</p>
    </div>

    <div class="footer">
      <p>&copy; {{ date('Y') }} Cyber Sanctuary. All rights reserved.</p>
      <p>This is an automated message, please do not reply to this email.</p>
    </div>
  </div>
</body>
</html>
