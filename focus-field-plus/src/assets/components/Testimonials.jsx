import React from "react";
import { Container } from "react-bootstrap";
import Carousel from "react-bootstrap/Carousel";

const testimonials = [
  {
    name: "Luca R.",
    role: "Studente universitario",
    text: "FocusField+ mi ha aiutato a concentrarmi meglio durante le sessioni di studio. La modalità spirituale è stata una vera benedizione!",
  },
  {
    name: "Giulia M.",
    role: "Illustratrice freelance",
    text: "Le raccomandazioni musicali sono sempre azzeccate. Sembra che l'app capisca davvero come mi sento!",
  },
  {
    name: "Davide P.",
    role: "Web Developer",
    text: "Un'app innovativa. Riesco ad entrare nel 'flow' molto più facilmente grazie ai suggerimenti personalizzati.",
  },
  {
    name: "Marco T.",
    role: "Insegnante",
    text: "La modalità riflessiva mi ha aiutato a preparare meglio le lezioni. È uno strumento unico nel suo genere.",
  },
  {
    name: "Serena C.",
    role: "Musicista",
    text: "Adoro come l'app capta il mio umore e mi propone l'ambiente sonoro ideale per comporre.",
  },
  {
    name: "Alessio V.",
    role: "Studente di teologia",
    text: "Le proposte spirituali mi aiutano a rimanere centrato e focalizzato in modo profondo.",
  },
  {
    name: "Elena B.",
    role: "Coach motivazionale",
    text: "Uno strumento potente per allenare la concentrazione e la consapevolezza interiore.",
  },
  {
    name: "Riccardo N.",
    role: "Designer UX",
    text: "Un'esperienza utente ben pensata. Mi accompagna nei momenti di massima creatività.",
  },
  {
    name: "Anna F.",
    role: "Volontaria",
    text: "Apprezzo il rispetto per i valori spirituali. È raro trovare app così sensibili e utili.",
  },
];

// Funzione per dividere le testimonianze in gruppi da 3
const chunkArray = (arr, size) => {
  const result = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
};

const TestimonialsCarousel = () => {
  const groupedTestimonials = chunkArray(testimonials, 3);

  return (
    <Container className="mt-5 pb-5">
      <h2 className="text-center mb-4">Cosa dicono gli utenti</h2>
      <Carousel indicators={false} interval={8000}>
        {groupedTestimonials.map((group, index) => (
          <Carousel.Item key={index}>
            <div className="row justify-content-center">
              {group.map((t, idx) => (
                <div className="col-md-4 mb-3 d-flex" key={idx} style={{ height: "12rem" }}>
                  <div className="card shadow-sm h-100 p-4 border-0 rounded-4">
                    <p className="text-muted mb-4">“{t.text}”</p>
                    <div className="mt-auto">
                      <h5 className="mb-0">{t.name}</h5>
                      <small className="text-secondary">{t.role}</small>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Carousel.Item>
        ))}
      </Carousel>
    </Container>
  );
};

export default TestimonialsCarousel;
