function TextResponse() {
  return (
    <>
      <textarea
        className="textarea textarea-bordered answer-input w-full"
        style={{ height: "200px" }}
        placeholder="Type your response here"
      ></textarea>
    </>
  );
}

export default TextResponse;
