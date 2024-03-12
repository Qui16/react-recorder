// BlobStorage.js

import { BlobServiceClient } from '@azure/storage-blob';

const uploadBlob = async (stream) => {
    const AZURE_STORAGE_CONNECTION_STRING = 'DefaultEndpointsProtocol=https;AccountName=audioconversationstorage;AccountKey=ZMI/hWvqIfGx4eU5+pC0nMogJd+flZ36fS67ab6SREPoDVCvTN8rgrEj1HGqtQWchs9hRS/QCOCH+AStICh4mA==;EndpointSuffix=core.windows.net'

    try {
        console.log("Azure Blob storage v12 - JavaScript quickstart sample");

        // const AZURE_STORAGE_CONNECTION_STRING = process.env.AZURE_STORAGE_CONNECTION_STRING;

        // Create the BlobServiceClient object which will be used to create a container client
        // const decodedConnectionString = atob(AZURE_STORAGE_CONNECTION_STRING);
        const blobServiceClient = BlobServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING);



        // Get a reference to a container
        const containerName = 'audiofiles';
        const containerClient = blobServiceClient.getContainerClient(containerName);

        // Create a unique name for the blob
        const blobName = 'user_audio_test.wav';

        const blockBlobClient = containerClient.getBlockBlobClient(blobName);

        // Convert the stream to a blob
        const blob = new Blob([stream]);

        // Upload data to block blob using a readable stream
        await blockBlobClient.uploadData(blob);

    } catch (err) {
        console.error(`Error: ${err.message}`);
    }
}

export default uploadBlob;
