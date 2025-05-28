import { useEffect, useState, useMemo } from "react";
import { Spinner, Card, Row, Col, ListGroup } from "react-bootstrap";
import { useSelector } from "react-redux";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import itLocale from "@fullcalendar/core/locales/it";
import { Tooltip } from "react-tooltip";

const UserStats = () => {
  const token = useSelector((state) => state.auth.token);
  const allMoods = useSelector((state) => state.mood.allMoods);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDateLogs, setSelectedDateLogs] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await fetch(`${apiUrl}api/focus-field/log/user/logs`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Errore nella risposta del server");
        const data = await res.json();
        setLogs(data);
      } catch (err) {
        console.error("Errore nel caricamento dei log:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, [token]);

  const moodLabel = (slug) => allMoods.find((m) => m.slug === slug)?.name || slug;

  const eventList = useMemo(() => {
    return logs.map((log) => {
      const mood = allMoods.find((m) => m.slug === log.moodSlug);
      const backgroundColor = mood?.colors?.[0];
      const textColor = mood?.colors?.[1];

      return {
        title: mood?.name || log.moodSlug,
        start: log.startTime,
        display: "block",
        backgroundColor: backgroundColor,
        textColor: textColor,
        borderColor: "transparent",
        extendedProps: {
          iconClass: log.completed ? "bi-check-circle-fill" : "bi-hourglass-split",
        },
      };
    });
  }, [logs, allMoods]);

  const isSameDay = (d1, d2) => new Date(d1).toDateString() === new Date(d2).toDateString();

  const handleDateClick = (arg) => {
    setSelectedDate(arg.date);
    const filtered = logs.filter((log) => isSameDay(log.startTime, arg.date));
    setSelectedDateLogs(filtered);
  };

  if (loading) {
    return (
      <div className="text-center mt-4">
        <Spinner animation="border" variant="primary" />
        <p className="mt-2">Caricamento statistiche...</p>
      </div>
    );
  }

  if (logs.length === 0) {
    return <p className="text-center mt-4">Nessuna attività trovata.</p>;
  }

  const total = logs.length;
  const completed = logs.filter((log) => log.completed).length;
  const avgDuration = Math.round(logs.reduce((sum, log) => sum + (log.durationSeconds || 0), 0) / logs.length);
  const moodCount = logs.reduce((acc, log) => {
    const mood = log.moodSlug || "unknown";
    acc[mood] = (acc[mood] || 0) + 1;
    return acc;
  }, {});
  const mostUsedMood = Object.entries(moodCount).sort((a, b) => b[1] - a[1])[0]?.[0] || "N/D";

  const latestLogs = [...logs].sort((a, b) => new Date(b.startTime) - new Date(a.startTime)).slice(0, 5);

  return (
    <div className="user-stats-container">
      <Row className="mb-4">
        {[
          { title: "Sessioni Totali", value: total },
          { title: "Completate", value: `${completed} (${Math.round((completed / total) * 100)}%)` },
          { title: "Durata Media", value: `${avgDuration} s` },
        ].map((item, i) => (
          <Col md={4} key={i} className="mb-3">
            <Card className="text-center stat-card h-100 border-0 shadow-sm">
              <Card.Body>
                <h6 className="text-muted">{item.title}</h6>
                <h2 className="text-focusfield fw-bold">{item.value}</h2>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <Card className="mb-4 border-0 shadow-sm">
        <Card.Body>
          <h5 className="mb-0">
            Mood più usato: <strong>{moodLabel(mostUsedMood)}</strong>
          </h5>
        </Card.Body>
      </Card>

      <Card className="mb-4 border-0 shadow-sm">
        <Card.Body>
          <h5 className="mb-3">Ultime sessioni</h5>
          <ListGroup variant="flush">
            {latestLogs.map((log, i) => (
              <ListGroup.Item key={i} className="d-flex justify-content-between align-items-center">
                <div>
                  <span className="fw-semibold">{moodLabel(log.moodSlug)}</span>
                  <small className="d-block text-muted">{new Date(log.startTime).toLocaleString("it-IT")}</small>
                </div>
                <span className={log.completed ? "text-success" : "text-warning"}>{log.completed ? "✔" : "⏳"}</span>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Card.Body>
      </Card>

      <Card className="mb-4 border-0 shadow-sm">
        <Card.Body>
          <h5 className="text-center mb-4">Calendario Sessioni</h5>
          <FullCalendar
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            locale={itLocale}
            events={eventList}
            eventDidMount={(info) => {
              const iconClass = info.event.extendedProps.iconClass;
              if (iconClass) {
                const icon = document.createElement("i");
                icon.className = `bi ${iconClass}`;
                icon.style.marginRight = "6px";
                icon.style.fontSize = "1rem";
                info.el.querySelector(".fc-event-title")?.prepend(icon);
              }
            }}
            dayCellDidMount={(info) => {
              // ⛔ Blocca subito i giorni non del mese visibile
              if (info.el.classList.contains("fc-day-other")) return;

              const normalize = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate());

              const cellDate = normalize(new Date(info.date));
              const today = normalize(new Date());

              // ⛔ Blocca i giorni futuri
              if (cellDate > today) return;

              const logDates = logs.map((log) => normalize(new Date(log.startTime)));

              // ⛔ Blocca se c’è già un evento quel giorno
              const hasLogToday = logDates.some((d) => d.getTime() === cellDate.getTime());
              if (hasLogToday) return;

              // 🔍 Trova l’ultimo giorno con attività prima della cella attuale
              const previousLog = [...logDates].filter((d) => d < cellDate).sort((a, b) => b - a)[0] || null;

              // 🧠 Calcola i giorni dal precedente log
              let diff = 999;
              if (previousLog) {
                diff = Math.floor((cellDate - previousLog) / (1000 * 60 * 60 * 24));
              }

              const icon = document.createElement("i");

              icon.className =
                previousLog && diff <= 2
                  ? "bi bi-exclamation-triangle-fill missed-warning-soft"
                  : "bi bi-exclamation-octagon-fill missed-warning-hard";

              // Aggiungi attributi per react-tooltip
              icon.setAttribute("data-tooltip-id", "missed-day-tooltip");
              icon.setAttribute(
                "data-tooltip-content",
                previousLog && diff <= 2
                  ? "Hai saltato questo giorno (recentemente)"
                  : "Hai saltato il giorno per più di due consecutivi"
              );

              icon.setAttribute("data-for", "missed-day-tooltip");
              icon.classList.add("tooltip-warning"); // per il cursore

              info.el.querySelector(".fc-daygrid-day-frame")?.appendChild(icon);
            }}
            dateClick={handleDateClick}
            height="auto"
            contentHeight="auto"
            expandRows={true}
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,dayGridWeek",
            }}
          />
          <Tooltip
            id="missed-day-tooltip"
            place="top"
            style={{
              backgroundColor: "#222",
              color: "#fff",
              fontFamily: "Fjalla One, sans-serif",
              fontSize: "0.85rem",
              borderRadius: "8px",
              padding: "6px 10px",
              boxShadow: "0 2px 10px rgba(0, 0, 0, 0.2)",
              zIndex: 9999, // ✅ qui lo alzi
            }}
          />
        </Card.Body>
      </Card>

      {selectedDate && selectedDateLogs.length > 0 && (
        <Card className="mb-4 border-0 shadow-sm">
          <Card.Body>
            <h5 className="mb-3">Sessioni del {selectedDate.toLocaleDateString("it-IT")}</h5>
            <ListGroup variant="flush">
              {selectedDateLogs.map((log, i) => (
                <ListGroup.Item key={i} className="d-flex justify-content-between align-items-center">
                  <div>
                    <span className="fw-semibold">{moodLabel(log.moodSlug)}</span>
                    <small className="d-block text-muted">
                      {new Date(log.startTime).toLocaleTimeString("it-IT", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </small>
                  </div>
                  <span className={log.completed ? "text-success" : "text-warning"}>{log.completed ? "✔" : "⏳"}</span>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Card.Body>
        </Card>
      )}
    </div>
  );
};

export default UserStats;
