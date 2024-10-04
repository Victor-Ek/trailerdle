"use client";
import { useState } from "react";
import YouTube, { YouTubePlayer } from "react-youtube";

interface PlayerProps {
  trailer: any;
  correctMovie: any;
}

const times = [15_000, 25_000, 35_000, 45_000, 55_000];

const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${process.env.NEXT_PUBLIC_HEADER_KEY}`,
  },
};

export const Player = (props: PlayerProps) => {
  const { trailer, correctMovie } = props;
  const [player, setPlayer] = useState<YouTubePlayer>();
  const [guesses, setGuesses] = useState(0);
  const [won, setWon] = useState(false);
  const [search, setSearch] = useState([]);
  const [text, setText] = useState("");
  const [wrongGuess, setWrongGuess] = useState(false);

  const trailerToWatch = trailer.results.find(
    (trail: { type: string }) => trail.type === "Trailer"
  );

  const playVideo = () => {
    setWrongGuess(false);
    player?.playVideo();
    setTimeout(() => {
      player.pauseVideo();
      player.seekTo(0);
    }, times[guesses]);
  };

  const correctAnswer =
    correctMovie.title + " " + correctMovie.release_date.split("-")[0];

  console.log({ correctAnswer, text });

  const handleSearch = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setText(event.target.value);
    const response = await fetch(
      `https://api.themoviedb.org/3/search/movie?query=${event.target.value}&include_adult=false&language=en-US&page=1`,
      options
    );
    const result = await response.json();

    setSearch(result.results);
  };

  const handleGuess = () => {
    setGuesses((prev) => prev + 1);
    if (text === correctAnswer) {
      setWon(true);
    } else {
      setWrongGuess(true);
    }
  };

  const lose = guesses >= 5;

  return (
    <div className="flex flex-col gap-5">
      {times[guesses] && <p>Guess: {times[guesses] / 1000} seconds</p>}

      <YouTube
        videoId={trailerToWatch.key}
        className={won || lose ? "" : "hidden"}
        onReady={(event) => setPlayer(event.target)}
      />
      <div className="flex items-center justify-between">
        <button type="button" onClick={playVideo}>
          play
        </button>
        <button type="button" onClick={() => player?.pauseVideo()}>
          pause
        </button>
        <button type="button" onClick={() => setGuesses((prev) => prev + 1)}>
          Skip
        </button>
      </div>
      <div className="flex gap-2">
        <input
          list="artist-and-tracks"
          onChange={handleSearch}
          className="text-slate-950"
        />
        <button type="button" onClick={handleGuess}>
          Guess
        </button>
      </div>

      <h1>{won ? "You won!" : ""}</h1>
      <h1>{lose ? "You lose!" : ""}</h1>
      <h1>{wrongGuess ? "Wrong! Guess again!" : ""}</h1>
      <datalist id="artist-and-tracks">
        {search.map((movie) => {
          return (
            <option key={movie.id}>
              {movie.title} {movie.release_date.split("-")[0]}
            </option>
          );
        })}
      </datalist>
    </div>
  );
};
