import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Используем абсолютный путь через nginx
    const apiBaseUrl = process.env.API_BASE_URL || 'http://nginx';
    
    const response = await fetch(`${apiBaseUrl}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
      credentials: 'include',
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { message: errorData.message || 'Authentication failed' },
        { status: response.status }
      );
    }
    
    const data = await response.json();
    
    // Сохраняем cookie от auth-сервиса
    const setCookieHeader = response.headers.get('set-cookie');
    
    return NextResponse.json(data, { 
      status: 200,
      headers: {
        'Set-Cookie': setCookieHeader || '',
      }
    });
  } catch (error) {
    console.error('Error in auth/login route:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
} 