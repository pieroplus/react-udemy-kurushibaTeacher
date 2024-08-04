import { useEffect, FC, useState, useRef } from "react";
import spotifyPromise from "./lib/spotify";
import { SongList } from "./components/SongList";
import { Track } from "./type";
import { Player } from "./components/Player";
import { SearchInput } from "./components/SearchInput";
import { Pagination } from "./components/Pagination";

const limit = 20;
const App: FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [popularSongs, setPopularSongs] = useState<Track[]>([]);
  const [isPlay, setIsPlay] = useState<boolean>(false);
  const [keyword, setKeyword] = useState<string>("");
  const [selectedSong, setSelectedSong] = useState<Track>();
  const [searchedSongs, setSearchedSongs] = useState<Track[]>([]);
  const [page, setPage] = useState<number>(1);
  const [hasNext, setHasNext] = useState<boolean>(false);
  const [hasPrev, setHasPrev] = useState<boolean>(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const isSearchedResult = searchedSongs.length >= 1;

  useEffect(() => {
    fetchPopularSongs();
  }, []);

  const fetchPopularSongs = async (): Promise<void> => {
    setSearchedSongs([]);
    try {
      setIsLoading(true);
      const spotify = await spotifyPromise;
      const result = await spotify.getPopularSongs();
      console.log(result);
      const popularSongs: Track[] = result.items.map((item) => {
        return item.track;
      });
      setPopularSongs(popularSongs);
    } catch (error) {
      console.error("Failed to initialize Spotify client:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSongSelected = async (song: Track): Promise<void> => {
    setSelectedSong(song);
    if (audioRef.current) {
      if (song.preview_url != null) {
        // audioタグに再生する曲のURLが紐づく
        audioRef.current.src = song.preview_url;
        playSong();
      } else {
        pauseSong();
      }
    }
  };

  const playSong = (): void => {
    if (audioRef.current) {
      audioRef.current.play();
      setIsPlay(true);
    }
  };
  const pauseSong = (): void => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlay(false);
    }
  };

  const toggleSong = (): void => {
    isPlay ? pauseSong() : playSong();
  };

  const searchSongs = async (keyword: string, page?: number): Promise<void> => {
    setIsLoading(true);
    const offset = page ? (page - 1) * limit : 0; // 0は無効な値が渡ってきた場合の処理
    const spotify = await spotifyPromise;
    if (keyword) {
      const result = await spotify.searchSongs(keyword, offset, limit);
      setHasNext(result.tracks.next != null);
      setHasPrev(result.tracks.previous != null);
      setSearchedSongs(result.tracks.items);
    }
    setIsLoading(false);
  };

  const moveToNext = async (): Promise<void> => {
    const nextPage = page + 1;
    await searchSongs(keyword, nextPage);
    setPage(nextPage);
  };

  const moveToPrev = async (): Promise<void> => {
    const prevPage = page - 1;
    await searchSongs(keyword, prevPage);
    setPage(prevPage);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white">
      <main className="flex-1 p-8 mb-20">
        <header className="flex justify-between items-center mb-10">
          <h1
            onClick={fetchPopularSongs}
            className="text-4xl font-bold cursor-pointer"
          >
            Music App
          </h1>
        </header>
        <SearchInput
          keywordState={[keyword, setKeyword]}
          onSubmit={searchSongs}
        />
        <section>
          <h2 className="text-2xl font-semibold mb-5">
            {isSearchedResult ? "Selected Songs" : "Popular Songs"}
          </h2>
          <SongList
            songs={isSearchedResult ? searchedSongs : popularSongs}
            isLoading={isLoading}
            onSongSelected={handleSongSelected}
          />
        </section>
        {isSearchedResult && (
          <Pagination
            onPrev={hasPrev ? moveToPrev : null}
            onNext={hasNext ? moveToNext : null}
          />
        )}
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
};

export default App;
