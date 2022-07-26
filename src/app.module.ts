import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './controllers/app.controller';
import { UserController } from './controllers/users.controller';
import { User, UserSchema } from './schemas/user.schema';
import { UsersService } from './services';
import { AppService } from './services/app.service';
import { ConfigModule } from '@nestjs/config';
import { AuthController } from './controllers/auth.controller';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.DATABASE_URL || ''),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [AppController, UserController, AuthController],
  providers: [AppService, UsersService],
})
export class AppModule {}
