import { NextRequest, NextResponse } from 'next/server';

import { testScheduleService } from '@/lib/testScheduleServiceIntance';

export async function PATCH(req: NextRequest) {
    try {
        const { email, reportCard } = await req.json();
        await testScheduleService.updateReportCard(email, reportCard);

        return NextResponse.json({
            success: true,
            message: 'Report card updated successfully',
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