import { useReactMediaRecorder } from "react-media-recorder";

interface RecordAudioProps {
  onCompleteRecording: (url: string) => void;
  onStartRecording?: () => void;
  onStopRecording?: () => void;
}

function RecordAudio({ onCompleteRecording }: RecordAudioProps) {
  const { status, startRecording, stopRecording, mediaBlobUrl } =
    useReactMediaRecorder({ audio: true, video: false, screen: false });

  const onStart = () => {
    startRecording();
  };

  const onStop = () => {
    stopRecording();
    console.log("jere");
    if (mediaBlobUrl) {
      onCompleteRecording(mediaBlobUrl);
    }
  };

  return (
    <>
      <p>{status}</p>
      <div className="join">
        <button
          className="btn btn-success join-item"
          disabled={status === "recording"}
          onClick={() => onStart()}
        >
          Start
        </button>
        <button
          className="btn btn-error join-item"
          disabled={status !== "recording"}
          onClick={() => onStop()}
        >
          Stop
        </button>
      </div>
    </>
  );
}

export default RecordAudio;
