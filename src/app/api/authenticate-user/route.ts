import { NextRequest, NextResponse } from 'next/server';

import authService from '@/lib/authServiceInstance';

export async function POST(req: NextRequest) {
    const headers = {
        'Access-Control-Allow-Origin': '*', // You can replace '*' with specific origin for more security
        'Access-Control-Allow-Methods': 'GET,OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };

    try {
        const { userEmail, password } = await req.json();
        const user = await authService.authenticateUser(userEmail, password);

        return NextResponse.json({
            success: true,
            message: 'Successfully authenticated the user',
            data: user,
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