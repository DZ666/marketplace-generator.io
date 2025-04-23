import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    // Получаем cookie из запроса
    const cookie = req.headers.get('cookie');
    
    // Используем абсолютный путь через nginx
    const apiBaseUrl = process.env.API_BASE_URL || 'http://nginx';
    
    const response = await fetch(`${apiBaseUrl}/api/auth/logout`, {
      method: 'POST',
      headers: {
        'Cookie': cookie || '',
      },
      credentials: 'include',
    });
    
    // Возвращаем ответ с очисткой cookie
    return NextResponse.json(
      { success: true },
      { 
        status: 200,
        headers: {
          // Очищаем cookie на стороне клиента
          'Set-Cookie': 'connect.sid=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly',
        }
      }
    );
  } catch (error) {
    console.error('Error in auth/logout route:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
} 