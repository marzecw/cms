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

  @Get('google')
  @UseGuards(AuthGuard('google'))
  @ApiOperation({ summary: 'Initiate Google OAuth login' })
  @ApiResponse({ status: 302, description: 'Redirect to Google login page.' })
  googleAuth() {
    console.log('Starting Google authentication flow');
    // This route initiates the Google OAuth flow
    // The actual implementation is handled by Passport
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  @ApiOperation({ summary: 'Handle Google OAuth callback' })
  @ApiResponse({ status: 200, description: 'Return JWT token and user info.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  googleAuthCallback(@Req() req, @Res() res) {
    console.log('Google auth callback received');
    console.log('User from request:', JSON.stringify(req.user, null, 2));
    
    // After successful Google authentication, get JWT token
    this.authService.googleLogin(req).then(loginResult => {
      console.log('Login result:', JSON.stringify(loginResult, null, 2));
      
      // Redirect to frontend with token
      const token = loginResult.access_token;
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3001';
      const redirectUrl = `${frontendUrl}/auth/google/callback?token=${token}`;
      console.log('Redirecting to:', redirectUrl);
      
      return res.redirect(redirectUrl);
    }).catch(error => {
      console.error('Error in Google auth callback:', error);
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3001';
      return res.redirect(`${frontendUrl}/login?error=auth_failed`);
    });
  }
}
