import { NextRequest, NextResponse } from 'next/server';

import { testScheduleService } from '@/lib/testScheduleServiceIntance';

export async function GET(req: NextRequest) {
    const headers = {
        'Access-Control-Allow-Origin': '*', // You can replace '*' with specific origin for more security
        'Access-Control-Allow-Methods': 'GET,OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };

    try {
        const { searchParams } = new URL(req.url);
        const email = searchParams.get('email');
    
        if (!email) {
            return NextResponse.json(
                { message: 'Email is required' },
                { status: 400, headers }
            );
        }

        const candidate = await testScheduleService.getTest(email);
        return NextResponse.json({
            success: true,
            message: 'Successfully fetched the candidate',
            data: candidate,
            error: {}
        }, { headers, status: 200 });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        let message = 'Something went wrong';
        let statusCode = 500;

        if (error.message) {
            message = error.message;
            statusCode = 400;
        }

        return NextResponse.json({
            success: false,
            message,
            data: {},
            error
        }, { status: statusCode, headers });
    }
}

// Handle preflight CORS requests (required for non-simple requests)
export async function OPTIONS() {
    return NextResponse.json({}, {
        status: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET,OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        }
    });
}
