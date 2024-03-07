const { BlobServiceClient } = require("@azure/storage-blob");
const { v1: uuidv1 } = require("uuid");
const fs = require('fs');
require("dotenv").config();
const { fromFile } = require('./ConversationTranscription');
async function main() {
    try {
        console.log("Azure Blob storage v12 - JavaScript quickstart sample");
        const AZURE_STORAGE_CONNECTION_STRING = process.env.AZURE_STORAGE_CONNECTION_STRING;

        // Create the BlobServiceClient object which will be used to create a container client
        const blobServiceClient = BlobServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING);

        // Get a reference to a container
        const containerName = 'audiofiles';
        const containerClient = blobServiceClient.getContainerClient(containerName);

        // Quick start code goes here
        // Create a unique name for the blob
        const blobName = 'user_audio.wav';

        // Get a block blob client
        const blockBlobClient = containerClient.getBlockBlobClient(blobName);

        // Read data from a file
        const data = fs.readFileSync('./user_audio.wav');

        // Upload data to the blob
        const uploadBlobResponse = await blockBlobClient.upload(data, data.length);
        console.log(
            `Blob was uploaded successfully. requestId: ${uploadBlobResponse.requestId}`
        );

        // Download the blob
        const downloadBlockBlobResponse = await blockBlobClient.download(0);
        const downloaded = await streamToBuffer(downloadBlockBlobResponse.readableStreamBody);

        // Write the data to a file
        fs.writeFileSync('./downloaded_audio.wav', downloaded);
        
        console.log('Blob was downloaded successfully');
        
        fromFile('downloaded_audio.wav');
    } catch (err) {
        console.error(`Error: ${err.message}`);
    }
}

async function streamToBuffer(readableStream) {
    return new Promise((resolve, reject) => {
        const chunks = [];
        readableStream.on("data", (data) => {
            chunks.push(data instanceof Buffer ? data : Buffer.from(data));
        });
        readableStream.on("end", () => {
            resolve(Buffer.concat(chunks));
        });
        readableStream.on("error", reject);
    });
}

main()
    .then(() => console.log("Done"))
    .catch((ex) => console.log(ex.message));