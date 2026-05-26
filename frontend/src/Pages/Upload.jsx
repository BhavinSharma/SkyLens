import { useEffect, useState } from "react";
import PageLayout from "../components/layout/PageLayout.jsx";
import api from "../Services/api.js";

function Upload() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [missionName, setMissionName] = useState("");
  const [notes, setNotes] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [detectionCounts, setDetectionCounts] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files?.[0] || null;

    setSelectedFile(file);
    setStatusMessage("");
    setDetectionCounts(null);

    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setPreviewUrl(imageUrl);
    } else {
      setPreviewUrl("");
    }
  };

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!selectedFile) {
      setStatusMessage("Select an image before starting analysis.");
      return;
    }

    setIsSubmitting(true);
    setStatusMessage("");
    setDetectionCounts(null);

    try {
      const formData = new FormData();
      formData.append("image", selectedFile);
      formData.append("missionName", missionName);
      formData.append("notes", notes);

      const response = await api.post("/detection/upload", formData);

      setStatusMessage(response.data.message || "Upload completed.");

      const counts =
        response.data.counts ||
        response.data.detection?.counts ||
        response.data.result?.counts ||
        null;

      setDetectionCounts({
        people: counts?.people ?? 0,
        vehicles: counts?.vehicles ?? counts?.cars ?? 0,
      });

      setMissionName("");
      setNotes("");
    } catch (error) {
      setStatusMessage(
        error.response?.data?.message || "Upload failed. Check backend auth."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageLayout>
      <div className="page-header">
        <div>
          <h1 className="page-title">Upload Mission Imagery</h1>
          <div className="page-meta">
            Add a file, attach mission context, and send it into the review
            pipeline.
          </div>
        </div>
      </div>

      <div className="upload-grid">
        <div className="card">
          <label className="drop-zone" htmlFor="mission-upload">
            <div className="drop-icon">DL</div>
            <div className="drop-title">Drop a drone image here</div>
            <div className="drop-sub">
              You can also browse from your computer and keep the rest of the
              frontend flow working while backend upload logic is still being
              connected.
            </div>

            <div className="drop-formats">
              <span className="format-tag">JPG</span>
              <span className="format-tag">PNG</span>
              <span className="format-tag">WEBP</span>
            </div>
          </label>

          <input
            id="mission-upload"
            type="file"
            accept="image/*"
            className="hidden-file-input"
            onChange={handleFileChange}
          />

          {selectedFile && (
            <div className="upload-meta">
              Selected: {selectedFile.name} (
              {Math.ceil(selectedFile.size / 1024)} KB)
            </div>
          )}

          {previewUrl && (
            <div className="image-preview-box">
              <img
                src={previewUrl}
                alt="Selected mission preview"
                className="image-preview"
              />
            </div>
          )}

          {detectionCounts && (
            <div className="detection-summary">
              <div className="summary-item">
                <span className="summary-label">People</span>
                <span className="summary-value">{detectionCounts.people}</span>
              </div>

              <div className="summary-item">
                <span className="summary-label">Vehicles</span>
                <span className="summary-value">{detectionCounts.vehicles}</span>
              </div>
            </div>
          )}
        </div>

        <div className="card">
          <div className="card-title">Mission Details</div>

          <form className="upload-form" onSubmit={handleSubmit}>
            <div className="field-group">
              <label className="field-label" htmlFor="mission-name">
                Mission Name
              </label>
              <input
                id="mission-name"
                type="text"
                className="field-input"
                placeholder="Beach patrol scan"
                value={missionName}
                onChange={(event) => setMissionName(event.target.value)}
              />
            </div>

            <div className="field-group">
              <label className="field-label" htmlFor="mission-notes">
                Notes
              </label>
              <textarea
                id="mission-notes"
                className="textarea-input"
                placeholder="Add context for the image, location, or expected detections."
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
              />
            </div>

            <button type="submit" className="btn-primary" disabled={isSubmitting}>
              {isSubmitting ? "Uploading..." : "Start Analysis"}
            </button>
          </form>

          {statusMessage && <div className="upload-meta">{statusMessage}</div>}
        </div>
      </div>
    </PageLayout>
  );
}

export default Upload;