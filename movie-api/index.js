const { S3Client, ListObjectsV2Command, GetObjectCommand, PutObjectCommand } = require('@aws-sdk/client-s3');
const fileUpload = require('express-fileupload');

app.use(fileUpload());

// Initiate client w configuration (region, credentials)
const s3Client = new S3Client({
    region: 'us-east-1'
});

// Initiate command w input params
const listObjectsParams = {
    Bucket: 'img-bucket-cf'
};

// Get list of images in bucket (file names)
app.get('/images', (req, res) => {
    s3Client.send(new ListObjectsV2Command(listObjectsParams))
        .then((listObjectsResponse) => {
            res.json(listObjectsResponse)
        });
});

// Get object from bucket by object (file) name
app.get('/images/:key', async (req, res) => {
    const getObjectParams = {
        Bucket: 'img-bucket-cf',
        Key: req.params.key,
    };

    const { Body } = await s3Client.send(new GetObjectCommand(getObjectParams));
    res.writeHead(200, {
        'Content-Type': 'image/jpeg; charset=UTF-8',
    });

    Body.pipe(res);
});

// Upload file (image) to the bucket
app.post('/images', (req, res) => {
    // Make sure there is a file in the request body to upload
    if (!req.files) {
        return res.status(400).send("No files were uploaded.");
    }

    const file = req.files.image;
    console.log(`Uploading file: ${file.name}`);

    // Upload image with orig/ prefix
    const putObjectParams = {
        Bucket: 'img-bucket-cf',
        Key: `orig/${file.name}`,
        Body: file.data
    }

    s3Client.send(new PutObjectCommand(putObjectParams))
        .then(() => {
            res.status(200).send('File uploaded');
        });
});