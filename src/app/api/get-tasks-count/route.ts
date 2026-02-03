import { NextRequest, NextResponse } from 'next/server';

// import { TEST_STATUS } from '@/enums/TestStatus';
import { testScheduleService } from '@/lib/testScheduleServiceIntance';

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        // const testStatus = searchParams.get('status') as TEST_STATUS | null;
        const bda = searchParams.get('bda');

        const response = await testScheduleService.getTaskCount(bda);
        return NextResponse.json({
            success: true,
            message: 'Successfully fetched tasks count',
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