---
title: File Storage
description: 'Pluggable storage adapters for file uploads: local, AWS S3, and Cloudinary'
tags:
  - storage
  - uploads
  - s3
  - cloudinary
status: evergreen
visibility: public
category: deployment
difficulty: intermediate
order: 7
created: '2026-06-11'
---

## Overview

Kickstart now supports pluggable storage adapters for file uploads, enabling deployment to serverless platforms like Vercel and Netlify.

## Storage Providers

### 1. Local (Development Only)

Files are written to the local filesystem in `public/img/`.

**When to use**: Development environment only

**Pros**:
- No external dependencies
- No costs
- Instant setup

**Cons**:
- Does NOT work on Vercel/Netlify (ephemeral filesystem)
- Files not backed up
- No CDN

**Configuration**:
```bash
NUXT_STORAGE_PROVIDER=local
NUXT_LOCAL_STORAGE_DIR=public/img
```

### 2. AWS S3 (Recommended for Production)

Files are uploaded to an AWS S3 bucket.

**When to use**: Production deployments (Vercel, Netlify, any serverless)

**Pros**:
- Reliable, scalable storage
- Works on all serverless platforms
- Can add CloudFront CDN for fast delivery
- Industry standard
- Cost-effective at scale

**Cons**:
- Requires AWS account
- Slightly more complex setup

**Setup**:

1. **Create S3 Bucket**:
   - Go to [S3 Console](https://s3.console.aws.amazon.com/s3/)
   - Create bucket (e.g., `kickstart-uploads-prod`)
   - Region: choose closest to your users
   - **Uncheck** "Block all public access" (we need public read access)
   - Enable "ACLs enabled" under Object Ownership

2. **Add Bucket Policy** (for public read access):
   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Sid": "PublicRead",
         "Effect": "Allow",
         "Principal": "*",
         "Action": "s3:GetObject",
         "Resource": "arn:aws:s3:::YOUR-BUCKET-NAME/*"
       }
     ]
   }
   ```

3. **Create IAM User**:
   - Go to [IAM Console](https://console.aws.amazon.com/iam/)
   - Create user (e.g., `kickstart-uploader`)
   - Attach inline policy:
     ```json
     {
       "Version": "2012-10-17",
       "Statement": [
         {
           "Effect": "Allow",
           "Action": [
             "s3:PutObject",
             "s3:PutObjectAcl",
             "s3:DeleteObject",
             "s3:HeadObject"
           ],
           "Resource": "arn:aws:s3:::YOUR-BUCKET-NAME/*"
         }
       ]
     }
     ```
   - Create access key → save Access Key ID and Secret Access Key

4. **Configure Environment**:
   ```bash
   NUXT_STORAGE_PROVIDER=s3
   NUXT_S3_BUCKET=kickstart-uploads-prod
   NUXT_S3_REGION=us-east-1
   NUXT_S3_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE
   NUXT_S3_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
   ```

5. **Optional: CloudFront CDN**:
   - Create CloudFront distribution pointing to S3 bucket
   - Set `NUXT_S3_PUBLIC_URL=https://d111111abcdef8.cloudfront.net`

**Dependencies**:
```bash
pnpm add @aws-sdk/client-s3
```

### 3. Cloudinary (Alternative to S3)

Files are uploaded to Cloudinary's CDN with built-in image transformations.

**When to use**: Production if you want integrated image transformations

**Pros**:
- All-in-one: storage + CDN + transformations
- Simpler than S3 + CloudFront
- Free tier includes 25GB storage, 25GB bandwidth
- Automatic image optimization
- Built-in transformations (resize, crop, effects)

**Cons**:
- Vendor lock-in
- More expensive at scale than S3
- Less flexible than S3

**Setup**:

1. **Create Account**:
   - Go to [cloudinary.com](https://cloudinary.com)
   - Sign up for free account
   - Find credentials in [Dashboard](https://cloudinary.com/console)

2. **Configure Environment**:
   ```bash
   NUXT_STORAGE_PROVIDER=cloudinary
   NUXT_CLOUDINARY_CLOUD_NAME=your-cloud-name
   NUXT_CLOUDINARY_API_KEY=123456789012345
   NUXT_CLOUDINARY_API_SECRET=abcdefghijklmnopqrstuvwx
   ```

**Dependencies**:
```bash
pnpm add cloudinary
```

## Migration Checklist

### From Local to S3 (for Production)

- [ ] Create S3 bucket with public read access
- [ ] Create IAM user with upload permissions
- [ ] Add AWS credentials to production environment variables
- [ ] Install `@aws-sdk/client-s3` dependency
- [ ] Set `NUXT_STORAGE_PROVIDER=s3`
- [ ] Test upload functionality in staging
- [ ] Optional: Set up CloudFront CDN
- [ ] Update existing file references in database (if needed)

### From Local to Cloudinary (for Production)

- [ ] Create Cloudinary account
- [ ] Add Cloudinary credentials to production environment variables
- [ ] Install `cloudinary` dependency
- [ ] Set `NUXT_STORAGE_PROVIDER=cloudinary`
- [ ] Test upload functionality in staging
- [ ] Update existing file references in database (if needed)

## Usage in Code

The storage adapter is automatically used by `handleFileUpload()`:

```typescript
import { handleFileUpload } from '#server/utils/upload'

export default defineEventHandler(async (event) => {
  const result = await handleFileUpload(event, {
    allowedTypes: ['image/png', 'image/jpeg', 'image/webp'],
    maxSizeBytes: 2097152, // 2MB
    pathPrefix: 'img/teams', // Becomes folder in S3/Cloudinary
    filename: 'team-logo',
    imageOptions: { width: 256, height: 256, format: 'webp' },
  })

  // result.url contains the public URL:
  // Local:      '/img/teams/team-logo.webp'
  // S3:         'https://bucket.s3.region.amazonaws.com/img/teams/team-logo.webp'
  // Cloudinary: 'https://res.cloudinary.com/cloud/image/upload/...'

  return { url: result.url }
})
```

## Cost Estimates

### S3 (us-east-1 pricing as of 2024)
- Storage: $0.023/GB/month
- PUT requests: $0.005 per 1,000 requests
- GET requests: $0.0004 per 1,000 requests
- Data transfer out: First 100 GB/month free, then $0.09/GB

**Example**: 10GB storage + 10,000 uploads/month + 100,000 views/month
= $0.23 + $0.05 + $0.04 + $0 = **$0.32/month**

### Cloudinary Free Tier
- Storage: 25 GB
- Bandwidth: 25 GB/month
- Transformations: 25,000 credits/month
- No credit card required

**Paid Plans** start at $99/month for 97 GB storage + 97 GB bandwidth

### Recommendation

- **Small projects / personal use**: Start with Cloudinary free tier
- **Growing projects**: Use S3 + CloudFront for better scaling economics
- **High traffic**: S3 + CloudFront is significantly cheaper at scale

## Troubleshooting

### "Storage adapter not configured" error
- Check that `NUXT_STORAGE_PROVIDER` is set in environment
- For S3: ensure all S3 credentials are set
- For Cloudinary: ensure all Cloudinary credentials are set

### 403 Forbidden when accessing uploaded files
- **S3**: Check bucket policy allows public read (`s3:GetObject`)
- **S3**: Ensure ACLs are enabled on bucket
- **Cloudinary**: Files are public by default

### Images not appearing after upload
- Check the returned `url` value in API response
- For S3: verify bucket name and region are correct
- For S3 with CloudFront: ensure CloudFront origin is configured correctly
- Check browser console for CORS errors

### AWS SDK import errors in development
- This is expected - S3 adapter is only loaded when `NUXT_STORAGE_PROVIDER=s3`
- The warnings can be safely ignored in dev mode when using local storage

## Database Considerations

If you have existing uploaded files referenced in your database:

1. The field storing file paths now contains URLs:
   - Before: `/img/teams/logo.webp` (relative path)
   - After S3: `https://bucket.s3.amazonaws.com/img/teams/logo.webp` (full URL)
   - After Cloudinary: `https://res.cloudinary.com/.../logo.webp` (full URL)

2. Update your schema/types to reflect this (rename `path` to `url`)

3. For migration, you can:
   - Upload existing files to S3/Cloudinary manually
   - Update database records to point to new URLs
   - Or: serve old files from `public/` and new files from cloud storage
