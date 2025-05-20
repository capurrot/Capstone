import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, NavLink } from "react-router";
import { useTranslation } from "react-i18next";
import i18n from "i18next";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import Logo from "../../../../public/images/logo.png";
import { logout } from "../../../redux/actions";

function FocusNavBar() {
  const { t } = useTranslation();
  const [scroll, setScroll] = useState(0);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    const handleScroll = () => setScroll(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <Navbar className={`py-1 sticky-top navbar ${scroll > 76 ? "scrolled" : ""}`} expand="md">
      <Container fluid>
        <Navbar.Brand as={NavLink} to="/" className="d-flex align-items-center">
          <img
            src={Logo}
            className="logo"
            alt="logo"
            style={{
              transform: `rotate(${scroll * 0.1}deg)`,
              transition: "transform 0.05s linear",
            }}
          />
          <span className="ms-2 fw-bold">FocusField+</span>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto align-items-center">
            <NavLink to="/" className={({ isActive }) => `nav-link nav-link-underline ${isActive && "fw-bold"}`}>
              {t("navbar.home")}
            </NavLink>

            {token ? (
              <>
                <NavLink
                  to="/dashboard"
                  className={({ isActive }) => `nav-link nav-link-underline ${isActive && " fw-bold"}`}
                >
                  {t("navbar.dashboard")}
                </NavLink>

                <NavDropdown title={t("navbar.settings")} id="basic-nav-dropdown nav-link nav-link-underline">
                  <NavDropdown.Item as={NavLink} to="/profile">
                    {t("navbar.profile")}
                  </NavDropdown.Item>
                  <NavDropdown.Item as={NavLink} to="/preferences">
                    {t("navbar.preferences")}
                  </NavDropdown.Item>
                </NavDropdown>

                <button onClick={handleLogout} className="nav-link  nav-link-underline">
                  {t("navbar.logout")}
                </button>
              </>
            ) : (
              <NavLink to="/login" className={({ isActive }) => `nav-link nav-link-underline ${isActive && "fw-bold"}`}>
                {t("navbar.login")}
              </NavLink>
            )}

            <NavDropdown
              id="language-dropdown"
              title={<i className="bi bi-globe me-2"></i>}
              className="ms-3"
              align="end"
            >
              <NavDropdown.Item onClick={() => changeLanguage("it")}>🇮🇹 Italiano</NavDropdown.Item>
              <NavDropdown.Item onClick={() => changeLanguage("en")}>🇬🇧 English</NavDropdown.Item>
              <NavDropdown.Item onClick={() => changeLanguage("es")}>🇪🇸 Español</NavDropdown.Item>
              <NavDropdown.Item onClick={() => changeLanguage("fr")}>🇫🇷 Français</NavDropdown.Item>
              <NavDropdown.Item onClick={() => changeLanguage("de")}>🇩🇪 Deutsch</NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default FocusNavBar;
