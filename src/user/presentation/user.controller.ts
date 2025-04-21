import { Controller, Get, Post, Body } from '@nestjs/common';
import { UserService } from '../application/user.service';
import { RabbitMQService } from '@marketplace/config';
import { USER_SERVICE_EXCHANGE, USER_CREATED_PATTERN } from '@marketplace/config';

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
} 