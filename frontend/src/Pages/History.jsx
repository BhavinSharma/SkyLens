import React, { useEffect, useState } from "react";
import PageLayout from "../components/layout/PageLayout.jsx";
import api from "../Services/api.js";
import { Trash } from "lucide-react";

function History() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchHistory();
  }, []);


  const fetchHistory = async () => {
    try {
      const response = await api.get("/detection/all");
      setHistory(response.data.detections || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch history");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <PageLayout>
        <div className="page-header">
          <div>
            <h1 className="page-title">Detection History</h1>
            <div className="page-meta">Loading records from the backend...</div>
          </div>
        </div>
      </PageLayout>
    );
  }
 const removeDetectionHandler = async (detectionId) => {
  try {
    await api.delete(`/detection/remove/${detectionId}`);

    // update UI instantly
    setHistory((prev) => prev.filter((item) => item._id !== detectionId));

  } catch (error) {
    console.log(error);
  }
};

  if (error) {
    return (
      <PageLayout>
        <div className="page-header">
          <div>
            <h1 className="page-title">Detection History</h1>
            <div className="page-meta">Backend connection error</div>
          </div>
        </div>
        <div className="card">Error: {error}</div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="page-header">
        <div>
          <h1 className="page-title">Detection History</h1>
          <div className="page-meta">Stored uploads from your backend database</div>
        </div>
      </div>

      {history.length === 0 ? (
        <div className="card">No uploads found yet.</div>
      ) : (
        <div className="card">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Mission</th>
                <th>File</th>
                <th>People</th>
                <th>Vehicles</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {history.map((item) => (
                <tr key={item._id}>
                  <td className="td-date">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </td>
                  <td className="td-location">{item.missionName || "Untitled"}</td>
                  <td>{item.originalName}</td>
                  <td className="td-num td-people">{item.counts?.people ?? 0}</td>
                  <td className="td-num td-vehicles">
                    {item.counts?.vehicles ?? 0}
                  </td>
                  <td>
                    <span className="status-chip">{item.status}</span>
                  </td>
                  <td><button
  onClick={() => removeDetectionHandler(item._id)}
  className="delete-btn"
>
  <Trash className="h-4 w-4" />
</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </PageLayout>
  );
}

export default History;
