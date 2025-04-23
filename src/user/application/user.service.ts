import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
  private users = [
    { id: 1, name: 'User 1', email: 'user1@example.com', password: 'password1' },
    { id: 2, name: 'User 2', email: 'user2@example.com', password: 'password2' },
  ];

  getUsers() {
    return {
      users: this.users,
    };
  }

  getUserById(id: number) {
    return this.users.find(user => user.id === id);
  }

  getUserByEmail(email: string) {
    return this.users.find(user => user.email === email);
  }

  createUser(createUserDto: any) {
    const newUser = {
      id: this.users.length + 1,
      ...createUserDto,
    };
    this.users.push(newUser);
    return newUser;
  }

  updateUser(id: number, updateUserDto: any) {
    const userIndex = this.users.findIndex(user => user.id === id);
    if (userIndex >= 0) {
      this.users[userIndex] = { ...this.users[userIndex], ...updateUserDto };
      return this.users[userIndex];
    }
    return null;
  }
} 