import { Link } from "react-router";

const NotFound = () => {
  return (
    <div className="notfound-wrapper d-flex flex-column justify-content-center align-items-center text-white text-center">
      <div className="bg-overlay"></div>
      <div className="z-1 position-relative">
        <h1 className="display-4 fw-bold">404 - Pagina non trovata</h1>
        <p className="lead">La pagina che stai cercando non esiste.</p>
        <div className="mt-4">
          <Link to="/" className="focusfield-btn text-decoration-none">
            Torna alla Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
