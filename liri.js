// Get .env values into the app
require("dotenv").config();
// Add in the modules
const Twitter = require("twitter");
const Spotify = require("node-spotify-api");
const request = require("request");
const fs = require("fs");
// Keys for Twitter and Spotify
const keys = require("./keys.js");
// Separator text for logging in console and text files
const logSeparator = "\n==========\n";

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
            console.log("Next time, try using my-tweets, spotify-this-song, movie-this, or do-what-it-says as arguments.");
    };
};

// Run a function based on the user's input
pickSomeCommand(COMMAND, COMMAND_ARG);

// Run this when the user passes the node argument "my-tweets". No additional args required.
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
        screen_name: "mitchhedbot",
        count: 20
    }
    // Switched this to show tweets from a bot that just does Mitch Hedberg jokes.
    // Everyone loves Mitch's jokes. Not as many people like my tweets.

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

/*  Run this when the user passes the node argument "spotify-this-song".
    Accepts a song title after the call as a series of strings and concatenates them into one argument, like so:
        spotify-this-song all the small things
    or you can pass a string in quotes, like so:
        spotify-this-song "all the small things"
    The latter works more consistently than the former. */
function getSongInfo(song) {
    // If no song is provided, default it to "The Sign" by Ace of Base.
    if (song == "") {
        song = "The Sign Ace of Base";
    };
    // Please don't actually let this happen.

    // Create the Spotify object
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
    spotifyClient.search(searchParams, function (err, data) {
        if (err) {
            console.log("Something wrong happened. I blame you.");
            console.log(err);
            return;
        }
        // Little shortcut variable because Spotify returns GIGANTIC response objects
        let spotifyResults = data.tracks.items[0];

        // Display the song results. If you got "The Sign", shame on you.
        let arrLog = [];
        arrLog.push("Song: " + spotifyResults.name);
        arrLog.push("Band: " + spotifyResults.artists[0].name);
        arrLog.push("Album: " + spotifyResults.album.name);
        arrLog.push("Preview the song: " + spotifyResults.artists[0].external_urls.spotify);
        arrLog.push(logSeparator);
        logAndStoreResults(arrLog);
    });
};

/*  Run this when the user passes the node argument "movie-this".
    Accepts a movie title after the call as a series of strings and concatenates them into one argument, like so
        movie-this empire strikes back
    or you can pass a string in quotes, like so
        movie-this "empire strikes back"
    The latter works more consistently than the former. */
function getMovieInfo(movie) {
    // If no movie is provided, get the deets for Mr. Nobody
    if (movie === "") {
        movie = "Mr. Nobody";
    }
    // Variable to hold the query URL
    let queryURL = "http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=trilogy";
    // API request
    request(queryURL, function (error, response, body) {
        let movieResponse = JSON.parse(body);
        if (error || movieResponse.Response == "False") {
            console.log("Something went wrong. Try again?", error);
        }
        else {
            let arrLog = [];
            arrLog.push("Title: " + movieResponse.Title);
            arrLog.push("Year: " + movieResponse.Year);
            arrLog.push("IMDB Rating: " + movieResponse.Ratings[0].Value);
            arrLog.push("Rotten Tomatoes Rating: " + movieResponse.Ratings[1].Value);
            arrLog.push("Produced in: " + movieResponse.Country);
            arrLog.push("Language: " + movieResponse.Language);
            arrLog.push("Plot: " + movieResponse.Plot);
            arrLog.push("Actors: " + movieResponse.Actors);
            arrLog.push(logSeparator);
            logAndStoreResults(arrLog);
        }
    });
};

/* This will read random.txt, split the text into a command and command argument, then use those as
arguments in the pickSomeCommand() function. */
function doSomething() {
    // Read the text file
    fs.readFile("random.txt", "utf-8", function (err, data) {
        if (err) {
            return console.log("Something went wrong.", err);
        }
        // Split the text result into an array with a command and a command argument
        const arrCommand = data.split(",");
        // Run the function with the command and its argument
        pickSomeCommand(arrCommand[0], arrCommand[1]);
    });
};

// Log the results of each query to a text file and display in the console.
function logAndStoreResults(arrResult) {
    arrResult.forEach( function(item){
        fs.appendFileSync("log.txt", "\n" + item, function(err){
            if(err){
                return console.log("Something went wrong. And I blame you.");
            }
        });
        console.log(item);
    });
    // Alternative for one append file rather than multiple in a loop
    // Comment out the code above and uncomment this to have a function that still works in the asynchronous spirit of javascript.
    /* var arrString = "";

    for (let i = 0; i < arrResult.length; i++) {
        arrString += "\n" + arrResult[i];
    };
    fs.appendFile("log.txt", arrString, function (err) {
        if (err) {
            return console.log("Something went wrong. And I blame you.");
        }
    });
    console.log(arrString); */
};