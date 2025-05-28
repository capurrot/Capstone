import { NavLink } from "react-router";
import { Navbar, Nav, NavDropdown, Container } from "react-bootstrap";
import Logo from "../../../../../../../public/images/logo.png";

function FocusNavBarPreview({ mood, colors }) {
  return (
    <Navbar className="py-1 sticky-top navbar" expand="md" style={{ backgroundColor: colors[0], color: colors[1] }}>
      <Container fluid>
        <Navbar.Brand as={NavLink} to="/" className="d-flex align-items-center">
          <img src={Logo} className="logo" alt="logo" style={{ width: "2rem", height: "2rem" }} />
          <span className="ms-2 fw-bold" style={{ fontFamily: "Fjalla One", fontSize: "1.5rem", color: colors[1] }}>
            {mood?.name || "FocusField+"}
          </span>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto align-items-center">
            <NavLink to="/" className="nav-link nav-link-underline fw-bold" style={{ color: colors[1] }}>
              Home
            </NavLink>
            <NavLink to="/" className="nav-link nav-link-underline" style={{ color: colors[1] }}>
              Accedi
            </NavLink>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
export default FocusNavBarPreview;
