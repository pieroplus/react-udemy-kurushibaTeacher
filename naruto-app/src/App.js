import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [characteres, setCharactoers] = useState([]);
  const [page, setPage] = useState(1);
  const [isLording, setIsLoarding] = useState(false);
  const [isNextLimit, setIsNextLimit] = useState(false);
  useEffect(() => {
    fetchCharactors();
  }, []);
  const fetchCharactors = async (page) => {
    const apiUrl = "https://narutodb.xyz/api/character";
    setIsLoarding(true);
    const result = await axios.get(apiUrl, { params: { page } });
    const maxLimitCharacter = result.data.totalCharacters;

    setIsNextLimit(maxLimitCharacter / 20 <= page ? true : false);
    setCharactoers(result.data.characters);

    setIsLoarding(false);
    console.log(result);
  };

  const handleBtn = async (e) => {
    const pageNumber = e.target.id === "nextBtn" ? page + 1 : page - 1;
    await fetchCharactors(pageNumber);
    setPage(pageNumber);
  };

  return (
    <div className="container">
      <header className="header">
        <div className="header-content">
          <img src="logo.png" alt="logo" className="logo" />
        </div>
      </header>
      {isLording ? (
        <div>Now Loading...</div>
      ) : (
        <main>
          <div className="cards-container">
            {characteres.map((character) => (
              <div className="card" key={character.id}>
                <img
                  src={character.images[0] ?? "dummy.png"}
                  alt="character"
                  className="card-imag"
                />
                <div className="card-content">
                  <h3 className="card-title">{character.name}</h3>
                  <p className="card-description">
                    {character.debut?.appearsIn ?? "なし"}
                  </p>
                  <div className="card-footer">
                    <span className="affiliation">
                      {character.personal?.affiliation ?? "なし"}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="pager">
            <button
              disabled={page === 1}
              className="prev"
              id="prevBtn"
              onClick={handleBtn}
            >
              Previous
            </button>
            <span className="page-number">{page}</span>
            <button
              disabled={isNextLimit}
              className="next"
              id="nextBtn"
              onClick={handleBtn}
            >
              Next
            </button>
          </div>
        </main>
      )}
    </div>
  );
}

export default App;
