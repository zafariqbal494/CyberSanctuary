<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Payment Approved - Cyber Sanctuary</title>
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

    .success-box {
      background-color: #e6ffe6;
      border-left: 4px solid #00cc44;
      padding: 10px 15px;
      margin: 20px 0;
      color: #006622;
      font-weight: bold;
    }

    .credentials-box {
      background-color: #f2fdf2;
      border: 1px solid #00cc44;
      padding: 15px;
      margin: 20px 0;
      border-radius: 5px;
    }

    @media only screen and (max-width: 600px) {
      .detail-row {
        flex-direction: column;
        align-items: flex-start;
      }

      .action-button {
        width: 100%;
        box-sizing: border-box;
        text-align: center;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>CYBER SANCTUARY</h1>
      <p>Payment Approved</p>
    </div>

    <div class="content">
      <h2>Your Payment Has Been Approved!</h2>

      <div class="success-box">
        <p><strong>Good news!</strong> Your payment has been verified and your enrollment is now complete.</p>
      </div>

      <p>Hello {{ $payment->username }},</p>

      <p>We're pleased to inform you that your payment for <strong>{{ $course->name }}</strong> has been approved. You now have full access to the course materials.</p>

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
          <span class="highlight">APPROVED</span>
        </div>
      </div>

      @if($showPassword)
      <h3>Your Login Credentials</h3>
      <div class="credentials-box">
        <div class="detail-row">
          <span>Email:</span>
          <span>{{ $user->email }}</span>
        </div>
        <div class="detail-row">
          <span>Username:</span>
          <span>{{ $user->username }}</span>
        </div>
        <div class="detail-row">
          <span>Password:</span>
          <span class="highlight">{{ $password }}</span>
        </div>
      </div>
      <p><strong>Important:</strong> Please save these credentials and change your password after your first login for security purposes.</p>
      @endif

      <p>To access your course:</p>
      <ol>
        <li>Log in to your account using the credentials above</li>
        <li>Navigate to "My Courses" in your dashboard</li>
        <li>Click on "{{ $course->name }}" to start learning</li>
      </ol>

      <a href="{{ $loginUrl }}" class="action-button">Access Your Course</a>

      <p>If you have any questions or need assistance, please don't hesitate to contact our support team.</p>

      <p>Thank you for choosing Cyber Sanctuary for your cybersecurity education!</p>

      <p>Best regards,<br />The Cyber Sanctuary Team</p>
    </div>

    <div class="footer">
      <p>&copy; {{ date('Y') }} Cyber Sanctuary. All rights reserved.</p>
      <p>This is an automated message, please do not reply to this email.</p>
    </div>
  </div>
</body>
</html>
