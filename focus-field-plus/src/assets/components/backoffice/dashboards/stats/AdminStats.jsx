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
  LineChart,
  Line,
} from "recharts";

const AdminStats = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const apiUrl = import.meta.env.VITE_API_URL;
  const token = useSelector((state) => state.auth.token);
  const allMoods = useSelector((state) => state.mood.allMoods);

  const moodColorMap = Object.fromEntries(allMoods.map((mood) => [mood.slug, mood.colors?.[0] || "#999"]));

  const fetchLogs = async () => {
    try {
      const res = await fetch(`${apiUrl}api/focus-field/log/user/logs`, {
        headers: { Authorization: `Bearer ${token}` },
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const renderTooltip = ({ payload }) => {
    if (payload && payload.length && payload[0].payload) {
      const { name, value } = payload[0].payload;
      return (
        <div className="custom-tooltip">
          <strong>{name}</strong>
          <br />
          Valore: {value != null ? value.toFixed(0) : "N/A"}
        </div>
      );
    }
    return null;
  };

  const sessionsByDate = logs.reduce((acc, log) => {
    const date = new Date(log.startTime).toLocaleDateString("it-IT");
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {});

  const sessionTrendData = Object.entries(sessionsByDate)
    .sort(([a], [b]) => {
      const [da, ma, ya] = a.split("/");
      const [db, mb, yb] = b.split("/");
      return new Date(`${ya}-${ma}-${da}`) - new Date(`${yb}-${mb}-${db}`);
    })
    .map(([date, count]) => ({ date, count }));

  return (
    <>
      <Row className="mb-4">
        {[
          { title: "Totale Sessioni", value: totalSessions },
          { title: "Durata Media (s)", value: Math.round(avgDuration) },
          {
            title: "Sessioni Completate",
            value: `${completedSessions} (${Math.round((completedSessions / totalSessions) * 100)}%)`,
          },
          { title: "Sessioni Incomplete", value: incompleteSessions },
          { title: "Sessioni Autenticate", value: authenticatedSessions },
          { title: "Sessioni Anonime", value: anonymousSessions },
        ].map((stat, i) => (
          <Col md={4} className="mb-3" key={i}>
            <Card className="text-center shadow stat-card">
              <Card.Body>
                <h5 className="text-muted">{stat.title}</h5>
                <h2>{stat.value}</h2>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <Card className="shadow mb-4">
        <Card.Body>
          <h5 className="mb-4 text-center">Distribuzione per Mood</h5>
          <div style={{ width: "100%", height: "60vh", minHeight: "300px" }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={moodData}
                  cx="50%"
                  cy="50%"
                  innerRadius="30%"
                  outerRadius="80%"
                  labelLine={false}
                  paddingAngle={1}
                  dataKey="value"
                  animationDuration={800}
                  label={({ name, value, percent }) =>
                    window.innerWidth >= 768 ? `${name}: ${value} (${(percent * 100).toFixed(0)}%)` : ""
                  }
                >
                  {moodData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={moodColorMap[entry.name] || "#ccc"} />
                  ))}
                </Pie>
                <Tooltip content={renderTooltip} />
                <Legend
                  verticalAlign="bottom"
                  layout="horizontal"
                  iconType="circle"
                  wrapperStyle={{ paddingTop: 10 }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card.Body>
      </Card>

      <Card className="shadow mb-4">
        <Card.Body>
          <h5 className="mb-4 text-center">Andamento Giornaliero delle Sessioni</h5>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={sessionTrendData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#0d6efd"
                strokeWidth={3}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card.Body>
      </Card>

      <Card className="shadow mb-4">
        <Card.Body>
          <h5 className="mb-4 text-center">Durata Media per Mood</h5>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={moodDurations} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip content={renderTooltip} />
              <Legend />
              <Bar dataKey="avg" radius={[8, 8, 0, 0]} animationDuration={1000}>
                {moodDurations.map((entry, index) => (
                  <Cell key={index} fill={moodColorMap[entry.name] || "#007bff"} />
                ))}
                <LabelList dataKey="avg" position="top" />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card.Body>
      </Card>

      <Card className="shadow mb-4">
        <Card.Body>
          <h5 className="mb-4 text-center">Completamento per Mood</h5>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={moodCompletion} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis domain={[0, 100]} />
              <Tooltip content={renderTooltip} />
              <Legend />
              <Bar dataKey="percent" radius={[8, 8, 0, 0]} animationDuration={1000}>
                {moodCompletion.map((entry, index) => (
                  <Cell key={index} fill={moodColorMap[entry.name] || "#28a745"} />
                ))}
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
