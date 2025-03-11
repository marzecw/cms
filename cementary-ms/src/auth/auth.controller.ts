import { Controller, Post, Body, HttpCode, HttpStatus, Get, UseGuards, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login with username and password' })
  @ApiResponse({ status: 200, description: 'Return JWT token and user info.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  /* Temporarily disabled Google authentication
  @Get('google')
  @UseGuards(AuthGuard('google'))
  @ApiOperation({ summary: 'Initiate Google OAuth login' })
  @ApiResponse({ status: 302, description: 'Redirect to Google login page.' })
  googleAuth() {
    // This route initiates the Google OAuth flow
    // The actual implementation is handled by Passport
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  @ApiOperation({ summary: 'Handle Google OAuth callback' })
  @ApiResponse({ status: 200, description: 'Return JWT token and user info.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  googleAuthCallback(@Req() req, @Res() res) {
    // After successful Google authentication, get JWT token
    this.authService.googleLogin(req).then(loginResult => {
      // Redirect to frontend with token
      const token = loginResult.access_token;
      const redirectUrl = `${process.env.FRONTEND_URL}/auth/google/callback?token=${token}`;
      return res.redirect(redirectUrl);
    });
  }
  */
}
