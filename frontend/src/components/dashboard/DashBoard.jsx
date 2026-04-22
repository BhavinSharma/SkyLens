import { Link } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import PageLayout from "../layout/PageLayout.jsx";
import useAuth from "../../hooks/useAuth.js";
import api from "../../Services/api.js";

function Dashboard() {
  const { user } = useAuth();
  const [detections, setDetections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDetections = async () => {
      try {
        const response = await api.get("/detection/all");
        setDetections(response.data.detections || []);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchDetections();
  }, []);

  const totalPeople = detections.reduce(
    (sum, item) => sum + (item.counts?.people ?? 0),
    0
  );

  const totalVehicles = detections.reduce(
    (sum, item) => sum + (item.counts?.vehicles ?? 0),
    0
  );

  const recentDetections = detections.slice(0, 5);

  const chartData = useMemo(() => {
    const days = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);

      const key = date.toLocaleDateString("en-CA");
      days.push({
        date: key,
        people: 0,
        vehicles: 0,
      });
    }

    detections.forEach((item) => {
      const itemDate = new Date(item.createdAt).toLocaleDateString("en-CA");
      const day = days.find((d) => d.date === itemDate);

      if (day) {
        day.people += item.counts?.people ?? 0;
        day.vehicles += item.counts?.vehicles ?? 0;
      }
    });

    return days;
  }, [detections]);

  const maxPeople = Math.max(
    ...chartData.map((item) => Math.max(item.people, item.vehicles)),
    1
  );

  if (loading) {
    return (
      <PageLayout>
        <div className="page-header">
          <div>
            <h1 className="page-title">Monitoring Overview</h1>
            <div className="page-meta">Loading dashboard data...</div>
          </div>
        </div>
      </PageLayout>
    );
  }

  if (error) {
    return (
      <PageLayout>
        <div className="page-header">
          <div>
            <h1 className="page-title">Monitoring Overview</h1>
            <div className="page-meta">Dashboard connection error</div>
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
          <h1 className="page-title">Monitoring Overview</h1>
          <div className="page-meta">
            {user?.company || "SkyLens Operations"} · Live dashboard
          </div>
        </div>

        <div className="badge">
          <span className="badge-dot"></span>
          SYSTEM ACTIVE
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card blue">
          <div className="stat-icon blue">P</div>
          <div className="stat-label">People Detected</div>
          <div className="stat-value">{totalPeople}</div>
          <div className="stat-change">From all uploaded detections</div>
        </div>

        <div className="stat-card purple">
          <div className="stat-icon purple">V</div>
          <div className="stat-label">Vehicles Detected</div>
          <div className="stat-value">{totalVehicles}</div>
          <div className="stat-change">From all uploaded detections</div>
        </div>

        <div className="stat-card green">
          <div className="stat-icon green">M</div>
          <div className="stat-label">Mission Status</div>
          <div className="stat-value">{detections.length}</div>
          <div className="stat-change">Total processed uploads</div>
        </div>
      </div>

      <div className="grid-2">
        <div className="card">
          <div className="card-title">Quick Actions</div>

          <div className="quick-links">
            <Link to="/upload" className="quick-link-item">
              <div className="quick-link-icon upload">UP</div>
              <div>
                <div className="quick-link-label">New Upload</div>
                <div className="quick-link-sub">Process a drone image</div>
              </div>
            </Link>

            <Link to="/history" className="quick-link-item">
              <div className="quick-link-icon history">HS</div>
              <div>
                <div className="quick-link-label">Detection History</div>
                <div className="quick-link-sub">Browse past results</div>
              </div>
            </Link>
          </div>
        </div>

        <div className="card">
          <div className="card-title">
            7-Day Activity
            <span className="chart-title-note">PEOPLE / VEHICLES</span>
          </div>

          <div className="chart-area">
            {chartData.map((item, index) => (
              <div key={index} className="chart-col">
                <div className="chart-pair">
                  <div
                    className="bar people"
                    style={{ height: `${(item.people / maxPeople) * 80}%` }}
                  ></div>
                  <div
                    className="bar vehicles"
                    style={{ height: `${(item.vehicles / maxPeople) * 80}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          <div className="chart-legend">
            <span className="legend-people">People</span>
            <span className="legend-vehicles">Vehicles</span>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-title">Recent Detections</div>

        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Location</th>
              <th>People</th>
              <th>Vehicles</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {recentDetections.map((item) => (
              <tr key={item._id}>
                <td className="td-date">
                  {new Date(item.createdAt).toLocaleDateString()}
                </td>
                <td className="td-location">{item.missionName || "Untitled"}</td>
                <td className="td-num td-people">{item.counts?.people ?? 0}</td>
                <td className="td-num td-vehicles">{item.counts?.vehicles ?? 0}</td>
                <td>
                  <span className="status-chip">{item.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </PageLayout>
  );
}

export default Dashboard;