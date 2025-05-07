import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import Logo from "../../../../public/images/logo.png";
import { useEffect, useState } from "react";
import i18n from "i18next";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
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
    <Navbar className={scroll > 76 ? "navbar scrolled sticky-top navbar" : "sticky-top navbar"} expand="md">
      <Container fluid>
        <Navbar.Brand href="#home">
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
            <Link className="nav-link" to="/">
              {t("navbar.home")}
            </Link>
            {token ? (
              <button onClick={handleLogout} className="nav-link btn btn-link text-white text-decoration-none">
                {t("navbar.logout")}
              </button>
            ) : (
              <Link className="nav-link" to="/login">
                {t("navbar.login")}
              </Link>
            )}

            {token && (
              <>
                <Link className="nav-link" to="/dashboard">
                  {t("navbar.history")}
                </Link>
                <NavDropdown title={t("navbar.settings")} id="basic-nav-dropdown">
                  <NavDropdown.Item href="#action/3.1">{t("navbar.profile")}</NavDropdown.Item>
                  <NavDropdown.Item href="#action/3.2">{t("navbar.preferences")}</NavDropdown.Item>
                </NavDropdown>
              </>
            )}

            {/* Selettore lingue */}
            <div className="d-flex align-items-center ms-3">
              <button onClick={() => changeLanguage("it")} className="btn btn-sm bg-transparent text-white px-1">
                🇮🇹
              </button>
              <button onClick={() => changeLanguage("en")} className="btn btn-sm bg-transparent text-white px-1">
                🇬🇧
              </button>
              <button onClick={() => changeLanguage("es")} className="btn btn-sm bg-transparent text-white px-1">
                🇪🇸
              </button>
              <button onClick={() => changeLanguage("fr")} className="btn btn-sm bg-transparent text-white px-1">
                🇫🇷
              </button>
              <button onClick={() => changeLanguage("de")} className="btn btn-sm bg-transparent text-white px-1">
                🇩🇪
              </button>
            </div>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default FocusNavBar;
