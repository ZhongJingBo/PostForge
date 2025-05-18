import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FormatResponseInterceptor } from './format-response.interceptor';
import { InvokeRecordInterceptor } from './invoke-record.interceptor';
import { UnloginFilter } from './unlogin.filter';
import { CustomExceptionFilter } from './custom-exception.filter';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  
  app.useGlobalPipes(new ValidationPipe())
  app.useGlobalInterceptors(new FormatResponseInterceptor())
  app.useGlobalInterceptors(new InvokeRecordInterceptor())
  app.useGlobalFilters(new UnloginFilter())
  app.useGlobalFilters(new CustomExceptionFilter())
  // 启用 CORS
  app.enableCors({
    origin: [
      'http://localhost:5173',
      'http://dashpost.zhongzhong.top',
      'https://dashpost.zhongzhong.top',
      'http://www.dashpost.zhongzhong.top',
      'https://www.dashpost.zhongzhong.top',
      'http://www.zhongzhong.top',
      'https://www.zhongzhong.top',
      'http://www.zhongzhong.top',
      'https://www.zhongzhong.top',      
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true, // 允许发送认证信息（cookies）
  });

  await app.listen(configService.get('nest_server_port'));
}
bootstrap();
