const HowTo = () => {
  return (
    <section className="py-5">
      <div className="container">
        <h2 className="text-center mb-4">Come funziona</h2>
        <div className="row text-center">
          <div className="col-md-4 mb-4">
            <div className="p-4 border rounded-4 shadow-sm h-100">
              <h3>✍️ Scrivi liberamente</h3>
              <p>L'app analizza le tue parole e capisce come ti senti.</p>
            </div>
          </div>
          <div className="col-md-4 mb-4">
            <div className="p-4 border rounded-4 shadow-sm h-100">
              <h3>🎵 Ricevi suggerimenti</h3>
              <p>Musica, ambiente e durata ideali per entrare nel flow.</p>
            </div>
          </div>
          <div className="col-md-4 mb-4">
            <div className="p-4 border rounded-4 shadow-sm h-100">
              <h3>🙏 Modalità spirituale</h3>
              <p>Coltiva la concentrazione anche attraverso la tua fede.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowTo;
