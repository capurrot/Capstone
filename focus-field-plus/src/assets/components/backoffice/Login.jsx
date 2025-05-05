import { Col, Container, Form, InputGroup, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import FocusNavBar from "../home/FocusNavBar";
import Footer from "../home/Footer";
import { Link, Navigate, useNavigate } from "react-router";
import { login } from "../../../redux/actions";
import { useEffect } from "react";

const Login = () => {
  const dispatch = useDispatch();
  const handleLogin = (e) => {
    e.preventDefault();
    const username = e.target.elements.username.value;
    const password = e.target.elements.password.value;
    dispatch(login(username, password));
  };
  const token = useSelector((state) => state.auth.token);
  const navigate = useNavigate();
  useEffect(() => {
    if (token) {
      navigate("/dashboard");
    }
  }, [token, navigate]);

  return (
    <Container fluid className="d-flex flex-column min-vh-100 px-0">
      <FocusNavBar />
      <Container fluid className="flex-grow-1 d-flex flex-column login-container">
        <Row className="flex-grow-1">
          <Col className="d-flex flex-column justify-content-center align-items-center">
            <div className="mood-section">
              <h2 className="my-2 mood-text mx-4 ps-3 my-3">
                <i className="fas fa-sign-in-alt me-2"></i>Login
              </h2>
              <div className="login-form-container mx-4 mb-4">
                <Form className="mt-5 w-100 px-4" onSubmit={handleLogin}>
                  <Form.Control
                    className="mb-3"
                    type="text"
                    placeholder="Username"
                    autoComplete="username"
                    name="username"
                  />
                  <Form.Control
                    type="password"
                    placeholder="Password"
                    autoComplete="current-password"
                    name="password"
                  />
                  <button className="focusfield-btn mt-4 mb-3">Login</button>
                </Form>
                <div className="d-flex flex-column justify-content-between  w-100 px-4 login-text">
                  <Form.Check type="checkbox" label="Remember me" />
                  <Link to="/register" className="d-flex login-link">
                    Don't have an account? Register
                  </Link>
                  <Link to="/forgot-password" className="d-flex login-link">
                    Forgot Password?
                  </Link>
                </div>
                <div className="d-flex flex-column gap-2 mt-4  w-100 px-4 mb-5">
                  <button className="focusfield-btn-outline d-flex align-items-center justify-content-center gap-2">
                    <i className="bi bi-google"></i>
                    Continua con Google
                  </button>
                  <button className="focusfield-btn-outline d-flex align-items-center justify-content-center gap-2">
                    <i className="bi bi-apple"></i>
                    Continue with Apple
                  </button>
                  <button className="focusfield-btn-outline d-flex align-items-center justify-content-center gap-2">
                    <i className="bi bi-facebook"></i>
                    Continue with Facebook
                  </button>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
      <Footer className="mt-auto" />
    </Container>
  );
};

export default Login;
