import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.usersService.findByUsername(username);
    if (!user) {
      return null;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return null;
    }

    const { password: _, ...result } = user;
    return result;
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.username, loginDto.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.generateJwtToken(user);
  }

  async validateOrCreateGoogleUser(googleUser: any) {
    console.log('Validating or creating Google user:', googleUser);
    
    // Try to find user by email
    let user = await this.usersService.findByEmail(googleUser.email);
    console.log('Existing user found by email:', user);
    
    // If user doesn't exist, create a new one
    if (!user) {
      console.log('No existing user found, creating new user');
      user = await this.usersService.createGoogleUser({
        email: googleUser.email,
        firstName: googleUser.firstName,
        lastName: googleUser.lastName,
        picture: googleUser.picture,
        googleId: googleUser.id,
      });
      console.log('New user created:', user);
    } else if (!user.google_id) {
      // If user exists but doesn't have Google ID, update it
      console.log('Updating existing user with Google info');
      user.google_id = googleUser.id;
      user.auth_provider = 'google';
      user.picture = googleUser.picture;
      user = await this.usersService.update(user.user_id, user);
      console.log('User updated with Google info:', user);
    }
    
    return user;
  }

  async googleLogin(req) {
    console.log('Google login called with request:', req.user);
    
    if (!req.user) {
      console.error('No user from Google');
      throw new UnauthorizedException('No user from Google');
    }
    
    const token = this.generateJwtToken(req.user);
    console.log('Generated token for Google user:', token);
    
    return token;
  }

  private generateJwtToken(user: any) {
    const payload = {
      username: user.username || user.email,
      sub: user.user_id,
      tenantId: user.tenant_id,
      role: user.role,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.user_id,
        username: user.username || user.email,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        role: user.role,
        tenantId: user.tenant_id,
        picture: user.picture,
      },
    };
  }
}
