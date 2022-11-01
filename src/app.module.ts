import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ReportsModule } from './reports/reports.module';
import { User } from './users/user.entity';
import { Report } from './reports/entities/report.entity';
import { DataSourceOptions } from 'typeorm';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          type: 'postgres',
          database: config.get<string>('PGDATABASE'),
          host: config.get<string>('PGHOST'),
          port: config.get<number>('PGPORT'),
          username: config.get<string>('PGUSER'),
          password: config.get<string>('PGPASSWORD'),
          entities: [User, Report],
          synchronize: true, //process.env.NODE_ENV === 'development' ? true : false,
          migrations: [/****/],
          migrationsTableName: 'migrations_history'
        }
      }
    }),
    UsersModule,
    ReportsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
