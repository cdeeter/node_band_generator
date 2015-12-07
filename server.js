// Base Setup
var express = require("express");
var path = require("path");
var swig = require("swig");
var bodyParser = require("body-parser");
var app = express();
var router = express().Router;

// Require body parser for form
app.use(bodyParser());

// Allow static files
app.use(express.static("views"));

// Set up views
app.engine("html", swig.renderFile);
app.set("view engine", "html");
app.set("views", __dirname + "/views");
app.set("view cache", false);
swig.setDefaults({ cache: false });

// Band names
var bandNamePossibilities = {
    "emo": {
        "prefix": [
            "", "My Dark", "The Bleeding", "From Within the", "Tears of",
            "Confessions of the", "Escaping", "Saves the", "Remember the", "Story of the"
        ],
        "suffix": [
            "Dinosaur", "Falls", "Broken Heart", "Romance", "Rose",
            "Unicorn", "Kids", "Reason", "Prophecy", "Tragedy"
        ]
    },
    "punk": {
        "prefix": [
            "The", "Social", "Against", "X", "Negative",
            "Project", "Rise of the", "Anti", "Stray from", "Wasted"
        ],
        "suffix": [
            "Change", "Dead", "Society", "Grrrl", "Religion",
            "Human", "Revolution", "Pixels", "Wednesday", "X"
        ]
    },
    "metal": {
        "prefix": [
            "The", "", "Death to", "Decapitated", "Goat", "Infected",
            "Eternal", "Angry", "Screams of", "Feast of", "Rain from"
        ],
        "suffix": [
            "Satan", "Jesus", "Carnage", "Hate", "Scorn",
            "Rainbows", "Puppies", "Blood Hounds", "Steel", "Chaos"
        ]
    }
};

// Band member names
var bandMemberPossibilities = {
    "firstNames": [
        "Gerard", "Hayley", "Mark", "Amy", "Axl", 
        "Jordan", "Crimson", "Eloise", "Ian", "Ivy", 
        "Jethro", "Alex", "Kelly", "Aiden", "Ari", 
        "Sage", "Stevie", "Jayden",  "Emery", "Dallas"
    ],
    "lastNames": {
        "emo": [
            "Hawthorne", "Thursday", "Braid", "McCracken", "Wentz",
            "Williams", "Lacey", "Iero", "Heartstrings", "Lazzara"
        ],
        "punk": [
            "White", "Ramone", "Hoppus", "Vail", "Barker",
            "Revolution", "Armstrong", "Only", "Sioux", "Hanna"
        ],
        "metal": [
            "Hetfield", "Osbourne", "Halford", "Mustaine", "Flame",
            "Lemmy", "Belladonna", "Keenan", "Draiman", "Death"
        ]
    }
}

// Pick random band name
var getBandName = function(genre) {
    var randomNum1 = Math.floor(Math.random() * (9 - 0 + 1) + 0);
    var randomNum2 = Math.floor(Math.random() * (9 - 0 + 1) + 0);
    return bandNamePossibilities[genre].prefix[randomNum1] + " " + bandNamePossibilities[genre].suffix[randomNum2];
};

// Pick random band member name 
var getMemberName = function(genre) {
    var randomNum1 = Math.floor(Math.random() * (19 - 0 + 1) + 0);
    var randomNum2 = Math.floor(Math.random() * (9 - 0 + 1) + 0);
    return bandMemberPossibilities.firstNames[randomNum1] + " " + bandMemberPossibilities.lastNames[genre][randomNum2];
};

// Load the index page
app.get("/", function(req, res) {
    res.render("index");
});

// Process form
app.post("/bandResult", function(req, res) {
    // Get genre the user clicked
    var genre = req.body.genre;
    // Get randomized band name for the genre
    var bandName = getBandName(genre);
    // Possible instruments
    var instruments = req.body.instruments;
    // Array of band members
    var bandMembers = [];
    
    // Get a randomized band member for each instrument
    for (var i = 0; i < instruments.length; i++) {
        var randomMember = getMemberName(genre);
        bandMembers.push({"name": randomMember, "instrument": instruments[i]});
    }
    
    console.log(req.body, instruments.length, bandMembers);

    // Set up band members to be rendered
    var bandInfo = {genre: genre, bandName: bandName, members: bandMembers};
    
    // Render band.html
    res.render("band", bandInfo);
});

// Listen on port 8080
app.listen(8000);

// Middleware for error handling
app.use(function(err, req, res, next) {
    if (err) {
        console.log(err);
        return res.send("There was an error getting your band name. Please make sure you "+
                        "select a genre and at least one instrument.<br/><br/><a href='/'>Go Back</a>");
    } 
});