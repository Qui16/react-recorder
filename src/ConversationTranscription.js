// const fs = require("fs");
import * as sdk from "microsoft-cognitiveservices-speech-sdk";
let transcription = ""; // Variable to store the transcription

const SPEECH_KEY = '777c75ce17384fed960da55e553b832e'
const SPEECH_REGION = 'australiaeast'
const speechConfig = sdk.SpeechConfig.fromSubscription(SPEECH_KEY, SPEECH_REGION);






const fromStream = (dataStream) => {

    let dictionary = {};
    const pushStream = sdk.AudioInputStream.createPushStream();
    // let audioConfig = sdk.AudioConfig.fromWavFileInput(fs.readFileSync(filename));
    const audioConfig = sdk.AudioConfig.fromStreamInput(dataStream);
    const conversationTranscriber = new sdk.ConversationTranscriber(speechConfig, audioConfig);
    // dataStream.on('data', function (arrayBuffer) {
    //     pushStream.write(arrayBuffer.slice());
    // }).on('end', function () {
    //     pushStream.close();
    // });



    // fs.createReadStream(filename).on('data', function(arrayBuffer) {
    //     pushStream.write(arrayBuffer.slice());
    // }).on('end', function() {
    //     pushStream.close();
    // });

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
        // console.log(transcription);
        // const transcriptionJson = JSON.stringify(transcription, null, 2);
        // Console.log('json',transcriptionJson);
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

    return dictionary;

}

export default fromStream;

