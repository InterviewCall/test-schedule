import { NextRequest, NextResponse } from 'next/server';

import { testScheduleService } from '@/lib/testScheduleServiceIntance';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*', // or specify a domain like 'https://example.com'
  'Access-Control-Allow-Methods': 'GET,POST,PUT,PATCH,DELETE,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function PATCH(req: NextRequest) {
  try {
    const { email, status } = await req.json();
    await testScheduleService.updateTestStatus(email, status);

    return NextResponse.json({
      success: true,
      message: 'Successfully updated test status',
      data: {},
      error: {}
    }, { headers: corsHeaders, status: 200 });

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
    }, { status: statusCode, headers: corsHeaders });
  }
}
