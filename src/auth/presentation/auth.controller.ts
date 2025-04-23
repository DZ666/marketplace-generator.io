import { Controller, Get, Post, Body, Req, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../application/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: { email: string; password: string }, @Req() req) {
    const user = await this.authService.login(loginDto);
    req.session.userId = user.id;
    req.session.email = user.email;
    req.session.name = user.name;
    return { success: true };
  }

  @Get('me')
  me(@Req() req) {
    if (!req.session.userId) throw new UnauthorizedException();
    return { id: req.session.userId, email: req.session.email, name: req.session.name };
  }

  @Post('logout')
  logout(@Req() req) {
    req.session.destroy(() => {});
    return { success: true };
  }

  @Get('status')
  getStatus() {
    return { status: 'Auth service is running' };
  }

  @Post('register')
  async register(@Body() registerDto: { email: string; password: string; name: string }, @Req() req) {
    const user = await this.authService.register(registerDto);
    req.session.userId = user.id;
    req.session.email = user.email;
    req.session.name = user.name;
    return { success: true };
  }
}