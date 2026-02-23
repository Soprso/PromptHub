import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { parse } from 'lambda-multipart-parser';

export const handler = async (event: any) => {
    if (event.httpMethod !== "POST") {
        return { statusCode: 405, body: "Method Not Allowed" };
    }

    try {
        const result = await parse(event);
        const file = result.files[0];

        if (!file) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: "No file uploaded" })
            };
        }

        const accountId = process.env.R2_ACCOUNT_ID;
        const accessKeyId = process.env.R2_ACCESS_KEY_ID;
        const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
        const bucketName = process.env.R2_BUCKET_NAME;
        const publicUrlBase = process.env.VITE_R2_PUBLIC_URL;

        if (!accountId || !accessKeyId || !secretAccessKey || !bucketName || !publicUrlBase) {
            console.error("Missing R2 configuration in environment variables");
            return {
                statusCode: 500,
                body: JSON.stringify({ error: "Server configuration error" })
            };
        }

        const s3Client = new S3Client({
            region: 'auto',
            endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
            credentials: {
                accessKeyId,
                secretAccessKey,
            },
        });

        const timestamp = Date.now();
        const uniqueId = Math.random().toString(36).substring(2, 15);
        const extension = file.filename.split('.').pop() || 'png';
        const fileName = `image-of-day-${timestamp}-${uniqueId}.${extension}`;

        const command = new PutObjectCommand({
            Bucket: bucketName,
            Key: fileName,
            Body: file.content,
            ContentType: file.contentType,
            CacheControl: "public, max-age=31536000, immutable",
        });

        await s3Client.send(command);

        const baseUrl = publicUrlBase.replace(/\/+$/, '');
        const r2Url = `${baseUrl}/${fileName}`;

        return {
            statusCode: 200,
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ url: r2Url })
        };

    } catch (error: any) {
        console.error("R2 Upload error:", error);
        return {
            statusCode: 500,
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ error: error?.message || "Failed to upload image" })
        };
    }
};
