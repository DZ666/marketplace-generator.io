import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    // Получаем cookie из запроса
    const cookie = req.headers.get('cookie');
    
    // Используем абсолютный путь через nginx
    const apiBaseUrl = process.env.API_BASE_URL || 'http://nginx';
    
    const response = await fetch(`${apiBaseUrl}/api/auth/me`, {
      method: 'GET',
      headers: {
        'Cookie': cookie || '',
      },
      credentials: 'include',
    });
    
    if (!response.ok) {
      return NextResponse.json(
        { authenticated: false },
        { status: 401 }
      );
    }
    
    const data = await response.json();
    
    return NextResponse.json(
      { ...data, authenticated: true },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in auth/me route:', error);
    return NextResponse.json(
      { message: 'Internal server error', authenticated: false },
      { status: 500 }
    );
  }
} 