/// <reference types="react" />
/// <reference types="react-dom" />

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }

  var SpeechRecognition: any;
  var webkitSpeechRecognition: any;

  interface SpeechRecognitionEvent extends Event {
    results: SpeechRecognitionResultList;
    resultIndex: number;
  }

  interface SpeechRecognitionErrorEvent extends Event {
    error: string;
  }
}

export {};
