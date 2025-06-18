import { NextRequest, NextResponse } from 'next/server';

import authService from '@/lib/authServiceInstance';

export async function POST(req: NextRequest) {
    try {
        const { userEmail, userName, password, adminEmail } = await req.json();
        const user = await authService.createUser(userEmail, userName, password, adminEmail);

        return NextResponse.json({
            success: true,
            message: 'Successfully created the user',
            data: user,
            error: {}
        }, { status: 201 });
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
        }, { status: statusCode });
    }
}