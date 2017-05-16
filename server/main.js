import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

import nlp from 'nlp_compromise';

Meteor.startup(() => {
    // Start chron job when Meteor server starts up
    SyncedCron.start();
});

import '../imports/api/tasks.js';
import '../imports/api/queries.js';
//import '../collections/articles.js';

SyncedCron.add({
    name: 'Scraping Sources, Parsing Data, and Inserting to Database',
    schedule: function(parser) {
        // Run job every 15 minutes
        return parser.text('every 15 mins');
    },
    job: function () {
        // Process starting
        console.log("Server-side Scrape & NLP");

        // Scrape top Irish news sources
        websiteData = Scrape.feed("http://www.rte.ie/news/rss/news-headlines.xml");
        irishTimesData = Scrape.feed("https://www.irishtimes.com/cmlink/news-1.1319192");
        independentData = Scrape.feed("http://www.independent.ie/breaking-news/irish-news/?service=Rss");
        examinerData = Scrape.feed("http://feeds.examiner.ie/ieireland");

        // Trying to combine the two returned objects - NO JOY!
        // GET THIS SORTED OR JUST DO SEPARATE CALLS AND STORE IN DATABASE
        // websiteData = _.extend(rteData, independentData, irishTimesData, examinerData);
        // console.log(websiteData.items.length);

        // Array to Return
        returnThis = new Array();

        // Empty the Articles DB
        //Articles.remove({});

        // ========== RTE.ie scraping... ==========
        console.log("Scraping RTE.ie Data");

        // RTE.ie - Transform Retrieve Data into Usable Information
        for (i=0; i<websiteData.items.length; i++) {

            // === NLP Processing ===
            articleTitle = websiteData.items[i].title; // Get the title
            articleDate = websiteData.items[i].pubDate; // Get the date
            articleLink = websiteData.items[i].link; // Get the hyperlink
            articleImage = websiteData.items[i].image; // Get the image
            articleDescription = websiteData.items[i].description; // Get the description
            articleInfo = Scrape.website(articleLink); // Scrape the text of the article
            articlePeople = nlp.text(articleInfo.text).people(); // Find the named people in the text
            articleSource = "RTE";

            var exists = Articles.findOne({title: articleTitle});

            // Checking to see if the article title already exists in the DB

            // If it does: don't do anything...
            if (exists != null) {
                console.log("Found in DB: Ignoring");
            }
            // Else keep going and add it to the DB...
            else {
                console.log("Not found: Adding to DB");

                // Sentimient Analysis
                var r1 = sentiment(articleInfo.text);

                if (r1.score >= 1){
                    polarity = "pos";
                    polcolor = "success";
                } else if (r1.score <= -1) {
                    polarity = "neg";
                    polcolor = "danger";
                } else if (r1.score <1 && r1.score >-1) {
                    polarity = "neu";
                    polcolor = "info";
                }
                var positiveWords = r1.positive;
                var negativeWords = r1.negative;

                // Display link on console
                console.log(articleLink);

                // Get the first person the article mentions
                if (articlePeople.length!=0) {
                    person1 = articlePeople[0].text;
                }
                if (articlePeople.length>1) {
                    person2 = articlePeople[1].text;
                }

                // Date info retrieved
                retrievalDate = new Date;

                // Sorting empty images (Irish Times & The Examiner have none)
                if (articleImage == "") {
                    articleImage = "http://www.bmt-ag.com/img/News.gif";
                }

                // Get a readable date
                cleanDate = articleDate.toDateString();

                // Stored the info in an object
                obj = new Object({
                    title: articleTitle,
                    date: articleDate,
                    cleanDate: cleanDate,
                    description: articleDescription,
                    image: articleImage,
                    link: articleLink,
                    text: articleInfo.text,
                    person1: person1,
                    person2: person2,
                    visible: "",
                    source: articleSource,
                    score: r1.score,
                    comparative: r1.comparative,
                    negWords: negativeWords,
                    posWords: positiveWords,
                    polarity: polarity,
                    polcolor: polcolor,
                });
                // Insert into Articles database
                Articles.insert(obj);
            };
            // Add the object to position i in array
            //returnThis[i] = obj;
        }
        // ========== Irish Times scraping... ==========
        console.log("Scraping Irish Times Data");

        // Irish Times - Transform Retrieve Data into Usable Information
        for (i=0; i<irishTimesData.items.length; i++) {

            // === NLP Processing ===
            articleTitle = irishTimesData.items[i].title; // Get the title
            articleDate = irishTimesData.items[i].pubDate; // Get the date
            articleLink = irishTimesData.items[i].link; // Get the hyperlink
            articleImage = irishTimesData.items[i].image; // Get the image
            articleDescription = irishTimesData.items[i].description; // Get the description
            articleInfo = Scrape.website(articleLink); // Scrape the text of the article
            articlePeople = nlp.text(articleInfo.text).people(); // Find the named people in the text
            articleSource = "Irish Times";

            // Checking to see if the article title already exists in the DB

            // If it does: don't do anything...
            if (exists != null) {
                console.log("Found in DB: Ignoring");
            }
            // Else keep going and add it to the DB...
            else {
                console.log("Not found: Adding to DB");
                // Sentimient Analysis
                var r1 = sentiment(articleInfo.text);

                if (r1.score >= 1) {
                    polarity = "pos";
                    polcolor = "success";
                } else if (r1.score <= -1) {
                    polarity = "neg";
                    polcolor = "danger";
                } else if (r1.score < 1 && r1.score > -1) {
                    polarity = "neu";
                    polcolor = "info";
                }
                var positiveWords = r1.positive;
                var negativeWords = r1.negative;

                // Display link on console
                console.log(articleLink);

                // Get the first person the article mentions
                if (articlePeople.length != 0) {
                    person1 = articlePeople[0].text;
                }
                if (articlePeople.length>1) {
                    person2 = articlePeople[1].text;
                }

                // Date info retrieved
                retrievalDate = new Date;

                // Sorting empty images (Irish Times & The Examiner have none)
                if (articleImage == "") {
                    articleImage = "http://www.bmt-ag.com/img/News.gif";
                }

                // Get a readable date
                cleanDate = articleDate.toDateString();

                // Stored the info in an object
                obj = new Object({
                    title: articleTitle,
                    date: articleDate,
                    cleanDate: cleanDate,
                    description: articleDescription,
                    image: articleImage,
                    link: articleLink,
                    text: articleInfo.text,
                    person1: person1,
                    person2: person2,
                    visible: "",
                    source: articleSource,
                    score: r1.score,
                    comparative: r1.comparative,
                    negWords: negativeWords,
                    posWords: positiveWords,
                    polarity: polarity,
                    polcolor: polcolor,
                });
                // Insert into Articles database
                Articles.insert(obj);
            };
            // Add the object to position i in array
            //returnThis[i] = obj;
        }

        // ========== Irish Independent scraping... ==========
        console.log("Scraping Irish Independent Data");

        // Irish Independent - Transform Retrieved Data into Usable Information
        for (i=0; i<independentData.items.length; i++) {
            // === NLP Processing ===
            articleTitle = independentData.items[i].title; // Get the title
            articleDate = independentData.items[i].pubDate; // Get the date
            articleLink = independentData.items[i].link; // Get the hyperlink
            articleImage = independentData.items[i].image; // Get the image
            articleDescription = independentData.items[i].description; // Get the description
            articleInfo = Scrape.website(articleLink); // Scrape the text of the article
            articlePeople = nlp.text(articleInfo.text).people(); // Find the named people in the text
            articleSource = "Irish Independent";

            // Checking to see if the article already exists in the DB
            // If it does: don't do anything...
            if (exists != null) {
                console.log("Found in DB: Ignoring");
            }
            // Else keep going and add it to the DB...
            else {
                console.log("Not found: Adding to DB");
                // Sentimient Analysis
                var r1 = sentiment(articleInfo.text);

                if (r1.score >= 1) {
                    polarity = "pos";
                    polcolor = "success";
                } else if (r1.score <= -1) {
                    polarity = "neg";
                    polcolor = "danger";
                } else if (r1.score < 1 && r1.score > -1) {
                    polarity = "neu";
                    polcolor = "info";
                }
                var positiveWords = r1.positive;
                var negativeWords = r1.negative;

                // Display link on console
                console.log(articleLink);

                // Get the first person the article mentions
                if (articlePeople.length != 0) {
                    person1 = articlePeople[0].text;
                }
                if (articlePeople.length>1) {
                    person2 = articlePeople[1].text;
                }

                // Date info retrieved
                retrievalDate = new Date;

                // Sorting empty images (Irish Times & The Examiner have none)
                if (articleImage == "") {
                    articleImage = "http://www.bmt-ag.com/img/News.gif";
                }

                // Get a readable date
                cleanDate = articleDate.toDateString();

                // Stored the info in an object
                obj = new Object({
                    title: articleTitle,
                    date: articleDate,
                    cleanDate: cleanDate,
                    description: articleDescription,
                    image: articleImage,
                    link: articleLink,
                    text: articleInfo.text,
                    person1: person1,
                    person2: person2,
                    visible: "",
                    source: articleSource,
                    score: r1.score,
                    comparative: r1.comparative,
                    negWords: negativeWords,
                    posWords: positiveWords,
                    polarity: polarity,
                    polcolor: polcolor,
                });
                // Insert into Articles database
                Articles.insert(obj);
            };
            // Add the object to position i in array
            //returnThis[i] = obj;
        }

        // ========== Irish Examiner scraping... ==========
        console.log("Scraping Irish Examiner Data");

        // Irish Examiner - Transform Retrieve Data into Usable Information
        for (i=0; i<examinerData.items.length; i++) {
            // === NLP Processing ===
            articleTitle = examinerData.items[i].title; // Get the title
            articleDate = examinerData.items[i].pubDate; // Get the date
            articleLink = examinerData.items[i].link; // Get the hyperlink
            articleImage = examinerData.items[i].image; // Get the image
            articleDescription = examinerData.items[i].description; // Get the description
            articleInfo = Scrape.website(articleLink); // Scrape the text of the article
            articlePeople = nlp.text(articleInfo.text).people(); // Find the named people in the text
            articleSource = "Irish Examiner";

            // Checking to see if the article title already exists in the DB

            // If it does: don't do anything...
            if (exists != null) {
                console.log("Found in DB: Ignoring");
            }
            // Else keep going and add it to the DB...
            else {
                console.log("Not found: Adding to DB");
                // Sentimient Analysis
                var r1 = sentiment(articleInfo.text);

                if (r1.score >= 1) {
                    polarity = "pos";
                    polcolor = "success";
                } else if (r1.score <= -1) {
                    polarity = "neg";
                    polcolor = "danger";
                } else if (r1.score < 1 && r1.score > -1) {
                    polarity = "neu";
                    polcolor = "info";
                }
                var positiveWords = r1.positive;
                var negativeWords = r1.negative;

                // Display link on console
                console.log(articleLink);

                // Get the first person the article mentions
                if (articlePeople.length != 0) {
                    person1 = articlePeople[0].text;
                }
                if (articlePeople.length>1) {
                    person2 = articlePeople[1].text;
                }

                // Date info retrieved
                retrievalDate = new Date;

                // Sorting empty images (Irish Times & The Examiner have none)
                if (articleImage == "") {
                    articleImage = "http://www.bmt-ag.com/img/News.gif";
                }

                // Get a readable date
                cleanDate = articleDate.toDateString();

                // Stored the info in an object
                obj = new Object({
                    title: articleTitle,
                    date: articleDate,
                    cleanDate: cleanDate,
                    description: articleDescription,
                    image: articleImage,
                    link: articleLink,
                    text: articleInfo.text,
                    person1: person1,
                    person2: person2,
                    visible: "",
                    source: articleSource,
                    score: r1.score,
                    comparative: r1.comparative,
                    negWords: negativeWords,
                    posWords: positiveWords,
                    polarity: polarity,
                    polcolor: polcolor,
                });
                // Insert into Articles database
                Articles.insert(obj);
                // Add the object to position i in array
                //returnThis[i] = obj;
            };
        }

        // return the array for Session variable
        //return returnThis;
    },
    'testing': function () {
        console.log("Server test works!");
    }
});

Meteor.methods({
    'findTweets': function(mySearchTerm){
        console.log("Hello server!" + mySearchTerm);
        // Remove all tweets from collection (fresh search)
        Tweets.remove({});

        var TwitterPosts, streamOfTweets, rteStreamTweets;
        TwitterPosts = require('twitter-screen-scrape');

        rteStreamTweets = new TwitterPosts({
            username: 'rte',
            retweets: false
        });

        rteStreamTweets.on('readable', function() {
            var time, tweet;
            tweet = rteStreamTweets.read();
            time = new Date(tweet.time * 1000);
            Tweets.insert({
                time: time.toLocaleDateString(),
                tweet: tweet.text,
                source: "RTE",
            });
            console.log([
                "RTE's tweet from ",
                time.toLocaleDateString(),
                " is ",
                tweet.text
            ].join(''));
        });

        streamOfTweets = new TwitterPosts({
            username: 'Independent_ie',
            retweets: false
        });

        streamOfTweets.on('readable', function() {
            var time, tweet;
            tweet = streamOfTweets.read();
            time = new Date(tweet.time * 1000);
            Tweets.insert({
                time: time.toLocaleDateString(),
                tweet: tweet.text,
                source: "Irish Independent",
            });
            console.log([
                "Irish Independent's tweet from ",
                time.toLocaleDateString(),
                " is ",
                tweet.text
            ].join(''));
        });
    }
});