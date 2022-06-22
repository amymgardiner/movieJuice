// global vars
var mainElement = document.getElementById("main-container");
var searchBtn = document.getElementById("button-addon3");
var inputElement = document.getElementById("search-input");
var mainContent = "";
var imdbKey = "k_4old2p2l";
var giphyKey = "nxvenzenl4mKAFjuGsTFLvNKZsecjEcP";
var giphySrc;
var isLoadingApi = false;

// gets the last searched term from local storage
function loadPage() {
  var lastSearch = localStorage.getItem("lastSearch");
  if (lastSearch) {
    inputElement.value = lastSearch;
    inputElement.placeholder = lastSearch;
  }
}
// fetch movie id to get the imdb id
function fetchMovieId(movieName) {
  localStorage.setItem("lastSearch", movieName);
  var imdbUrl = `https://imdb-api.com/en/API/SearchMovie/${imdbKey}/${movieName}`;
  isLoadingApi = true;
  fetch(imdbUrl)
    .then((response) => response.json())
    .then((data) => {
      mainContent = `<div class="img-container">
            <h5 class="text-5xl text-center mb-8">Choose your movie</h5>
            <div class="flex flex-wrap wrap justify-evenly">`;
      for (var i = 0; i < data.results.length; i++) {
        var movieId = data.results[i].id;
        var movieName = data.results[i].title;
        var movieInfo = data.results[i].description;
        var movieImageSrc = data.results[i].image;
        mainContent += `<div class="img-button-container border-2 black rounded-sm cursor-pointer hover:-translate-y-2 hover:border-4">
        <h5 class="text-center py-2 bg-zinc-400 w-40">${movieName}</h5>
                    <img
                      class="img-button w-40 h-60"
                      src="${movieImageSrc}"
                      alt=""
                      data-movie-id="${movieId}"
                      data-movie-title="${movieName}"
                    />
                    <h5 class="text-center py-2 bg-zinc-400 w-40">${movieInfo}</h5>
                  </div>`;
      }
      isLoadingApi = false;
      mainContent += "</div></div>";
      mainElement.innerHTML = mainContent;
      console.log(data);
      var imgElements = document.querySelectorAll(".img-button");
      imgElements.forEach((imgButton) => {
        imgButton.addEventListener("click", function handleClick(event) {
          var movieId = event.target.getAttribute("data-movie-id");
          var movieName = event.target.getAttribute("data-movie-title");
          // next function call to get the correct gif
          fetchGiphy(movieName, movieId);
        });
      });
    })
    .catch((err) => {
      displayErrorModal();
    });
}

// fetch a gif corresponding with movieName
function fetchGiphy(movieName, movieId) {
  isLoadingApi = true;
  var movieId = movieId;
  var giphyUrl = `https://api.giphy.com/v1/gifs/search?api_key=${giphyKey}&q=${movieName}&limit=1&offset=0&rating=g&lang=en`;

  fetch(giphyUrl)
    .then((response) => response.json())
    .then((content) => {
      console.log(content);
      giphySrc = content.data[0].images.downsized.url;
      //giphyAlt = content.data[0].title;
      fetchMovieInfo(movieId);
    })
    .catch((err) => {
      displayErrorModal();
    });
}
// fetch the basic info of movie from the imdb id
function fetchMovieInfo(movieId) {
  var imdbUrl = `https://imdb-api.com/en/API/Title/${imdbKey}/${movieId}`;

  fetch(imdbUrl)
    .then((response) => response.json())
    .then((data) => {
      var title = data.title;
      var genre = data.genres;
      var poster = data.image;
      var director = data.directors;
      var stars = data.stars;
      var year = data.year;

      console.log(data);

      mainContent = "";
      mainContent = `<div class="movie-card">
                <div class="movie-title">${title}</div>
                <div class="content">
                    <div class="movie-img"><img src="${poster}" alt=""></div>
                    <div class="movie-info">
                    <ul>
                    <li>Year Produced: ${year}</li>
                    <li>Genre: ${genre}</li>                        
                    <li>Director: ${director}</li>                        
                    <li>Featured Actors: ${stars}</li>
                    <br></br>
                        <li>A gif from your movie search:<img src="${giphySrc}" alt=""></li></ul></div>
                </div>
            </div>`;
      fetchReview(movieId);
    })
    .catch((err) => {
      displayErrorModal();
    });
}
// fetches ratings from the imdb id
function fetchReview(movieId) {
  var imdbUrl = `https://imdb-api.com/en/API/Ratings/${imdbKey}/${movieId}`;

  fetch(imdbUrl)
    .then((response) => response.json())
    .then((data) => {
      isLoadingApi = false;
      var imdbRating = data.imDb;
      var rottenTomatoesRating = data.rottenTomatoes;
      var metacriticRating = data.metacritic;
      var moviedbRating = data.theMovieDb;
      var filmAffinityRating = data.filmAffinity;

      console.log(data);

      mainContent += `<div class="review w-full flex flex-wrap items-center justify-around">
                <div class="review-card flex">
                    <h2>IMDb</h2>
                    <p>${imdbRating}/10</p>
                </div>
                <div class="review-card flex">
                    <h2>Rotten Tomatoes</h2>
                    <p>${rottenTomatoesRating}%</p>
                </div>
                <div class="review-card flex">
                    <h2>Metacritic</h2>
                    <p>${metacriticRating}%</p>
                </div>
                <div class="review-card flex">
                    <h2>The Movie DB</h2>
                    <p>${moviedbRating}/10</p>
                </div>
                <div class="review-card flex">
                    <h2>Film Affinity</h2>
                    <p>${filmAffinityRating}/10</p>
                </div>
            </div>`;

      mainElement.innerHTML = mainContent;
    })
    .catch((err) => {
      displayErrorModal();
    });
}
// when an error is captured from one of the fetch calls
function displayErrorModal() {
  mainElement.innerHTML = `<div id="modal" class="relative p-4 w-96 mx-auto shadow-lg rounded-md">
  <div class="text-center">
      <h4 class="text-lg font-medium text-red-500">Movie Not Found</h4>
      <div class="p-4">
          <p class="text-sm text-black-500">
              Click ok button to close and search for another movie
          </p>
      </div>
      <div class="items-center px-24 py-5">
          <button
              id="close-btn"
              class="px-4 py-2 text-white rounded-full bg-green-500  text-base font-medium w-full hover:bg-green-600 focus:ring-green-300"
          >
              OK
          </button>
      </div>
  </div>
</div>`;
  closeButton = document.getElementById("close-btn");
  closeButton.addEventListener("click", function closeButtonHandler() {
    mainElement.innerHTML = `<div class="intro-container mx-auto 2xl:w-1/3 w-3/4">
    <h1 class="border-b-4 border-indigo-500 pb-4 text-6xl text-center font-bold">Welcome to MovieJuice</h1>
    <p class="text-2xl leading-loose text-center pb-10">Type a movie in the search box and hit that squeeze
        button to find some juicy info on your searched movie. Information includes title, genre, cover art,
        director, cast, and release date. It also displays reviews from Rotten Tomatoes, IMDb, and the New York
        Times with review snippets. Find that perfect movie that juices you up.</p>
</div>`;
    isLoadingApi = false;
  });
}
// search button is pressed
function searchClickHandler() {
  if (!isLoadingApi) {
    var movieName = document.querySelector(".search").value.trim();
    fetchMovieId(movieName);
  }
}

// event listener for search button that takes in searchClickHandler() function
searchBtn.addEventListener("click", searchClickHandler);
// loads the page for the first time
loadPage();
