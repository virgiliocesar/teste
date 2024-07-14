const API_KEY = "sua_chave_de_api_aqui"; // Substitua pela sua chave de API do TMDb
const BASE_URL = "https://api.themoviedb.org/3";

async function search() {
  const query = document.getElementById("query").value;
  const movieResults = await searchMovie(query);
  const tvResults = await searchTVShow(query);
  displayResults(movieResults, tvResults);
}

async function searchMovie(query) {
  const url = `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(
    query
  )}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Erro: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Erro ao buscar filmes:", error);
    return null;
  }
}

async function searchTVShow(query) {
  const url = `${BASE_URL}/search/tv?api_key=${API_KEY}&query=${encodeURIComponent(
    query
  )}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Erro: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Erro ao buscar séries:", error);
    return null;
  }
}

function displayResults(movies, tvShows) {
  const resultsContainer = document.getElementById("results");
  resultsContainer.innerHTML = "";

  if (movies && movies.results) {
    movies.results.forEach((movie) => {
      const title = movie.title || "N/A";
      const releaseDate = movie.release_date || "N/A";
      const type = "movie";
      const imdbID = movie.id;
      const resultItem = document.createElement("div");
      resultItem.className = "result-item";
      resultItem.innerHTML = `<strong>Filme:</strong> ${title} <br> <strong>Data de Lançamento:</strong> ${releaseDate}`;
      resultItem.onclick = () => embedderPlugin(type, imdbID, "", ""); // Para filmes, season e episode são vazios
      resultsContainer.appendChild(resultItem);
    });
  }

  if (tvShows && tvShows.results) {
    tvShows.results.forEach((tvShow) => {
      const name = tvShow.name || "N/A";
      const firstAirDate = tvShow.first_air_date || "N/A";
      const type = "serie";
      const imdbID = tvShow.id;
      const resultItem = document.createElement("div");
      resultItem.className = "result-item";
      resultItem.innerHTML = `<strong>Série:</strong> ${name} <br> <strong>Data de Estreia:</strong> ${firstAirDate}`;
      resultItem.onclick = () => embedderPlugin(type, imdbID, "", ""); // Ajustar conforme necessário
      resultsContainer.appendChild(resultItem);
    });
  }

  if (
    (!movies || !movies.results.length) &&
    (!tvShows || !tvShows.results.length)
  ) {
    resultsContainer.innerHTML = "<p>Nenhum resultado encontrado.</p>";
  }
}

function embedderPlugin(type, imdb, season, episode) {
  if (type === "movie") {
    season = "";
    episode = "";
  } else {
    if (season !== "") {
      season = "/" + season;
    }
    if (episode !== "") {
      episode = "/" + episode;
    }
  }
  const ref = document.referrer;
  const frame = document.getElementById("EmbedderIframe");
  frame.innerHTML = ""; // Limpa o conteúdo existente
  frame.innerHTML = `<iframe src="https://embedder.net/e/${imdb}${season}${episode}?ref=${ref}" scrolling="no" frameborder="0" allowfullscreen="" webkitallowfullscreen="" mozallowfullscreen=""></iframe>`;
}
