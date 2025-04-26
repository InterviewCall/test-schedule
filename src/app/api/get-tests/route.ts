import { NextResponse } from 'next/server';

import { testScheduleService } from '@/lib/testScheduleServiceIntance';

export async function GET() {
    try {
        const response = await testScheduleService.getAllTests();
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