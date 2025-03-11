import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import databaseConfig from './config/database.config';
import jwtConfig from './config/jwt.config';
import { TenantsModule } from './tenants/tenants.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { CemeteriesModule } from './cemeteries/cemeteries.module';
import { GardensModule } from './gardens/gardens.module';
import { LotsModule } from './lots/lots.module';
import { SpacesModule } from './spaces/spaces.module';
import { SpaceLevelsModule } from './space-levels/space-levels.module';
import { CustomersModule } from './customers/customers.module';
import { ReservationsModule } from './reservations/reservations.module';
import { DeceasedModule } from './deceased/deceased.module';
import { IntermentsModule } from './interments/interments.module';
import { BillingModule } from './billing/billing.module';
import { PaymentsModule } from './payments/payments.module';
import { MaintenanceModule } from './maintenance/maintenance.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, jwtConfig],
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        ...configService.get('database'),
      }),
    }),
    TenantsModule,
    AuthModule,
    UsersModule,
    CemeteriesModule,
    GardensModule,
    LotsModule,
    SpacesModule,
    SpaceLevelsModule,
    CustomersModule,
    ReservationsModule,
    DeceasedModule,
    IntermentsModule,
    BillingModule,
    PaymentsModule,
    MaintenanceModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
