import React, { useState, useRef, useEffect } from 'react';
import './App.css';
import RecordRTC, { invokeSaveAsDialog } from 'recordrtc';
import recorderConfig from './recorderConfig.js';
import { StartTranscribe, StopTranscribe } from './ConversationTranscription.js';
import uploadBlob from './BlobStorage.js';
import AudioRecorder from './AudioRecorder.jsx';


function App() {


  return (
    <>
      <AudioRecorder />
    </>
  );
}

export default App;