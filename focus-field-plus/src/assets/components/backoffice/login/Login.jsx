import { Alert, Col, Container, Form, InputGroup, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import FocusNavBar from "../../home/FocusNavBar";
import Footer from "../../home/Footer";
import { Link, useNavigate } from "react-router";
import { fetchCurrentUser, login, LOGIN_FAILURE } from "../../../../redux/actions";
import { useState, useEffect } from "react";
import ButtonsLogin from "./ButtonsLogin";

const Login = () => {
  const dispatch = useDispatch();
  const [rememberMe, setRememberMe] = useState(false);
  const [savedUsername, setSavedUsername] = useState("");
  const auth = useSelector((state) => state.auth);
  const token = useSelector((state) => state.auth.token);
  const user = useSelector((state) => state.auth.user);
  const fromPath = location.state?.from || sessionStorage.getItem("redirectAfterLogin") || "/";
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    const username = e.target.elements.username.value;
    const password = e.target.elements.password.value;

    if (rememberMe) {
      localStorage.setItem("rememberedUsername", username);
    } else {
      localStorage.removeItem("rememberedUsername");
    }
    dispatch(login(username, password));
  };

  useEffect(() => {
    dispatch({ type: LOGIN_FAILURE, payload: "" });

    if (token && !user) {
      dispatch(fetchCurrentUser());
    }

    if (token && user) {
      setTimeout(() => {
        if (user.roles?.includes("ROLE_ADMIN")) {
          navigate("/dashboard");
        } else {
          navigate(fromPath);
          sessionStorage.removeItem("redirectAfterLogin");
        }
      }, 500);
    }
  }, [token, user, dispatch, navigate, fromPath]);

  useEffect(() => {
    const remembered = localStorage.getItem("rememberedUsername");
    if (remembered) {
      setSavedUsername(remembered);
      setRememberMe(true);
    }
  }, []);

  return (
    <Container fluid className="d-flex flex-column min-vh-100 px-0">
      <FocusNavBar />
      <Container fluid className="flex-grow-1 d-flex flex-column login-container">
        <Row className="flex-grow-1">
          <Col className="d-flex flex-column justify-content-center align-items-center">
            <div className="mood-section my-3">
              <h2 className="my-2 mood-text mx-4 ps-3 my-3">
                <i className="fas fa-sign-in-alt me-2"></i>Login
              </h2>
              <div className="login-form-container mx-4 mb-4" style={{ width: "19rem" }}>
                <Form className="mt-5 w-100 px-4" onSubmit={handleLogin}>
                  <Form.Control
                    className="mb-3"
                    type="text"
                    placeholder="Username"
                    autoComplete="username"
                    name="username"
                    defaultValue={savedUsername}
                  />
                  <Form.Control
                    type="password"
                    placeholder="Password"
                    autoComplete="current-password"
                    name="password"
                  />
                  <button className="focusfield-btn mt-4 d-flex justify-content-center" style={{ width: "16rem" }}>
                    Login
                  </button>
                  {auth.error && (
                    <Alert variant="danger" className="mt-4 mb-0 text-center">
                      <i className="bi bi-exclamation-triangle-fill me-2"></i>Login failed
                    </Alert>
                  )}
                  {auth.loginSuccess && (
                    <Alert variant="success" className="mt-4 mb-0 text-center">
                      <i className="bi bi-check-circle-fill me-2"></i>Login successful
                    </Alert>
                  )}
                </Form>
                <div className="d-flex flex-column justify-content-between  w-100 px-4 login-text gap-1">
                  <div
                    className="remember-checkbox d-flex align-items-center gap-2"
                    onClick={() => setRememberMe((prev) => !prev)}
                    style={{ cursor: "pointer" }}
                  >
                    <Form.Check
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      onClick={(e) => e.stopPropagation()}
                    />
                    <span>Remember me</span>
                  </div>

                  <Link to="/register" className="d-flex login-link">
                    Don't have an account? Register
                  </Link>
                  <Link to="/forgot-password" className="d-flex login-link">
                    Forgot Password?
                  </Link>
                </div>
                <ButtonsLogin />
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
