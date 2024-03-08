import React, { useState, useRef, useEffect } from 'react';
import './App.css';
import RecordRTC, { invokeSaveAsDialog } from 'recordrtc';
import recorderConfig from './recorderConfig.js';
import fromStream from './ConversationTranscription.js';
// import { AudioRecorder } from './AudioRecorder.jsx';

function App() {
  const [stream, setStream] = useState(null);
  const [blob, setBlob] = useState(null);
  const refAudio = useRef(null);
  const recorderRef = useRef(null);

  const handleRecording = async () => {
    // const cameraStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    const mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true, });

    setStream(mediaStream);
    recorderRef.current = new RecordRTC(mediaStream, recorderConfig);
    recorderRef.current.startRecording();
    fromStream(mediaStream);
  };

  const handleStop = () => {
    recorderRef.current.stopRecording(() => {
      setBlob(recorderRef.current.getBlob());

      // Stop the stream
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
        setStream(null);
      }

    });
  };

  const handleSave = () => {
    invokeSaveAsDialog(blob);
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

export default App;