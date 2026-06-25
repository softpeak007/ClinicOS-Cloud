import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

let s3Client: S3Client | null = null;
let s3Enabled = false;

export function getS3Client(): { client: S3Client | null; enabled: boolean } {
  try {
    const region = process.env.AWS_REGION || "us-east-1";
    const bucket = process.env.AWS_S3_BUCKET_NAME;
    const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
    const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

    if (
      bucket && 
      !bucket.includes("clinical-records-lockbox-production") && 
      accessKeyId && 
      !accessKeyId.includes("AKIAIOSFODNN7EXAMPLE") &&
      secretAccessKey &&
      !secretAccessKey.includes("wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY")
    ) {
      if (!s3Client) {
        s3Client = new S3Client({
          region,
          credentials: {
            accessKeyId,
            secretAccessKey,
          },
        });
      }
      s3Enabled = true;
    }
  } catch (error) {
    console.error("⚠️ S3 Client initialization failed, falling back to local simulation mode:", error);
    s3Enabled = false;
  }
  return { client: s3Client, enabled: s3Enabled };
}

export async function generatePresignedUploadUrl(s3Key: string, contentType = "application/pdf"): Promise<string> {
  const { client, enabled } = getS3Client();
  const bucket = process.env.AWS_S3_BUCKET_NAME || "clinical-records-lockbox-production";
  
  if (enabled && client) {
    try {
      const command = new PutObjectCommand({
        Bucket: bucket,
        Key: s3Key,
        ContentType: contentType,
      });
      return await getSignedUrl(client, command, { expiresIn: 3600 });
    } catch (error) {
      console.error("⚠️ AWS S3 presigned upload URL error, simulating...", error);
    }
  }
  // Fallback simulator URL
  return `/api/s3/simulate-upload?key=${encodeURIComponent(s3Key)}`;
}

export async function generatePresignedDownloadUrl(s3Key: string): Promise<string> {
  const { client, enabled } = getS3Client();
  const bucket = process.env.AWS_S3_BUCKET_NAME || "clinical-records-lockbox-production";

  if (enabled && client) {
    try {
      const command = new GetObjectCommand({
        Bucket: bucket,
        Key: s3Key,
      });
      return await getSignedUrl(client, command, { expiresIn: 3600 });
    } catch (error) {
      console.error("⚠️ AWS S3 presigned download URL error, simulating...", error);
    }
  }
  // Fallback simulator URL
  return `/api/s3/simulate-download?key=${encodeURIComponent(s3Key)}`;
}
