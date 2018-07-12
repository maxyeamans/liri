// Get .env values into the app
require("dotenv").config();
const Twitter = require("twitter");
const Spotify = require("node-spotify-api");
const request = require("request");
const fs = require("fs");
const keys = require("./keys.js");

// Hold the command for this round
const COMMAND = process.argv[2];

// Hold all of the Node arguments, minus the first three
const nodeArg = process.argv.slice(3);

// Join the process args into a single string for API calls
const COMMAND_ARG = nodeArg.join(" ");

// Determine what the user's input should do
function pickSomeCommand(aCommand, aCommandArg) {
    switch (aCommand) {
        case "my-tweets":
            getTweets();
            break;
        case "spotify-this-song":
            getSongInfo(aCommandArg);
            break;
        case "movie-this":
            getMovieInfo(aCommandArg);
            break;
        case "do-what-it-says":
            doSomething();
            break;
        default:
        // do stuff
    };
};

// Run a function based on the user's input
pickSomeCommand(COMMAND, COMMAND_ARG);

// API reference: https://developer.twitter.com/en/docs/tweets/timelines/api-reference/get-statuses-user_timeline.html
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
        screen_name: "maxyeamans",
        count: 20
    }

    // Make the request
    client.get("statuses/user_timeline", tweetParams, function (error, tweets, response) {
        if (error) {
            console.log("Something went wrong");
        }
        else {
            console.log("Tweets from @" + tweetParams.screen_name + ":");
            tweets.forEach(function (tweet) {
                console.log(tweet.text + "\n");
            });
        }
    })
};

// Function to get info about a track from Spotify
function getSongInfo(song) {
    // This needs to get:
    /*  Artist(s)
    Song name
    Album
    Preview link for the song */
    
    // If no song is provided, default it to "The Sign" by Ace of Base
    if(song == "") {
        song = "The Sign Ace of Base"
    };

    // Create the Spotify object WITH A CONSTRUCTOR OMG
    let spotifyClient = new Spotify({
        id: keys.spotify.id,
        secret: keys.spotify.secret
    });

    // Search parameter object we'll pass in to the search function
    searchParams = {
        type: "track",
        query: song,
        limit: 1
    };

    // Search for the song
    spotifyClient.search(searchParams, function(err, data) {
        if (err) {
            console.log("Something wrong happened. I blame you.");
            console.log(err);
            return;
        }
        // Little shortcut variable because Spotify returns GIGANTIC response objects
        let objectShortcut = data.tracks.items[0];

        // Display the song results. If you got "The Sign", shame on you.
        console.log("Song: ", objectShortcut.name);
        console.log("Band: ", objectShortcut.artists[0].name);
        console.log("Album: ", objectShortcut.album.name);
        console.log("Preview the song: ", objectShortcut.artists[0].external_urls.spotify);
    });
};

// Function to get movie info based on user input
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
    if (movie === undefined) {
        movie = "Mr. Nobody";
    }

    let queryURL = "http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=trilogy";
    request(queryURL, function (error, response, body) {
        if (error) {
            console.log("Something went wrong", error);
        }
        /* else if (movieResponse.Response === "False") {
            console.log("Are you sure that you typed in an actual movie?");
        } */
        else {
            let movieResponse = JSON.parse(body);
            // Tighten this up somehow
            console.log("Title: ", movieResponse.Title);
            console.log("Year: ", movieResponse.Year);
            console.log("IMDB Rating: ", movieResponse.Ratings[0].Value);
            console.log("Rotten Tomatoes Rating: ", movieResponse.Ratings[1].Value);
            console.log("Produced in: ", movieResponse.Country);
            console.log("Language: ", movieResponse.Language);
            console.log("Plot: ", movieResponse.Plot);
            console.log("Actors: ", movieResponse.Actors);
        }
    });
};

// This will read random.txt, split the text into a command and command argument, then use those as
// arguments in the pickSomeCommand() function.
function doSomething() {
    // Do a random thing
};