import { resend } from '@/lib/resend';

import TestEmail from '../../emails/TestEmail';
import { TestEmailPlainText } from '../../texts/TestEmailPlainText';

export async function sendEmail(date: string, timeSlot: string, maxStartTime: string, mailTo: string) {
    try {
        const response = await resend.emails.send({
            from: 'InterviewCall <entrance-test@interviewcall.club>',
            to: mailTo,
            subject: 'InterviewCall Entrance Test Invitation',
            html: TestEmail({ date, timeSlot, maxStartTime, testLink: process.env.TEST_PORTAL_LINK!}),
            text: TestEmailPlainText({ date, timeSlot, maxStartTime, testLink: process.env.TEST_PORTAL_LINK!})
        });
        return {
            success: true,
            message: 'Successfully send the mail',
            data: response.data?.id
        };
    } catch (error) {
        throw error;
    }
}

export async function retrieveEmail(id: string) {
    try {
        const response = await resend.emails.get(id);
        return {
            success: true,
            message: 'OK',
            data: response.data
        };
    } catch (error) {
        throw error;
    }
}