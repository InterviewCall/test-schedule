import { NextRequest, NextResponse } from 'next/server';

import { testScheduleService } from '@/lib/testScheduleServiceIntance';

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const email = searchParams.get('email');
        const response = await testScheduleService.getCandidateByEmail(email as string);
        return NextResponse.json({
            success: true,
            message: 'Successfully fetched all candidates by email',
            data: response,
            error: {}
        }, { status: 200 });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        let message = 'Something went wrong';
        let statusCode = 500;

        if (error.message) {
            message = error.message;
            statusCode = 404;
        }

        return NextResponse.json({
            success: false,
            message,
            data: {},
            error
        }, { status: statusCode });
    }
}