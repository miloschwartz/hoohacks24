import "./UploadResume.css";
import { useState } from "react";

interface UploadFilesProps {
  onUpload: (file: File | null) => void;
}

function UploadResume({ onUpload }: UploadFilesProps) {
  const [fileName, setFileName] = useState<string>("");
  const [resume, setResume] = useState<string | null>(null);

  // const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
  //   e.preventDefault();
  //
  //   const files = e.dataTransfer.files;
  //   if (files.length) {
  //     setResume(URL.createObjectURL(files[0]));
  //     onUpload(files[0]);
  //     setFileName(files[0].name);
  //   }
  // };
  //
  // const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
  //   e.preventDefault();
  // };

  return (
    <>
      <div>
        {/* <div
          className="w-100 mb-2 drop-area border-dashed border-2 bg-base-300 hover:bg-base-100"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onClick={() => {
            document.querySelector<HTMLInputElement>(".file-input")?.click();
          }}
        >
          Drag & Drop Resume Here
        </div> */}
        <div className="form-control w-100">
          <input
            type="file"
            multiple={false}
            className="file-input file-input-bordered w-full"
            accept=".pdf,.png,.jpeg,.jpg"
            onChange={(e) => {
              const files = e.target.files;
              if (!files) {
                return;
              }
              setResume(URL.createObjectURL(files[0]));
              setFileName(files[0].name);
              onUpload(files[0]);
            }}
          />
        </div>
      </div>
    </>
  );
}

export default UploadResume;
