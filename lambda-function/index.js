const { S3Client, GetObjectCommand, PutObjectCommand } = require('@aws-sdk/client-s3');
const sharp = require('sharp');

exports.handler = (event) => {
    // Get new object key from event object
    const sourceKey = event.Records[0].s3.object.key

    // Checks if key begins with "thumbnail/", i.e. is already a thumbnail, returns if true
    if (sourceKey.startsWith('thumbnails/')) {
        console.log('Image is already a thumbnail');
        return
    }

    // Instantiate a new S3 client.
    const s3Client = new S3Client({
        region: 'us-east-1'
    })

    // Create params to get object
    const getObjectParams = {
        Bucket: 'img-bucket-cf',
        Key: `${sourceKey}`
    }

    // Get object from bucket
    s3Client.send(new GetObjectCommand(getObjectParams))
        .then(async (stream) => {
            // Convert stream of object data to buffer (for sharp compatibility)
            return await streamToBuffer(stream.Body);
        }).then(async (buffer) => {
            // Resize image from buffer using sharp, make sure it is type jpeg
            return await sharp(buffer)
                .resize({
                    width: 100,
                    withoutEnlargement: true,
                })
                .toFormat('jpeg');
        }).then(async (resized) => {
            // Convert sharp object to buffer for upload
            return await resized.toBuffer();
        }).then((data) => {
            // Create params to upload object to bucket with thumbnails/ prefix
            const putObjectParams = {
                Bucket: 'img-bucket-cf',
                Key: `thumbnails/${sourceKey.substring(5)}`,
                Body: data
            }
            // Put object in bucket
            return s3Client.send(new PutObjectCommand(putObjectParams));
        }).catch(err => console.log(`${err} | error!`));
}

// Converts given stream to a buffer (for sharp compatability)
const streamToBuffer = (stream) => {
    return new Promise((resolve, reject) => {
        const chunks = [];
        stream.on("data", (chunk) => chunks.push(chunk));
        stream.on("error", reject);
        stream.on("end", () => resolve(Buffer.concat(chunks)));
    });
};