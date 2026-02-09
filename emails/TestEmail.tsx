import { TestProps } from '@/types';

export default function TestEmail({
  date,
  timeSlot,
  maxStartTime,
  testLink,
}: TestProps) {
  return `
      <!DOCTYPE html>
      <html lang='en'>
      <head>
        <meta charset='UTF-8'>
        <meta name='viewport' content='width=device-width, initial-scale=1.0'>
        <title>InterviewCall Test Invitation</title>
        <style>
          body {
            background-color: #f4f4f4;
            padding: 20px;
            font-family: Arial, sans-serif;
          }
          .container {
            background-color: #ffffff;
            padding: 20px;
            border-radius: 10px;
            max-width: 600px;
            margin: auto;
          }
          .button {
            background-color: #007bff;
            color: white;
            padding: 10px 20px;
            border-radius: 5px;
            text-decoration: none;
            display: inline-block;
            margin-top: 20px;
          }

          p {
            line-height: 1.5;
          }
        </style>
      </head>
      <body>
        <div class='container'>
          <h2>Hey there,</h2>
          <p>You're invited to take the InterviewCall Entrance Test.</p>
          <br />
          <p><strong>Date: ${date}</strong></p>
          <p><strong>Time: ${timeSlot}</strong></p>
          <p>Test Duration: 22 minutes <strong>(Make sure to start before ${maxStartTime} to get full time!)</strong></p>
          <br />
          <p>We look forward to seeing you take the test and wish you the best of luck.</p>
          <br />
          <a href='${testLink}' class='button'>Start Test</a>
          <p>If you have any questions, feel free to reach out to us. </p>
          <p>Best regards,<br>Setu Rejeev Jain<br>7303013706</p>
        </div>
      </body>
      </html>
    `;
}
