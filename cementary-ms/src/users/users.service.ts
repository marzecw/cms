import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

interface GoogleUserDto {
  email: string;
  firstName: string;
  lastName: string;
  picture: string;
  googleId: string;
}

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    // Check if username or email already exists
    const existingUser = await this.usersRepository.findOne({
      where: [
        { username: createUserDto.username },
        { email: createUserDto.email },
      ],
    });

    if (existingUser) {
      throw new ConflictException('Username or email already exists');
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    // Create the user with the hashed password
    const user = this.usersRepository.create({
      ...createUserDto,
      password: hashedPassword,
      auth_provider: 'local',
    });

    return this.usersRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async findByTenantId(tenantId: number): Promise<User[]> {
    return this.usersRepository.find({ where: { tenant_id: tenantId } });
  }

  async findOne(id: number): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { user_id: id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { username } });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async findByGoogleId(googleId: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { google_id: googleId } });
  }

  async createGoogleUser(googleUserDto: GoogleUserDto): Promise<User> {
    console.log('Creating Google user:', googleUserDto);
    
    // Check if email already exists
    const existingUser = await this.findByEmail(googleUserDto.email);
    console.log('Existing user found by email:', existingUser);
    
    if (existingUser) {
      // If user exists but doesn't have Google ID, update it
      if (!existingUser.google_id) {
        console.log('Updating existing user with Google ID');
        existingUser.google_id = googleUserDto.googleId;
        existingUser.auth_provider = 'google';
        existingUser.picture = googleUserDto.picture;
        const updatedUser = await this.usersRepository.save(existingUser);
        console.log('User updated with Google ID:', updatedUser);
        return updatedUser;
      }
      console.log('Returning existing user with Google ID');
      return existingUser;
    }
    
    // Create new user from Google data
    console.log('Creating new user from Google data');
    const user = this.usersRepository.create({
      email: googleUserDto.email,
      first_name: googleUserDto.firstName,
      last_name: googleUserDto.lastName,
      picture: googleUserDto.picture,
      google_id: googleUserDto.googleId,
      auth_provider: 'google',
      is_active: true,
      role: 'user',
      tenant_id: 1, // Default tenant ID - adjust as needed
    });
    
    const savedUser = await this.usersRepository.save(user);
    console.log('New user created from Google data:', savedUser);
    return savedUser;
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);

    // If password is being updated, hash it
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    this.usersRepository.merge(user, updateUserDto);
    return this.usersRepository.save(user);
  }

  async remove(id: number): Promise<void> {
    const user = await this.findOne(id);
    await this.usersRepository.remove(user);
  }
}
