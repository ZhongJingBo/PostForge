import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Req,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { SetMetadata } from '@nestjs/common';
import { Request } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  /**
   * 创建文章
   * @param createPostDto 创建文章dto
   * @param req 请求对象
   * @returns 文章
   */
  @Post('create')
  @SetMetadata('require-login', true)
  @SetMetadata('require-permission', ['ADMIN'])
  async create(@Body() createPostDto: CreatePostDto, @Req() req: Request) {
    return this.postService.create(createPostDto, req.user.userId);
  }

  /**
   * 获取用户发布的文章列表
   * @param req 请求对象
   * @returns 文章列表
   */
  @Get('list')
  @SetMetadata('require-login', true)
  async list(@Req() req: Request) {
    return this.postService.list(req.user.userId);
  }

  /**
   * 获取固定列表
   * @param userId 用户id
   * @returns 固定列表
   */
  @Get('fixedlist/:userId')
  async fixedlist(@Param('userId') userId: number) {
    return this.postService.list(userId);
  }

  /**
   * 获取文章详情
   * @param id 文章id
   * @returns 文章详情
   */
  @Get('detail/:id')
  async detail(@Param('id') id: string) {
    return this.postService.detail(id);
  }

  /**
   * 删除文章
   * @param id 文章id
   * @returns 删除结果
   */
  @Get('deleteNote/:id')
  @SetMetadata('require-login', true)
  @SetMetadata('require-permission', ['ADMIN'])
  async delete(@Param('id') id: string) {
    console.log(id, 'id 删除');
    return this.postService.delete(id);
  }

  @Post('updateNote/:id')
  @SetMetadata('require-login', true)
  @SetMetadata('require-permission', ['ADMIN'])
  async update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postService.update(id, updatePostDto);
  }

  /**
   * 上传 Markdown 文件并保存为文章
   * @param file 上传的文件
   * @param body 请求体
   * @returns 保存的文章
   */
  @Post('uploadNote')
  @SetMetadata('require-login', true)
  @SetMetadata('require-permission', ['ADMIN'])
  @UseInterceptors(FileInterceptor('file'))
  async uploadNote(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: Request,
  ) {
    return this.postService.uploadNote(file, req.user.userId);
  }


  // 更改PostStatus 状态 
  @Post('updateStatus/:id')
  @SetMetadata('require-login', true)
  @SetMetadata('require-permission', ['ADMIN'])
  async updateStatus(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postService.updateStatus(id, updatePostDto);
  }
}
