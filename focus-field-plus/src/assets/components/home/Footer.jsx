import { Container } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebook, faTwitter, faInstagram, faLinkedin } from "@fortawesome/free-brands-svg-icons";

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="bg-dark text-light py-4 mt-5">
      <Container>
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center">
          <div className="mb-3 mb-md-0">
            <h5 className="mb-1">FocusField+</h5>
            <small>
              &copy; {new Date().getFullYear()} FocusField+. {t("footer.rights")}
            </small>
          </div>

          <ul className="list-unstyled d-flex gap-4 mb-3 mb-md-0">
            <li>
              <a href="#" className="text-light text-decoration-none">
                {t("footer.links.home")}
              </a>
            </li>
            <li>
              <a href="#" className="text-light text-decoration-none">
                {t("footer.links.how")}
              </a>
            </li>
            <li>
              <a href="#" className="text-light text-decoration-none">
                {t("footer.links.faq")}
              </a>
            </li>
            <li>
              <a href="#" className="text-light text-decoration-none">
                {t("footer.links.contact")}
              </a>
            </li>
          </ul>

          <div className="d-flex gap-3">
            <a href="#" className="text-light">
              <FontAwesomeIcon icon={faFacebook} size="lg" />
            </a>
            <a href="#" className="text-light">
              <FontAwesomeIcon icon={faTwitter} size="lg" />
            </a>
            <a href="#" className="text-light">
              <FontAwesomeIcon icon={faInstagram} size="lg" />
            </a>
            <a href="#" className="text-light">
              <FontAwesomeIcon icon={faLinkedin} size="lg" />
            </a>
          </div>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
