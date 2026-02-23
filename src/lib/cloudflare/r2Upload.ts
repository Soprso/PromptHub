import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const accountId = import.meta.env.VITE_R2_ACCOUNT_ID;
const accessKeyId = import.meta.env.VITE_R2_ACCESS_KEY_ID;
const secretAccessKey = import.meta.env.VITE_R2_SECRET_ACCESS_KEY;
const bucketName = import.meta.env.VITE_R2_BUCKET_NAME;
const publicUrlBase = import.meta.env.VITE_R2_PUBLIC_URL;

if (!accountId || !accessKeyId || !secretAccessKey || !bucketName || !publicUrlBase) {
    console.warn("Cloudflare R2 environment variables are incomplete. Uploads may fail.");
}

const s3Client = new S3Client({
    region: 'auto',
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: {
        accessKeyId: accessKeyId || '',
        secretAccessKey: secretAccessKey || '',
    },
});

export async function r2Upload(file: File): Promise<string> {
    const allowedTypes = ['image/png', 'image/jpeg', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
        throw new Error('Invalid file type. Only PNG, JPEG, and WEBP are allowed.');
    }

    const maxSize = 5 * 1024 * 1024; // 5MB limit
    if (file.size > maxSize) {
        throw new Error('File exceeds the 5MB size limit.');
    }

    const timestamp = Date.now();
    const extension = file.name.split('.').pop() || 'png';
    const fileName = `image-of-day-${timestamp}.${extension}`;

    const arrayBuffer = await file.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);

    const command = new PutObjectCommand({
        Bucket: bucketName,
        Key: fileName,
        Body: buffer,
        ContentType: file.type,
    });

    await s3Client.send(command);

    // Remove trailing slashes if they exist and construct the final URL
    const baseUrl = publicUrlBase?.replace(/\/+$/, '') || '';
    return `${baseUrl}/${fileName}`;
}
