import { NextRequest, NextResponse } from 'next/server';

import { TEST_STATUS } from '@/enums/TestStatus';
import { testScheduleService } from '@/lib/testScheduleServiceIntance';

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const testStatus = searchParams.get('status');

        if(!testStatus) {
            const response = await testScheduleService.getAllTests();
            return NextResponse.json({
                success: true,
                message: 'Successfully fetched all tests',
                data: response,
                error: {}
            }, { status: 200 });
        }

        const response = await testScheduleService.getAllTestsByTestStattus(testStatus as TEST_STATUS);
        return NextResponse.json({
            success: true,
            message: 'Successfully fetched all tests',
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