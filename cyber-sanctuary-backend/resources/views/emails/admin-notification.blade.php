<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Payment Submission - Cyber Sanctuary</title>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            line-height: 1.6;
            color: #000000;
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
            color: #000000;
        }

        .footer {
            margin-top: 20px;
            text-align: center;
            font-size: 12px;
            color: #666666;
        }

        h1, h2, h3 {
            font-family: 'Courier New', monospace;
            color: #00aa33;
        }

        .payment-details {
            background-color: #f9f9f9;
            border: 1px solid #ccc;
            padding: 15px;
            margin: 20px 0;
            border-radius: 5px;
            color: #000;
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

        .urgent {
            background-color: #fff5f5;
            border-left: 4px solid #ff3333;
            padding: 10px 15px;
            margin: 20px 0;
            color: #cc0000;
            font-weight: bold;
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
            <p>Admin Notification</p>
        </div>

        <div class="content">
            <h2>New Payment Submission</h2>

            <div class="urgent">
                <p><strong>Action Required:</strong> A new payment has been submitted and requires your verification.</p>
            </div>

            <p>A new payment has been submitted with the following details:</p>

            <div class="payment-details">
                <div class="detail-row">
                    <span>Order ID:</span>
                    <span class="highlight">ORD-6V0WZNA</span>
                </div>
                <div class="detail-row">
                    <span>Username:</span>
                    <span>samar</span>
                </div>
                <div class="detail-row">
                    <span>Email:</span>
                    <span><a href="mailto:mashanadeem0200@gmail.com">mashanadeem0200@gmail.com</a></span>
                </div>
                <div class="detail-row">
                    <span>Course:</span>
                    <span>Advanced Penetration Testing</span>
                </div>
                <div class="detail-row">
                    <span>Amount:</span>
                    <span class="highlight">$299.00</span>
                </div>
                <div class="detail-row">
                    <span>Date:</span>
                    <span>Jul 16, 2025 21:03</span>
                </div>
            </div>

            <p>Please review the payment proof and take appropriate action.</p>

            <a href="#" class="action-button">Review Payment</a>

            <p>Thank you for your attention to this matter.</p>
        </div>

        <div class="footer">
            <p>&copy; 2025 Cyber Sanctuary. All rights reserved.</p>
            <p>This is an automated message from the Cyber Sanctuary payment system.</p>
        </div>
    </div>
</body>
</html>
