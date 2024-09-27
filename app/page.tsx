import { Player } from "./components/Player";

function randomIntFromInterval(min: number, max: number) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export default async function Home() {
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_HEADER_KEY}`,
    },
  };

  const response = await fetch(
    `https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=true&language=en-US&page=${randomIntFromInterval(
      1,
      45
    )}&sort_by=popularity.asc&vote_count.gte=5000&with_original_language=en`,
    options
  );

  const result = await response.json();

  const movieToSelect = randomIntFromInterval(0, result.results.length - 1);
  const movie = result.results[movieToSelect];

  const trailerResponse = await fetch(
    `https://api.themoviedb.org/3/movie/${movie.id}/videos?language=en-US`,
    options
  );
  const trailerResult = await trailerResponse.json();

  return (
    <div className="flex justify-center items-center h-full w-full">
      <Player trailer={trailerResult} movies={result} correctMovie={movie} />
    </div>
  );
}
