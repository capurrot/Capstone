import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import Logo from "../../assets/images/logo.png";
import { useEffect, useState } from "react";
import i18n from "i18next";
import { useTranslation } from "react-i18next";

function Focusnavbar() {
  const { t } = useTranslation();
  const [scroll, setScroll] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScroll(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <Navbar className={scroll > 76 ? "navbar scrolled sticky-top navbar" : "sticky-top navbar"} expand="md">
      <Container fluid>
        <Navbar.Brand href="#home">
          <img src={Logo} className="logo" alt="logo" />
          <span className="ms-2 fw-bold">FocusField+</span>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto align-items-center">
            <Nav.Link href="#home">{t("navbar.home")}</Nav.Link>
            <Nav.Link href="#link">{t("navbar.history")}</Nav.Link>
            <NavDropdown title={t("navbar.settings")} id="basic-nav-dropdown">
              <NavDropdown.Item href="#action/3.1">{t("navbar.profile")}</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.2">{t("navbar.preferences")}</NavDropdown.Item>
            </NavDropdown>

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

export default Focusnavbar;
