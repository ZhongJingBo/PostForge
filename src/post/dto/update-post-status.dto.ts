import { PostStatus } from '../entities/post.entity';
import { IsEnum, IsNotEmpty } from 'class-validator';



export class UpdatePostStatusDto {
  @IsNotEmpty({ message: '状态不能为空' })
  @IsEnum(PostStatus, { message: '无效的状态值' })
  status: PostStatus;
}