import { Controller, Get, Post, Body, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../application/user.service';
import { RabbitMQService } from '@marketplace/config';
import { USER_SERVICE_EXCHANGE, USER_CREATED_PATTERN } from '@marketplace/config';
// Временно удаляем зависимость от bcrypt для тестирования
// import * as bcrypt from 'bcrypt';

@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly rabbitMQService: RabbitMQService
  ) {}

  @Get()
  getUsers() {
    return this.userService.getUsers();
  }

  @Post()
  async createUser(@Body() createUserDto: any) {
    const user = this.userService.createUser(createUserDto);
    // Отправка события о создании пользователя
    await this.rabbitMQService.emit(
      USER_SERVICE_EXCHANGE,
      USER_CREATED_PATTERN,
      user
    );
    return user;
  }
  
  @Post('auth/login')
  async login(@Body() loginDto: { email: string; password: string }) {
    const user = this.userService.getUserByEmail(loginDto.email);
    if (!user) throw new UnauthorizedException('User not found');
    
    // Простая проверка пароля для тестирования (без bcrypt)
    // В реальном приложении нужно использовать bcrypt.compare
    const isMatch = user.password === loginDto.password;
    if (!isMatch) throw new UnauthorizedException('Invalid password');
    
    // Успешная авторизация
    return { id: user.id, email: user.email, name: user.name };
  }
  
  @Post('auth/register')
  async register(@Body() registerDto: { email: string; password: string; name: string }) {
    // Создаем пользователя без хеширования пароля для тестирования
    const newUser = this.userService.createUser({
      email: registerDto.email,
      password: registerDto.password, // В реальном приложении нужно хешировать
      name: registerDto.name,
    });
    
    // Отправляем событие о создании пользователя
    await this.rabbitMQService.emit(
      USER_SERVICE_EXCHANGE,
      USER_CREATED_PATTERN,
      { id: newUser.id, email: newUser.email, name: newUser.name }
    );
    
    return { id: newUser.id, email: newUser.email, name: newUser.name };
  }
} 