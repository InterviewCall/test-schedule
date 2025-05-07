import { NextRequest, NextResponse } from 'next/server';

import { testScheduleService } from '@/lib/testScheduleServiceIntance';

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const email = searchParams.get('email');

        if (!email) {
            return NextResponse.json(
                { message: 'Email is required' },
                { status: 400 }
            );
        }

        const response = await testScheduleService.retrieveEmail(email);

        return NextResponse.json({
            success: true,
            message: 'Successfully fetched',
            data: response,
            error: {}
        });
    } catch (error) {
        return NextResponse.json({
            success: false,
            message: 'Something went wrong',
            data: {},
            error
        }, { status: 500 });
    }
}