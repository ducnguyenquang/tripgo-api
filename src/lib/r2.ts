import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const endpoint = process.env.R2_ENDPOINT ?? "";
const accessKey = process.env.R2_ACCESS_KEY ?? "";
const secretKey = process.env.R2_SECRET_KEY ?? "";
const bucket = process.env.R2_BUCKET ?? "";

const client = new S3Client({
  region: "auto",
  endpoint,
  credentials: { accessKeyId: accessKey, secretAccessKey: secretKey },
});

export async function uploadFile(
  key: string,
  body: Buffer | Uint8Array,
  contentType?: string
): Promise<string> {
  await client.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: body,
      ContentType: contentType,
    })
  );
  return getFileUrl(key);
}

export async function getFileUrl(key: string): Promise<string> {
  const command = new GetObjectCommand({ Bucket: bucket, Key: key });
  return getSignedUrl(client, command, { expiresIn: 3600 });
}

export async function deleteFile(key: string): Promise<void> {
  await client.send(new DeleteObjectCommand({ Bucket: bucket, Key: key }));
}
