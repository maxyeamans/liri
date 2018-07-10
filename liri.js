// Get .env values into the app
require("dotenv").config();
const Twitter = require("twitter");
const spotify = require("node-spotify-api");
const request = require("request");
const fs = require("fs");
const keys = require("./keys.js");

// Hold the command for this round
const COMMAND = process.argv[2];

// Hold all of the Node arguments, minus the first three
const nodeArg = process.argv.slice(3);

// Join the process args into a single string for API calls
const COMMAND_ARG = nodeArg.join(" ");

switch (COMMAND) {
    case "my-tweets":
        getTweets();
    case "spotify-this-song":
        getSongInfo(COMMAND_ARG);
    case "movie-this":
        getMovieInfo(COMMAND_ARG);
    case "do-what-it-says":
    // do stuff
    default:
    // do stuff
};

function getTweets() {
    // This needs to get the 20 latest tweets from my account
    // Create a Twitter object with all the necessary keys.
    let client = new Twitter({
        consumer_key: keys.twitter.consumer_key,
        consumer_secret: keys.twitter.consumer_secret,
        access_token_key: keys.twitter.access_token_key,
        access_token_secret: keys.twitter.access_token_secret
    });
    // Parameters for the API request
    let tweetParams = {
        user_id: "maxyeamans",
        count: 20
    }

    // Make the request
    client.get("statuses/user_timeline", tweetParams, function (error, tweets, response) {
        if (error) {
            console.log("Something went wrong");
        }
        else {
            console.log(tweets);
        }
    })
};

function getSongInfo(song) {
    // This needs to get:
    /*  Artist(s)
        Song name
        Album
        Preview link for the song */
    // If no song is provided, default it to "The Sign" by Ace of Base
};

function getMovieInfo(movie) {
    // This needs to get
    /*  Title of the movie.
        Year the movie came out.
        IMDB Rating of the movie.
        Rotten Tomatoes Rating of the movie.
        Country where the movie was produced.
        Language of the movie.
        Plot of the movie.
        Actors in the movie.*/
    // If no movie is provided, get the deets for Mr. Nobody
};

function doSomething() {
    // Do a random thing
};