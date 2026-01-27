"use client";

import { useState } from "react";

export default function AnalyzePage() {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState("");

  async function sendToBackend() {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch(
      process.env.NEXT_PUBLIC_API_URL + "/analyze",
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await res.json();
    setResult(data.summary);
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Upload File</h1>

      <input type="file" onChange={(e) => setFile(e.target.files![0])} />

      <br /><br />

      <button onClick={sendToBackend}>Send to backend</button>

      <pre>{result}</pre>
    </div>
  );
}
