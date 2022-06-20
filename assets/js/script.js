// global vars
var mainElement = document.getElementById("main-container");
var searchBtn = document.getElementById("button-addon3");
var mainContent = "";
var imdbKey = "k_4old2p2l";
var nyKey = "qahEBcpxGK8ZuOKPZA5GjnMtifJClbCm";

// new var to deal with the fetches
var isLoadingApi = false;

// fetch data from the apis then call a function with that data inside to update the elements
function fetchMovieId(movieName) {
  var imdbUrl = `https://imdb-api.com/en/API/SearchMovie/${imdbKey}/${movieName}`;
  isLoadingApi = true;
  fetch(imdbUrl).then(function (response) {
    if (response.ok) {
      response.json().then(function (data) {
        mainContent = `<div class="img-container">
            <h5 class="text-5xl text-center mb-8">Choose your movie</h5>
            <div class="flex flex-row justify-around">`;
        for (var i = 0; i < data.results.length; i++) {
          var movieId = data.results[i].id;
          var movieName = data.results[i].title;
          var movieInfo = data.results[i].description;
          var movieImageSrc = data.results[i].image;
          mainContent += `<div class="img-button-container cursor-pointer hover:-translate-y-2 hover:border-4">
                    <h5 class="text-center py-2 bg-zinc-400">${movieName}</h5>
                    <img
                      class="img-button w-56"
                      src="${movieImageSrc}"
                      alt=""
                      data-movie-id="${movieId}"
                      data-movie-title="${movieName}"
                    />
                    <h5 class="text-center py-2 bg-zinc-400">${movieInfo}</h5>
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
            fetchNyTimes(movieName, movieId);
          });
        });
      });
    }
  });
}
// this will be removed
function fetchNyTimes(movieName, movieId) {
  isLoadingApi = true;
  var movieId = movieId;
  var nyUrl = `https://api.nytimes.com/svc/movies/v2/reviews/search.json?query=${movieName}&api-key=${nyKey}`;

  fetch(nyUrl).then(function (response) {
    if (response.ok) {
      response.json().then(function (data) {
        console.log(data);
        // will need to check if the name exists in the data results will loop through until movieName === result.title if it does not display no new york times info

        for (var i = 0; i < data.results.length; i++) {
          // this will make sure we get the correct movie from ny api
          console.log(data.results[i].display_title, movieName);
          if (data.results[i].display_title === movieName) {
            author = data.results[i].byline;
            headline = data.results[i].headline;
            nyReview = data.results[i].summary_short;
            nyUrlFullArticle = data.results[i].link.url;
            urlName = data.results[i].link.suggested_link_text;

            fetchMovieInfo(movieId);
            // this will exit the loop and the function
            return;
          }
        }
        fetchMovieInfo(movieId);
      });
    }
  });
}

function fetchMovieInfo(movieId) {
  var imdbUrl = `https://imdb-api.com/en/API/Title/${imdbKey}/${movieId}`;

  fetch(imdbUrl).then(function (response) {
    if (response.ok) {
      response.json().then(function (data) {
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
                        <li>${year}</li>
                        <li>${genre}</li>
                        <li>${director}</li>
                        <li>${stars}</li>
                        <li>${nyReview}</li></ul></div>
                </div>
            </div>`;
        fetchReview(movieId);
      });
    }
  });
}

function fetchReview(movieId) {
  var imdbUrl = `https://imdb-api.com/en/API/Ratings/${imdbKey}/${movieId}`;

  fetch(imdbUrl).then(function (response) {
    if (response.ok) {
      response.json().then(function (data) {
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
      });
    }
  });
}

// search click handler after click it does the fetch
function searchClickHandler() {
  if (!isLoadingApi) {
    var movieName = document.querySelector(".search").value.trim();
    fetchMovieId(movieName);
  }
}

// event listener for search button that takes in searchClickHandler() function
searchBtn.addEventListener("click", searchClickHandler);