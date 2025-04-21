import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  login(loginDto: { email: string; password: string }) {
    // В реальном приложении здесь была бы проверка учетных данных
    return {
      accessToken: 'mock-jwt-token',
      user: {
        id: 1,
        email: loginDto.email,
        name: 'Test User',
      },
    };
  }
}