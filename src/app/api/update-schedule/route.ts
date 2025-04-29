import { NextRequest, NextResponse } from 'next/server';

import { testScheduleService } from '@/lib/testScheduleServiceIntance';

export async function PUT(req: NextRequest) {
    try {
        const { updateEmail, updateStartTime, updateEndTime } = await req.json();
        // if(updateDateOfTest) await testScheduleService.updateDateTimeSlot(updateEmail, updateStartTime, updateEndTime);
        await testScheduleService.updateDateTimeSlot(updateEmail, updateStartTime, updateEndTime);

        return NextResponse.json({
            success: true,
            message: 'Timeslot updated successfully',
            data: {},
            error: {}
        }, { status: 200 });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        let message = 'Something went wrong';
        let statusCode = 500;

        if(error.message) {
            message = error.message;
            statusCode = 400;
        }

        return NextResponse.json({
            success: false,
            message: message,
            data: {},
            error
        }, { status: statusCode });
    }
} 