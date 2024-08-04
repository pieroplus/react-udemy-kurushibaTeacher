import React, { FC, useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import "./App.css";

type Character = {
  id: number;
  name: string;
  images?: string[];
  debut?: {
    appearsIn: string;
  };
  personal?: {
    affiliation: string;
  };
};

type ApiResponse = {
  characters: Character[];
};

const limit = 15;

const App: FC = () => {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [page, setPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  useEffect(() => {
    fetchCharacters(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const fetchCharacters = async (page: number): Promise<void> => {
    setIsLoading(true);
    try {
      const apiUrl = "https://narutodb.xyz/api/character";
      const result = await axios.get<ApiResponse>(apiUrl, {
        params: { page, limit },
      });
      setCharacters(result.data.characters);
    } catch (e) {
      const error = e as AxiosError<{ error: string }>;
      console.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBtn = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ): Promise<void> => {
    const pageNumber =
      (e.target as HTMLButtonElement).id === "nextBtn" ? page + 1 : page - 1;
    await fetchCharacters(pageNumber);
    setPage(pageNumber);
  };

  return (
    <div className="container">
      <header className="header">
        <div className="header-content">
          <img src="logo.png" alt="logo" className="logo" />
        </div>
      </header>
      <main>
        <div className="cards-container">
          {isLoading ? (
            <div>Loading...</div>
          ) : (
            characters.map((character) => {
              return (
                <div className="card" key={character.id}>
                  <img
                    src={character.images?.[0] ?? "dummy.png"}
                    alt="character"
                    className="card-image"
                  />

                  <div className="card-content">
                    <h3 className="card-title">{character.name}</h3>
                  </div>
                  <p className="card-description">
                    {character.debut?.appearsIn ?? "なし"}
                  </p>
                  <div className="card-footer">
                    <span className="affiliation">
                      {character.personal?.affiliation ?? "なし"}
                    </span>
                  </div>
                </div>
              );
            })
          )}
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
          <button className="next" id="nextBtn" onClick={handleBtn}>
            next
          </button>
        </div>
      </main>
    </div>
  );
};

export default App;
