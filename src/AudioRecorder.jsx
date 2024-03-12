import React, { useState, useRef, useEffect } from 'react';
import RecordRTC, { invokeSaveAsDialog } from 'recordrtc';
import recorderConfig from './recorderConfig.js';
import { StartTranscribe, StopTranscribe } from './ConversationTranscription.js';
import uploadBlob from './BlobStorage.js';

const AudioRecorder = () => {
    const [stream, setStream] = useState(null);
    const [blob, setBlob] = useState(null);
    const refAudio = useRef(null);
    const recorderRef = useRef(null);
    const conversationTranscriberRef = useRef(null); // Use useRef to persist the variable

    const handleRecording = async () => {
        // const cameraStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        const mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true, });

        setStream(mediaStream);
        recorderRef.current = new RecordRTC(mediaStream, recorderConfig);
        recorderRef.current.startRecording();

        // Start the transcription and store the ConversationTranscriber object
        conversationTranscriberRef.current = StartTranscribe(mediaStream);
    };

    const handleStop = () => {
        recorderRef.current.stopRecording(() => {
            const blob = recorderRef.current.getBlob();
            setBlob(blob);
            StopTranscribe(conversationTranscriberRef.current);
        });
    };

    const handleSave = () => {
        // invokeSaveAsDialog(blob);
        const formData = new FormData();
        formData.append('file', blob);

        fetch('http://localhost:3000/upload', {
            method: 'POST',
            body: formData
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.text();
            })
            .then(data => {
                console.log('File uploaded to Azure Blob Storage:', data);
            })
            .catch(error => {
                console.error('Error uploading file to Azure Blob Storage:', error);
            });
    };

    useEffect(() => {
        if (!refAudio.current) {
            return;
        }

        // refVideo.current.srcObject = stream;
    }, [stream, refAudio]);

    return (
        <div className="App">
            <header className="App-header">
                <button onClick={handleRecording}>start</button>
                <button onClick={handleStop}>stop</button>
                <button onClick={handleSave}>save</button>
                {blob && (
                    <audio
                        src={URL.createObjectURL(blob)}
                        controls
                        autoPlay
                        ref={refAudio}
                        style={{ width: '700px', margin: '1em' }}
                    />
                )}
            </header>
        </div>
    );
}

export default AudioRecorder;