import { useEffect, useState } from "react";
import { Card, Col, Row, Spinner } from "react-bootstrap";
import { useSelector } from "react-redux";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Bar,
  LabelList,
} from "recharts";

const COLORS = ["#007bff", "#28a745", "#ffc107", "#dc3545", "#6610f2", "#20c997"];

const AdminStats = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const apiUrl = import.meta.env.VITE_API_URL;
  const token = useSelector((state) => state.auth.token);

  const fetchLogs = async () => {
    try {
      const res = await fetch(`${apiUrl}api/focus-field/log/user/logs`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Errore nella risposta del server");

      const data = await res.json();
      setLogs(data);
    } catch (err) {
      console.error("Errore nel fetch dei log:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  if (loading) return <Spinner animation="border" variant="primary" />;

  const totalSessions = logs.length;
  const completedSessions = logs.filter((log) => log.completed).length;
  const incompleteSessions = logs.filter((log) => !log.completed).length;
  const avgDuration =
    logs.reduce((sum, log) => sum + (log.durationSeconds || 0), 0) /
    (logs.filter((l) => l.durationSeconds !== null).length || 1);
  const authenticatedSessions = logs.filter((log) => log.userId !== null).length;
  const anonymousSessions = logs.filter((log) => log.userId === null).length;
  const uniqueUsers = new Set(logs.map((log) => log.userId).filter((id) => id !== null)).size;

  const moodDistribution = logs.reduce((acc, log) => {
    const mood = log.moodSlug || "unknown";
    acc[mood] = (acc[mood] || 0) + 1;
    return acc;
  }, {});
  const moodData = Object.entries(moodDistribution).map(([mood, value]) => ({ name: mood, value }));

  const moodDurations = Object.entries(
    logs.reduce((acc, log) => {
      if (log.durationSeconds !== null) {
        acc[log.moodSlug] = acc[log.moodSlug] || [];
        acc[log.moodSlug].push(log.durationSeconds);
      }
      return acc;
    }, {})
  ).map(([mood, durations]) => ({
    name: mood,
    avg: durations.reduce((a, b) => a + b, 0) / durations.length,
  }));

  const moodCompletion = Object.entries(
    logs.reduce((acc, log) => {
      acc[log.moodSlug] = acc[log.moodSlug] || { total: 0, completed: 0 };
      acc[log.moodSlug].total += 1;
      if (log.completed) acc[log.moodSlug].completed += 1;
      return acc;
    }, {})
  ).map(([mood, val]) => ({
    name: mood,
    percent: (val.completed / val.total) * 100,
  }));

  return (
    <>
      <Row className="mb-4">
        <Col md={4}>
          <Card className="text-center shadow-sm">
            <Card.Body>
              <h5>Totale Sessioni</h5>
              <h2>{totalSessions}</h2>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="text-center shadow-sm">
            <Card.Body>
              <h5>Durata Media (s)</h5>
              <h2>{Math.round(avgDuration)}</h2>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="text-center shadow-sm">
            <Card.Body>
              <h5>Sessioni Completate</h5>
              <h2>
                {completedSessions} ({Math.round((completedSessions / totalSessions) * 100)}%)
              </h2>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col md={4}>
          <Card className="text-center shadow-sm">
            <Card.Body>
              <h5>Sessioni Incomplete</h5>
              <h2>{incompleteSessions}</h2>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="text-center shadow-sm">
            <Card.Body>
              <h5>Utenti Autenticati</h5>
              <h2>{authenticatedSessions}</h2>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="text-center shadow-sm">
            <Card.Body>
              <h5>Utenti Anonimi</h5>
              <h2>{anonymousSessions}</h2>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col md={4}>
          <Card className="text-center shadow-sm">
            <Card.Body>
              <h5>Utenti Unici</h5>
              <h2>{uniqueUsers}</h2>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Card className="shadow-sm mb-4">
        <Card.Body>
          <h5 className="mb-4 text-center">Distribuzione per Mood</h5>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={moodData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                outerRadius={100}
                dataKey="value"
              >
                {moodData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </Card.Body>
      </Card>

      <Card className="shadow-sm mb-4">
        <Card.Body>
          <h5 className="mb-4 text-center">Durata Media per Mood</h5>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={moodDurations} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="avg" fill="#007bff">
                <LabelList dataKey="avg" position="top" />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card.Body>
      </Card>

      <Card className="shadow-sm">
        <Card.Body>
          <h5 className="mb-4 text-center">Completamento per Mood</h5>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={moodCompletion} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Legend />
              <Bar dataKey="percent" fill="#28a745">
                <LabelList dataKey="percent" position="top" formatter={(val) => `${val.toFixed(0)}%`} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card.Body>
      </Card>
    </>
  );
};

export default AdminStats;
