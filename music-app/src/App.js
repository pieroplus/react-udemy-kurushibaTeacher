import { useEffect, useState, useRef } from "react";
import { SongList } from "./components/SongList.js";
import { Player } from "./components/Player.js";
import spotify from "./lib/spotify";
import { SearchInput } from "./components/SerachInput.js";
import { Pagination } from "./components/Pagination.js";

const limit = 20;
export default function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [popularSongs, setPopularSongs] = useState([]);
  const [isPlay, setIsPlay] = useState(false);
  const [selectedSong, setSelectedSong] = useState(null);
  const [keyword, setKeyword] = useState("");
  const [searchedSongs, setSearchedSongs] = useState(null);
  const [page, setPage] = useState(1);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrev, setHasPrev] = useState(false);
  const isSearchedResult = searchedSongs != null;
  const audioRef = useRef(null);

  useEffect(() => {
    featchPopularSongs();
  }, []);

  const featchPopularSongs = async () => {
    setIsLoading(true);
    const result = await spotify.getPopularSongs();
    const popularSongs = result.items.map((item) => {
      return item.track;
    });
    setPopularSongs(popularSongs);
    setIsLoading(false);
  };

  const handleSongSelected = async (song) => {
    setSelectedSong(song);
    if (song.preview_url != null) {
      // audioタグに再生する曲のURLが紐づく
      audioRef.current.src = song.preview_url;
      playSong();
    } else {
      pauseSong();
      alert("Error");
    }
  };

  const playSong = () => {
    audioRef.current.play();
    setIsPlay(true);
  };

  const pauseSong = () => {
    audioRef.current.pause();
    setIsPlay(false);
  };

  const toggleSong = () => {
    isPlay ? pauseSong() : playSong();
  };

  const handleInputChange = (e) => {
    setKeyword(e.target.value);
  };

  const searchSongs = async (page) => {
    setIsLoading(true);
    const offset = parseInt(page) ? (parseInt(page) - 1) * limit : 0;
    const result = await spotify.searchSongs(keyword, limit, offset);
    setHasNext(result.next != null);
    setHasPrev(result.previous != null);
    setSearchedSongs(result.items);
    setIsLoading(false);
  };

  const moveToNext = async () => {
    const nextPage = page + 1;
    await searchSongs(nextPage);
    setPage(nextPage);
  };

  const moveToPrev = async () => {
    const prevPage = page - 1;
    await searchSongs(prevPage);
    setPage(prevPage);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white">
      <main className="flex-1 p-8 mb-20">
        <header className="flex justify-between items-center mb-10">
          <h1 className="text-4xl font-bold">Music App</h1>
        </header>
        <SearchInput onInputChange={handleInputChange} onSubmit={searchSongs} />
        <section>
          <h2 className="text-2xl font-semibold mb-5">
            {isSearchedResult ? "Searched Result" : "Popular Song"}
          </h2>
          <SongList
            isLoading={isLoading}
            songs={isSearchedResult ? searchedSongs : popularSongs}
            onSongSelected={handleSongSelected}
          />
          {isSearchedResult && (
            <Pagination
              onPrev={hasPrev ? moveToPrev : null}
              onNext={hasNext ? moveToNext : null}
            />
          )}
        </section>
      </main>
      {selectedSong != null && (
        <Player
          song={selectedSong}
          isPlay={isPlay}
          onButtonClick={toggleSong}
        />
      )}
      <audio ref={audioRef} />
    </div>
  );
}
