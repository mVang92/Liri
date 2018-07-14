require("dotenv").config();
var OMDBrequest = require("request");
var read = require("fs");

// var Twitter = require("twitter");
// var keys = require("keys.js");
// var spotify = new Spotify(keys.spotify);
// var client = new Twitter(keys.twitter);

var command = process.argv[2];
// Allows the user to input movies that have more than one word
var args = process.argv.slice(3).join("+");

// Pass in the command and arguments into the running function
running(command, args);

function running(com, arg) {
    // console.log("running")
    switch (command) {
        case "my-tweets":
            tweets();
            break;
        case "spotify-this-song":
            spotify();
            break;
        case "movie-this":
            // If the user enters no value for movies, default to Mr Nobody
            if (args === "") {
                var defaultMovie = "Mr Nobody";
                movie(defaultMovie);
                return;
            }
            movie(args);
            break;
        case "do-what-it-says":
            doSays();
            break;
    };
}

function movie(movieName) {
    // console.log("movie")
    var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";

    OMDBrequest(queryUrl, function (err, response, data) {
        if (!err && response.statusCode === 200) {
            let obj = JSON.parse(data)
            console.log('')
            console.log("Title: " + obj.Title);
            console.log("Release Year: " + obj.Year);
            console.log("IMDB Rating: " + obj.imdbRating);
            console.log("Rotten Tomatoes rating: " + obj.Ratings[1].Value);
            console.log("Production Location: " + obj.Country);
            console.log("Language: " + obj.Language);
            console.log("Movie Plot: " + obj.Plot);
            console.log("Main Actors: " + obj.Actors);
        }
    })
}

function doSays() {
    read.readFile("random.txt", "UTF8", function (err, data) {
        if (err) {
            console.log(err);
        }
        // Split, separates text by what ever is inside the quotes
        // This will split the elements in the file by commas
        var split = data.split(",");
        // Just to make it look better in the terminal
        for (var i = 0; i < split.length; i++) {
            console.log(split[i]);
        }
    })
}