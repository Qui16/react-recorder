// server.js

import express from 'express';
import multer from 'multer';
import { BlobServiceClient } from '@azure/storage-blob';
import stream from 'stream';
import cors from 'cors';

const app = express();
app.use(cors()); // Enable CORS
const upload = multer();


app.post('/upload', upload.single('file'), async (req, res) => {
    const AZURE_STORAGE_CONNECTION_STRING = 'DefaultEndpointsProtocol=https;AccountName=audioconversationstorage;AccountKey=ZMI/hWvqIfGx4eU5+pC0nMogJd+flZ36fS67ab6SREPoDVCvTN8rgrEj1HGqtQWchs9hRS/QCOCH+AStICh4mA==;EndpointSuffix=core.windows.net'

    try {
        const blobServiceClient = BlobServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING);
        const containerName = 'audiofiles';
        const containerClient = blobServiceClient.getContainerClient(containerName);
        const blobName = 'user_audio_test.wav';
        const blockBlobClient = containerClient.getBlockBlobClient(blobName);

        const readableStream = new stream.PassThrough();
        readableStream.end(req.file.buffer);

        await blockBlobClient.uploadStream(readableStream);

        res.status(200).send('File uploaded to Azure Blob Storage.');
    } catch (err) {
        console.error(`Error: ${err.message}`);
        res.status(500).send(err.message);
    }
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});