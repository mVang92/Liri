require("dotenv").config();
const OMDBrequest = require("request");
const fs = require("fs");
const keys = require("./keys");
const Twitter = require("twitter");
const Spotify = require("node-spotify-api");

const command = process.argv[2];
const argument = process.argv.slice(3).join("+");

/**
 * Run the application while checking the command and argument passed in
 * 
 * @param command  the task being run
 * @param argument the parameter to go along with the command
 */
function running(command, argument) {
    if (!command) {
        console.log(`Invalid Input\nUse: movie-this (movie), spotify-this-song (song), my-tweets, or do-what-it-says`);
    } else {
        switch (command) {
            case "my-tweets":
                tweets();
                break;
            case "spotify-this-song":
                if (argument === "") {
                    const defaultSong = "Ace of Base: The Sign";
                    spotify(defaultSong);
                    return;
                };
                spotify(argument);
                break;
            case "movie-this":
                if (argument === "") {
                    const defaultMovie = "Mr Nobody";
                    movie(defaultMovie);
                    return;
                };
                movie(argument);
                break;
            case "do-what-it-says":
                doSays();
        };
    };
};

/**
 * Grabs the movie information from the API and displays it to the console
 * 
 * @param movieName the name of the movie to search
 */
function movie(movieName) {
    const queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";
    OMDBrequest(queryUrl, (error, response, data) => {
        if (!error && response.statusCode === 200) {
            const obj = JSON.parse(data)
            console.log('')
            console.log(`Title:                  ${obj.Title}`);
            console.log(`Release Year:           ${obj.Year}`);
            console.log(`IMDB Rating:            ${obj.imdbRating}`);
            console.log(`Rotten Tomatoes rating: ${obj.Ratings[1].Value}`);
            console.log(`Production Location:    ${obj.Country}`);
            console.log(`Language:               ${obj.Language}`);
            console.log(`Movie Plot:             ${obj.Plot}`);
            console.log(`Main Actors:            ${obj.Actors}`);
        } else {
            return console.log(`Error occurred: ${error}`);
        };
    });
};

/**
 * Grabs the tweets from the user's Twitter account and displays the first 20 to the console
 */
function tweets() {
    const client = new Twitter(keys.twitter);
    client.get("statuses/home_timeline", (error, tweets) => {
        if (!error) {
            tweets.forEach(tweet => {
                console.log(`User Name:     ${tweet.user.name}`);
                console.log(`Tweet Time:    ${tweet.created_at}`);
                console.log(`Tweet Content: ${tweet.text}`);
                console.log(`-------------------------------`);
            });
        } else {
            console.log(`No Tweets to Show`);
        };
    });
};

/**
 * Grabs the song information from the API and displays it to the console
 * 
 * @param song the name of the song to search
 */
function spotify(song) {
    const spotify = new Spotify(keys.spotify);
    spotify.search({ type: 'track', query: song }, (error, data) => {
        try {
            result = data.tracks.items[0];
            if (!error) {
                console.log("");
                console.log(`Artist:    ${result.album.artists[0].name}`);
                console.log(`Song name: ${result.name}`);
                console.log(`Album:     ${result.album.name}`);
                console.log(`Link:      ${result.external_urls.spotify}`);
            } else {
                return console.log(`Error occurred: ${error}`);
            };
        } catch (stackTrace) {
            console.log(`There was an error processing your request. Check your internet connection.`);
            fs.writeFile("./errorLog.txt", stackTrace, (error) => {
                if (error) {
                    return console.log(`Error processing errorLog.txt`)
                };
                console.log(`More information about this error located in the errorLog.txt file.`)
            });
        };
    });
};

/**
 * Reads from the random.txt file and determines the command and arguments from there
 */
function doSays() {
    fs.readFile("./random.txt", "UTF8", (error, data) => {
        if (error) {
            return console.log(`Error occurred: ${error}`);
        };
        const file = data.split(",");
        running(file[0], file[1]);
    });
};

running(command, argument);
