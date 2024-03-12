// const fs = require("fs");
import * as sdk from "microsoft-cognitiveservices-speech-sdk";
let transcription = ""; // Variable to store the transcription

const SPEECH_KEY = '777c75ce17384fed960da55e553b832e'
const SPEECH_REGION = 'australiaeast'
const speechConfig = sdk.SpeechConfig.fromSubscription(SPEECH_KEY, SPEECH_REGION);

const StartTranscribe = (dataStream) => {

    let dictionary = {};
    // let audioConfig = sdk.AudioConfig.fromWavFileInput(fs.readFileSync(filename));
    const audioConfig = sdk.AudioConfig.fromStreamInput(dataStream);
    const conversationTranscriber = new sdk.ConversationTranscriber(speechConfig, audioConfig);



    console.log("Transcribing: ");

    conversationTranscriber.sessionStarted = function (s, e) {
        console.log("SessionStarted event");
        console.log("SessionId:" + e.sessionId);
    };
    conversationTranscriber.sessionStopped = function (s, e) {
        console.log("SessionStopped event");
        console.log("SessionId:" + e.sessionId);
        conversationTranscriber.stopTranscribingAsync();
    };
    conversationTranscriber.canceled = function (s, e) {
        console.log("Canceled event");
        console.log(e.errorDetails);
        conversationTranscriber.stopTranscribingAsync();
        dictionary['transcription'] = transcription;
        console.log(dictionary.transcription);
    };
    conversationTranscriber.transcribed = function (s, e) {
        transcription += e.result.text + "\n";
        console.log("TRANSCRIBED: Text=" + e.result.text + " Speaker ID=" + e.result.speakerId);
        // console.log("TRANSCRIBED: Text=" + transcription);
    };

    // Start conversation transcription
    conversationTranscriber.startTranscribingAsync(
        function () { },
        function (err) {
            console.trace("err - starting transcription: " + err);
        }
    );
    // console.log(conversationTranscriber);
    return conversationTranscriber;

}

const StopTranscribe = (conversationTranscriber) => {
    // console.log(conversationTranscriber);
    //stop conversation transcription
    conversationTranscriber.stopTranscribingAsync(
        function () { console.log("Transcription stopped."); },
        function (err) { console.trace("err - stopping transcription: " + err); }
    );
}

export { StartTranscribe, StopTranscribe };

