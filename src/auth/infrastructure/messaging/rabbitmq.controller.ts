import { Controller } from '@nestjs/common';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { AuthService } from '../../application/auth.service';
import { VALIDATE_USER_PATTERN, USER_CREATED_PATTERN } from '@marketplace/config';

@Controller()
export class RabbitMQController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern(VALIDATE_USER_PATTERN)
  async validateUser(@Payload() data: { userId: number; token: string }) {
    try {
      // В реальном приложении здесь будет код валидации токена
      return { valid: true, userId: data.userId };
    } catch (error) {
      return { valid: false, error: error.message };
    }
  }

  @EventPattern(USER_CREATED_PATTERN)
  async handleUserCreated(@Payload() data: any) {
    console.log('User created event received in Auth service:', data);
    // Тут может быть код для создания учетных данных пользователя
  }
} 