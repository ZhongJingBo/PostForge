import { IsNotEmpty } from 'class-validator';

export class CreatePostDto {
  @IsNotEmpty({ message: '文章标题不能为空' })
  title: string;

  @IsNotEmpty({ message: '文章内容不能为空' })
  content: string;
}
