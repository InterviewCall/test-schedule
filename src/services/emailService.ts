import { resend } from '@/lib/resend';

import TestEmail from '../../emails/TestEmail';
import { TestEmailPlainText } from '../../texts/TestEmailPlainText';

export async function sendEmail(date: string, timeSlot: string, maxStartTime: string, mailTo: string) {
    try {
        await resend.emails.send({
            from: 'InterviewCall <entrance-test@interviewcall.club>',
            to: mailTo,
            subject: 'InterviewCall Entrance Test Invitation',
            html: TestEmail({ date, timeSlot, maxStartTime, testLink: 'https://www.interviewcall.club'}),
            text: TestEmailPlainText({ date, timeSlot, maxStartTime, testLink: 'https://www.interviewcall.club'})
        });
        return {
            success: true,
            message: 'Successfully send the mail'
        };
    } catch (error) {
        throw error;
    }
}