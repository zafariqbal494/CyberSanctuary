<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Payment Rejected - Cyber Sanctuary</title>
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

    .details-box {
      background-color: #f9f9f9;
      border: 1px solid #ccc;
      padding: 15px;
      margin: 20px 0;
      border-radius: 5px;
    }

    .detail-row {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
      border-bottom: 1px solid #ddd;
    }

    .detail-row:last-child {
      border-bottom: none;
    }

    .highlight {
      color: #00aa33;
      font-weight: bold;
    }

    .action-button {
      display: inline-block;
      background-color: #00cc44;
      color: white;
      text-decoration: none;
      padding: 12px 24px;
      border-radius: 4px;
      font-weight: bold;
      margin-top: 20px;
      text-align: center;
    }

    .action-button:hover {
      background-color: #009933;
    }

    .rejected-box {
      background-color: #ffe6e6;
      border-left: 4px solid #ff3333;
      padding: 10px 15px;
      margin: 20px 0;
      color: #cc0000;
      font-weight: bold;
    }

    .reason-box {
      background-color: #fff0f0;
      border: 1px solid #ffcccc;
      padding: 15px;
      margin: 20px 0;
      border-radius: 5px;
      color: #cc0000;
    }

    a {
      color: #00aa33;
    }

    @media only screen and (max-width: 600px) {
      .detail-row {
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
      <p>Payment Status Update</p>
    </div>

    <div class="content">
      <h2>Payment Verification Result</h2>

      <div class="rejected-box">
        <p><strong>We regret to inform you</strong> that your payment could not be verified at this time.</p>
      </div>

      <p>Hello {{ $payment->username }},</p>

      <p>Thank you for your interest in our <strong>{{ $course->name }}</strong> course. Unfortunately, we were unable to verify your payment.</p>

      <div class="details-box">
        <div class="detail-row">
          <span>Order ID:</span>
          <span class="highlight">{{ $payment->order_id }}</span>
        </div>
        <div class="detail-row">
          <span>Course:</span>
          <span>{{ $course->name }}</span>
        </div>
        <div class="detail-row">
          <span>Amount:</span>
          <span class="highlight">${{ number_format($payment->amount, 2) }}</span>
        </div>
        <div class="detail-row">
          <span>Status:</span>
          <span style="color: #cc0000; font-weight: bold;">REJECTED</span>
        </div>
      </div>

      @if($reason)
      <h3>Reason for Rejection</h3>
      <div class="reason-box">
        <p>{{ $reason }}</p>
      </div>
      @endif

      <h3>What You Can Do Next</h3>
      <p>You have the following options:</p>
      <ol>
        <li>Submit a new payment with the correct information</li>
        <li>Contact our support team for assistance</li>
        <li>Request clarification about the rejection reason</li>
      </ol>

      <p>If you believe this is an error or need further assistance, please contact our support team at  
      <a href="mailto:{{ $supportEmail }}">{{ $supportEmail }}</a>.</p>

      <p>We apologize for any inconvenience this may have caused.</p>

      <p>Best regards,<br />The Cyber Sanctuary Team</p>
    </div>

    <div class="footer">
      <p>&copy; {{ date('Y') }} Cyber Sanctuary. All rights reserved.</p>
      <p>This is an automated message, please do not reply to this email.</p>
    </div>
  </div>
</body>
</html>
