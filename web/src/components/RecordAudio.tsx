import { useEffect, useState } from "react";
import { useReactMediaRecorder } from "react-media-recorder";

interface RecordAudioProps {
  onCompleteRecording: (url: string) => void;
}

function RecordAudio({ onCompleteRecording }: RecordAudioProps) {
  const [showMedia, setShowMedia] = useState(true);
  const [isRecording, setIsRecording] = useState(false);

  const { status, startRecording, stopRecording, mediaBlobUrl } =
    useReactMediaRecorder({ audio: true, video: false, screen: false });

  return (
    <>
      <p>{status}</p>
      <div className="join">
        <button
          className="btn btn-success join-item"
          disabled={isRecording}
          onClick={() => {
            startRecording();
            setIsRecording(true);
          }}
        >
          Start Recording
        </button>
        <button
          className="btn btn-error join-item"
          disabled={!isRecording}
          onClick={() => {
            stopRecording();
            setIsRecording(false);
            setShowMedia(true);
          }}
        >
          Stop Recording
        </button>
      </div>

      {showMedia && <audio src={mediaBlobUrl} controls></audio>}

      <button
        className="btn btn-accent"
        onClick={() => {
          if (mediaBlobUrl) {
            onCompleteRecording(mediaBlobUrl);
          }
        }}
      >
        Upload to S3
      </button>
    </>
  );
}

export default RecordAudio;
