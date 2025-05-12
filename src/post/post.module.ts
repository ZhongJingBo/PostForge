import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    TypeOrmModule.forFeature([Post]),
    MulterModule.register({
      // 配置内存存储，不保存到磁盘
      storage: undefined,
    }),
  ],
  controllers: [PostController],
  providers: [PostService],
})
export class PostModule {}
