import { Controller, Get, Inject, Query, Param } from '@nestjs/common';
import * as Minio from 'minio';
import { MinioService } from './minio.service';

@Controller('minio')
export class MinioController {
  constructor(private readonly minioService: MinioService) {}

  @Inject('MINIO_CLIENT')
  private minioClient: Minio.Client;

  @Get('presignedUrl')
  presignedPutObject(@Query('name') name: string) {
    return this.minioClient.presignedPutObject('blog-imgs', name, 3600);
  }

  @Get('buckets')
  async listBuckets() {
    return this.minioService.listBuckets();
  }

  @Get('bucket/:bucketName')
  async listBucketObjects(@Param('bucketName') bucketName: string) {
    return this.minioService.listBucketObjects(bucketName);
  }
}
