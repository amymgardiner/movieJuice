// global vars
var mainElement = document.getElementById('main-container');
var searchBtn = document.getElementById('button-addon3')
var mainContent = ""
var imdbKey = "k_hgh27181"
var nyKey = "qahEBcpxGK8ZuOKPZA5GjnMtifJClbCm"
var nyReview = ""
var movieId = ""


// fetch data from the apis then call a function with that data inside to update the elements
function fetchMovieId (movieName) {
    var imdbUrl = `https://imdb-api.com/en/API/SearchMovie/${imdbKey}/${movieName}`

    fetch(imdbUrl)
    .then(function(response){
        if(response.ok){
            response.json().then(function(data){
                movieId = data.results[0].id
                console.log(movieId)
                fetchNyTimes(movieName)
            })
        }
    })

}

function fetchNyTimes (movieName) {
    var nyUrl = `https://api.nytimes.com/svc/movies/v2/reviews/search.json?query=${movieName}&api-key=${nyKey}`

    fetch(nyUrl)
    .then(function(response){
        if(response.ok){
            response.json().then(function(data){
                console.log(data)
                nyReview = data.results[0].summary_short
                fetchMovieInfo(movieId)
            })
        }
    })
}

function fetchMovieInfo (movieId) {
    var imdbUrl = `https://imdb-api.com/en/API/Title/${imdbKey}/${movieId}`
    
    fetch(imdbUrl)
    .then(function(response){
        if(response.ok){
            response.json().then(function(data){
                var title = data.title
                var genre = data.genres
                var poster = data.image
                var director = data.directors
                var stars = data.stars
                var year = data.year

                console.log(data)
                
                mainContent = ''
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
            </div>`

            fetchReview(movieId)
            })
        }
    })
    
}

function fetchReview (movieId) {
    var imdbUrl = `https://imdb-api.com/en/API/Ratings/${imdbKey}/${movieId}`

    fetch(imdbUrl)
    .then(function(response){
        if(response.ok){
            response.json().then(function(data){
                var imdbRating = data.imDb
                var rottenTomatoesRating = data.rottenTomatoes
                var metacriticRating = data.metacritic
                var moviedbRating = data.theMovieDb
                var filmAffinityRating = data.filmAffinity

                console.log(data)

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
            </div>`

            mainElement.innerHTML = mainContent
            })
        }
    })
}



// new york times api
// Site https://developer.nytimes.com/docs/movie-reviews-api/1/overview
// EXAMPLE https://api.nytimes.com/svc/movies/v2/reviews/search.json?query=godfather&api-key=yourkey

// imdb api
// this one is where will get all the data for actors/directors/genre/title ect...
// Site https://imdb-api.com/
// https://imdb-api.com/en/API/SearchMovie/k_12345678/inception%202010

// it also has an api for rotten tomatoes reviews
// https://imdb-api.com/en/API/MetacriticReviews/k_12345678/tt1375666

// Update dynamic elements using the data from the fetch

// search click handler after click it does the fetch
function searchClickHandler () {
    var movieName = document.querySelector('.search').value.trim();
    fetchMovieId(movieName);
}


// event listener for search button that takes in searchClickHandler() function
searchBtn.addEventListener("click", searchClickHandler)