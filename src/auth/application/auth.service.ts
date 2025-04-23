import { Injectable, UnauthorizedException } from '@nestjs/common';
// Заменяем использование Prisma на простую имплементацию
// import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

// Имитация базы данных с пользователями для тестирования
const mockUsers = [
  { 
    id: '1', 
    email: 'user1@example.com', 
    name: 'User 1',
    password: '$2b$10$GRaXJGsLZgQwAW9ojQdXL.YXUb3lJtVncl3RImXkT10jw1TKp/VoS' // password1
  },
  { 
    id: '2', 
    email: 'user2@example.com', 
    name: 'User 2',
    password: '$2b$10$GRaXJGsLZgQwAW9ojQdXL.YXUb3lJtVncl3RImXkT10jw1TKp/VoS' // password1
  }
];

@Injectable()
export class AuthService {
  async login(loginDto: { email: string; password: string }) {
    const user = mockUsers.find(u => u.email === loginDto.email);
    if (!user) throw new UnauthorizedException('User not found');
    
    try {
      const isMatch = await bcrypt.compare(loginDto.password, user.password);
      if (!isMatch) throw new UnauthorizedException('Invalid password');
      
      // user найден и пароль верный
      return { id: user.id, email: user.email, name: user.name };
    } catch (error) {
      console.error('Error comparing passwords:', error);
      throw new UnauthorizedException('Authentication error');
    }
  }

  async register(registerDto: { email: string; password: string; name: string }) {
    // Проверяем, не существует ли уже пользователь с таким email
    const existing = mockUsers.find(u => u.email === registerDto.email);
    if (existing) {
      throw new UnauthorizedException('User with this email already exists');
    }
    
    try {
      const hashedPassword = await bcrypt.hash(registerDto.password, 10);
      const newUser = {
        id: String(mockUsers.length + 1),
        email: registerDto.email,
        password: hashedPassword,
        name: registerDto.name
      };
      
      // В реальном приложении здесь был бы код для сохранения в базу данных
      mockUsers.push(newUser);
      
      return { id: newUser.id, email: newUser.email, name: newUser.name };
    } catch (error) {
      console.error('Error creating user:', error);
      throw new Error('Failed to create user');
    }
  }
}