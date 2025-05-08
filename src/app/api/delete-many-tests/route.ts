import { NextRequest, NextResponse } from 'next/server';

import { TEST_STATUS } from '@/enums/TestStatus';
import { testScheduleService } from '@/lib/testScheduleServiceIntance';

export async function DELETE(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const status = searchParams.get('status') as TEST_STATUS | null;
        const { emails } = await req.json();
        const response = await testScheduleService.deleteManyTest(emails, status);

        return NextResponse.json({
            success: true,
            message: 'Successfully deleted the tests',
            data: response,
            error: {}
        }, { status: 200 });
    } catch (error) {
        return NextResponse.json({
            success: false,
            message: 'Something went wrong',
            data: {},
            error
        }, { status: 500 });
    }
}