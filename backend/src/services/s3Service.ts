import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { S3_CONFIG } from '../config/s3Config';

class S3Service {
  private s3Client: S3Client;

  constructor() {
    this.s3Client = new S3Client({
      region: S3_CONFIG.region,
      credentials: {
        accessKeyId: S3_CONFIG.accessKeyId,
        secretAccessKey: S3_CONFIG.secretAccessKey,
      },
    });
  }

  /**
   * Generate a pre-signed URL for uploading a file
   * @param key - The key (path) where the file will be stored in S3
   * @param contentType - The content type of the file
   * @param fileType - Either 'image' or 'audio'
   */
  async generateUploadUrl(key: string, contentType: string, fileType: 'image' | 'audio'): Promise<string> {
    // Validate content type
    const allowedTypes = fileType === 'image' ? S3_CONFIG.allowedImageTypes : S3_CONFIG.allowedAudioTypes;
    if (!allowedTypes.includes(contentType)) {
      throw new Error(`Invalid content type. Allowed types for ${fileType}: ${allowedTypes.join(', ')}`);
    }

    const command = new PutObjectCommand({
      Bucket: S3_CONFIG.bucket,
      Key: key,
      ContentType: contentType,
    });

    try {
      const signedUrl = await getSignedUrl(this.s3Client, command, {
        expiresIn: S3_CONFIG.urlExpirationTime,
      });
      return signedUrl;
    } catch (error) {
      if (error instanceof Error)
        throw new Error(`Failed to generate pre-signed PUT URL: ${error.message}`);
      else
        throw new Error('Failed to generate pre-signed PUT URL: Unknown error');
    }
  }

  /**
   * Get a file URL from S3
   * @param key - The key (path) of the file to get
   */
  async generateFileUrl(key: string): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: S3_CONFIG.bucket,
      Key: key
    })

    try {
      const signedUrl = await getSignedUrl(this.s3Client, command, {
        expiresIn: S3_CONFIG.urlExpirationTime,
      });

      return signedUrl;
    } catch (error) {
      if (error instanceof Error)
        throw new Error(`Failed to generate pre-signed GET URL: ${error.message}`);
      else
        throw new Error('Failed to generate pre-signed PUT URL: Unknown error');
    }
  }

  /**
   * Delete a file from S3
   * @param key - The key (path) of the file to delete
   */
  async deleteFile(key: string): Promise<void> {
    const command = new DeleteObjectCommand({
      Bucket: S3_CONFIG.bucket,
      Key: key,
    });

    try {
      await this.s3Client.send(command);
    } catch (error) {
      if (error instanceof Error)
        throw new Error(`Failed to delete file: ${error.message}`);
      else
        throw new Error('Failed to generate pre-signed PUT URL: Unknown error');
    }
  }

  /**
   * Generate a unique key for a file
   * @param userId - The ID of the user uploading the file
   * @param fileType - The type of file (image or audio)
   * @param fileName - Original file name
   */
  generateKey(userId: string, fileType: 'image' | 'audio', fileName: string): string {
    const timestamp = Date.now();
    const extension = fileName.split('.').pop();
    return `${fileType}s/${userId}/${timestamp}-${Math.random().toString(36).substring(2, 15)}.${extension}`;
  }
}

export const s3Service = new S3Service(); 