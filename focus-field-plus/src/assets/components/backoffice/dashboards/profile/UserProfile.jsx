import { useDispatch } from "react-redux";
import { Card, Row, Col, ListGroup, Badge, Image, Spinner, Button, Form } from "react-bootstrap";
import { useSelector } from "react-redux";
import {
  FaEnvelope,
  FaShieldAlt,
  FaCheckCircle,
  FaTimesCircle,
  FaUserCircle,
  FaStopwatch,
  FaCheckDouble,
  FaCamera,
} from "react-icons/fa";
import { useEffect, useState, useRef } from "react";
import { fetchCurrentUser } from "../../../../../redux/actions";

const UserProfile = () => {
  const user = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalTime, setTotalTime] = useState(0);
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileInputRef = useRef(null);
  const dispatch = useDispatch();
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
        setTotalTime(data.reduce((acc, log) => acc + (log.durationSeconds || 0), 0));
      } catch (err) {
        console.error("Errore nel caricamento dei log:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const getUserImage = () => {
    if (previewUrl) return previewUrl;
    if (user.pictureUrl && /^https?:\/\/.+/.test(user.pictureUrl)) {
      return user.pictureUrl;
    }
    const initials = `${user.nome || ""} ${user.cognome || ""}`.trim() || user.username || "Utente";
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(
      initials
    )}&background=0D8ABC&color=fff&size=64&rounded=true`;
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const localUrl = URL.createObjectURL(file);
    setPreviewUrl(localUrl);

    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await fetch(`${apiUrl}api/focus-field/users/upload-image`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!res.ok) throw new Error("Upload fallito");

      dispatch(fetchCurrentUser());
    } catch (err) {
      console.error("Errore durante l'upload:", err);
    }
  };

  return (
    <>
      {loading ? (
        <div className="text-center my-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3">Caricamento dati profilo...</p>
        </div>
      ) : (
        <Card className="border-0 shadow-sm my-4">
          <Card.Body>
            <Row className="gy-4 align-items-center">
              <Col xs={12} md={4} className="text-center">
                <div style={{ display: "inline-block", position: "relative" }}>
                  <Image
                    src={getUserImage()}
                    alt={`Foto di ${user?.nome || ""} ${user?.cognome || ""}`}
                    width={128}
                    height={128}
                    roundedCircle
                    className="object-fit-cover shadow-sm mb-2"
                  />
                  <Button
                    variant="light"
                    className="position-absolute border d-flex align-items-center justify-content-center"
                    style={{ borderRadius: "50%", height: "48px", width: "48px", bottom: 0, right: 0 }}
                    onClick={() => fileInputRef.current.click()}
                  >
                    <FaCamera size={25} />
                  </Button>
                  <Form.Control
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handleFileChange}
                    style={{ display: "none" }}
                  />
                </div>
                <h5 className="fw-bold mb-1 pt-4">
                  {user?.nome} {user?.cognome}
                </h5>
                <p className="text-muted mb-2">{user?.email}</p>
                <Badge
                  bg={user?.verified ? "success" : "secondary"}
                  className="d-inline-flex align-items-center justify-content-center"
                >
                  {user?.verified ? (
                    <>
                      <FaCheckCircle className="me-1" />
                      Verificato
                    </>
                  ) : (
                    <>
                      <FaTimesCircle className="me-1" />
                      Non verificato
                    </>
                  )}
                </Badge>
              </Col>

              <Col xs={12} md={8}>
                <h6 className="text-muted mb-3">Dettagli account</h6>
                <ListGroup variant="flush">
                  <ListGroup.Item className="d-flex justify-content-between flex-wrap text-dashboard">
                    <span>
                      <FaEnvelope className="me-2" />
                      Email
                    </span>
                    <span className="text-end">{user?.email}</span>
                  </ListGroup.Item>
                  <ListGroup.Item className="d-flex justify-content-between flex-wrap text-dashboard">
                    <span>
                      <FaUserCircle className="me-2" />
                      Username
                    </span>
                    <span className="text-end">{user?.username}</span>
                  </ListGroup.Item>
                  <ListGroup.Item className="d-flex justify-content-between flex-wrap text-dashboard">
                    <span>
                      <FaShieldAlt className="me-2" />
                      Ruoli
                    </span>
                    <span className="text-end">{user?.roles?.join(", ")}</span>
                  </ListGroup.Item>
                  <ListGroup.Item className="d-flex justify-content-between flex-wrap text-dashboard">
                    <span>
                      <FaCheckDouble className="me-2" />
                      Sessioni eseguite
                    </span>
                    <span className="text-end">{logs.length || 0}</span>
                  </ListGroup.Item>
                  <ListGroup.Item className="d-flex justify-content-between flex-wrap text-dashboard">
                    <span>
                      <FaStopwatch className="me-2" />
                      Tempo totale dedicato
                    </span>
                    <span className="text-end">{Math.round(totalTime / 60)} min</span>
                  </ListGroup.Item>
                </ListGroup>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      )}
    </>
  );
};

export default UserProfile;
