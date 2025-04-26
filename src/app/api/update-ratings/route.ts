import { NextRequest, NextResponse } from 'next/server';

import { testScheduleService } from '@/lib/testScheduleServiceIntance';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*', // Or set to a specific domain
  'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Credentials': 'true',
};

export async function OPTIONS() {
  return NextResponse.json({}, {
    status: 200,
    headers: corsHeaders,
  });
}

export async function PATCH(req: NextRequest) {
  try {
    const { email, ratings } = await req.json();
    const response = await testScheduleService.updateRating(email, ratings);

    return NextResponse.json(
      {
        success: true,
        message: 'Ratings updated successfully',
        data: response,
        error: {},
      },
      {
        status: 200,
        headers: corsHeaders,
      }
    );
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    let message = 'Something went wrong';
    let statusCode = 500;

    if (error.message) {
      message = error.message;
      statusCode = 400;
    }

    return NextResponse.json(
      {
        success: false,
        message: message,
        data: {},
        error,
      },
      {
        status: statusCode,
        headers: corsHeaders,
      }
    );
  }
}