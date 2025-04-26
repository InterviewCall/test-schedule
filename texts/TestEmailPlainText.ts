import { TestProps } from '@/types';

export function TestEmailPlainText({
    date,
    timeSlot,
    maxStartTime,
    testLink,
  }: TestProps) {
    return `
  Hey there,
  
  You're invited to take the InterviewCall Entrance Test.
  
  Date: ${date}
  Time: ${timeSlot}
  Test Duration: 22 minutes (Make sure to start before ${maxStartTime} to get full time!)
  
  We look forward to seeing you take the test and wish you the best of luck.
  
  Start your test here: ${testLink}
  
  If you have any questions, feel free to reach out to us.
  
  Best regards,  
  Prithviraj Paul  
  9831649077
    `;
  }
  