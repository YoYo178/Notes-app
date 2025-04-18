import Env from "@src/common/Env";

export const S3_CONFIG = {
  // Credentials
  region: Env.AwsRegion || 'us-east-2',
  bucket: Env.AwsBucketName || '',
  accessKeyId: Env.AwsAccessKeyId || '',
  secretAccessKey: Env.AwsSecretAccessKey || '',

  // Maximum file sizes in bytes
  maxImageSize: 2 * 1024 * 1024, // 2MB for image files
  maxAudioSize: 10 * 1024 * 1024, // 10MB for audio files

  // Maximum audio duration in seconds
  maxAudioDuration: 60,

  // Allowed file types
  allowedImageTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  allowedAudioTypes: ['audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/webm'],

  // Maximum number of images per user
  maxImagesPerUser: 100,

  // URL expiration time for pre-signed URLs (in seconds)
  urlExpirationTime: 3600, // 1 hour
}; 