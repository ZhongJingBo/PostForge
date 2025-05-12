import { Inject, Injectable } from '@nestjs/common';
import * as Minio from 'minio';

@Injectable()
export class MinioService {
    constructor(
        @Inject('MINIO_CLIENT')
        private minioClient: Minio.Client
    ) {}

    async listBuckets() {
        return this.minioClient.listBuckets();
    }

    async listBucketObjects(bucketName: string) {
        return new Promise((resolve, reject) => {
            const objectsList: any[] = [];
            const stream = this.minioClient.listObjects(bucketName, '', true);
            
            stream.on('data', (obj) => {
                objectsList.push({
                    name: obj.name,
                    size: obj.size,
                    lastModified: obj.lastModified
                });
            });
            
            stream.on('end', () => {
                resolve(objectsList);
            });
            
            stream.on('error', (err) => {
                reject(err);
            });
        });
    }
}
