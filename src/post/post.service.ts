import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post, PostStatus } from './entities/post.entity';
import { UpdatePostStatusDto } from './dto/update-post-status.dto';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
  ) {}

  async create(createPostDto: CreatePostDto, userId: number) {
    const post = new Post();
    post.title = createPostDto.title;
    post.content = createPostDto.content;
    post.status = PostStatus.DRAFT;
    post.slug = this.generateSlug(createPostDto.title);
    post.categoryId = '1'; // 默认分类，后续可以通过参数传入
    post.userId = userId;

    return await this.postRepository.save(post);
  }

  private generateSlug(title: string): string {
    // 生成一个基于标题的 URL 友好的 slug
    return (
      title
        .toLowerCase()
        .replace(/[^a-zA-Z0-9\s]/g, '')
        .replace(/\s+/g, '-') +
      '-' +
      Date.now()
    );
  }

  // 获取用户发布的文章列表 不返回文章内容
  async list(userId: number) {
    return await this.postRepository.find({
      where: {
        userId,
      },
      select: ['id', 'title', 'createdAt', 'updatedAt'],
      order: {
        createdAt: 'DESC', // 按创建时间降序排序
      },
    });
  }

  // 获取文章详情
  async detail(id: string) {
    return await this.postRepository.findOne({
      where: { id: id.toString() },
    });
  }

  // 删除文章
  async delete(id: string) {
    return await this.postRepository.delete(id);
  }

  // 更新文章
  async update(id: string, updatePostDto: UpdatePostDto) {
    return await this.postRepository.update(id, updatePostDto);
  }

  /**
   * 上传 Markdown 文件并保存为文章
   * @param file 上传的文件
   * @param userId 用户ID
   * @returns 保存的文章
   */
  async uploadNote(file: Express.Multer.File, userId: number) {
    const content = file.buffer.toString('utf-8');

    // 处理文件名编码问题
    const title = Buffer.from(file.originalname, 'binary')
      .toString('utf8')
      .replace(/\.md$/, '');

    const post = new Post();
    post.title = title;
    post.content = content;
    post.status = PostStatus.DRAFT;
    post.slug = this.generateSlug(title);
    post.categoryId = '1'; // 默认分类
    post.userId = userId;

    console.log('post', post);
    return await this.postRepository.save(post);
  }

  // 更改PostStatus 状态
  async updateStatus(id: string, updatePostStatusDto: UpdatePostStatusDto) {
    return await this.postRepository.update(id, updatePostStatusDto);
  }

  
}
