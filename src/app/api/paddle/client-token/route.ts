import { NextResponse } from 'next/server';
import { Paddle } from '@paddle/paddle-node-sdk';

export async function GET() {
  try {
    const paddle = new Paddle(process.env.PADDLE_API_KEY!);
    
    const clientToken = await paddle.clientSideTokens.create();
    
    return NextResponse.json({ token: clientToken.data.token });
  } catch (error) {
    console.error('Failed to create Paddle client token:', error);
    return NextResponse.json(
      { error: 'Failed to create client token' },
      { status: 500 }
    );
  }
}
