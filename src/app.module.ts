import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppConfigModule } from './config/app-config.module';
import { AppConfigService } from './config/app-config.service';
import { AuthModule } from './modules/auth/auth.module';
import { CategoryModule } from './modules/category/category.module';
import { PostModule } from './modules/post/post.module';
import { FileModule } from './modules/file/file.module';
import { EmailModule } from './modules/email/email.module';

@Module({
  imports: [
    AppConfigModule,
    MongooseModule.forRootAsync({
      inject: [AppConfigService],
      useFactory: (configService: AppConfigService) => ({
        uri: configService.mongoConnectionUrl,
      }),
    }),
    AuthModule,
    CategoryModule,
    PostModule,
    FileModule,
    EmailModule,
  ],
})
export class AppModule {}
