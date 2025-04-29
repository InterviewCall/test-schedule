import { NextRequest, NextResponse } from 'next/server';

import { testScheduleService } from '@/lib/testScheduleServiceIntance';

export async function POST(req: NextRequest) {
    try {
        const { candidateName, candidateEmail, startTime, endTime, invitedBy } = await req.json();
        const response = await testScheduleService.createTest({
            candidateName,
            candidateEmail,
            startTime,
            endTime,
            invitedBy
        }); 

        return NextResponse.json({
            success: true,
            message: 'Test scheduled successfully',
            data: response,
            error: {}
        }, { status: 200 });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        let message = 'Something went wrong';
        let statusCode = 500;

        if(error.code === 11000) {
            message = 'This email has already a test scheduled';
            statusCode = 400;
        }

        return NextResponse.json({
            success: false,
            message,
            data: {},
            error
        }, { status: statusCode });
    }
}