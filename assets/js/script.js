// global vars
var mainElement = document.getElementById('main-container');
var searchBtn = document.getElementById('button-addon3')

var imdbKey = "k_hgh27181"
var nyKey = "qahEBcpxGK8ZuOKPZA5GjnMtifJClbCm"

// update page to the default clearing out any dynamic children
function clearScreen () {

}

// fetch data from the apis then call a function with that data inside to update the elements
function fetchMovieId (movieName) {
    var imdbUrl = `https://imdb-api.com/en/API/SearchMovie/${imdbKey}/${movieName}`
    var nyUrl = `https://api.nytimes.com/svc/movies/v2/reviews/search.json?query=${movieName}&api-key=${nyKey}`

    fetch(imdbUrl)
    .then(function(response){
        if(response.ok){
            response.json().then(function(data){
                var movieId = data.results[0].id
                console.log(movieId)
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