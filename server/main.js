import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

import nlp from 'nlp_compromise';

Meteor.startup(() => {
  // code to run on server at startup
});

import '../imports/api/tasks.js';
import '../imports/api/queries.js';
//import '../collections/articles.js';

Meteor.methods({
    'runQuery': function (mySearchTerm) {
        // Process starting...
        console.log("Server-side Scrape & NLP: "+ mySearchTerm)

        // Scrape main Irish websites
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
        Articles.remove({});

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

            // Display link on console
            console.log(articleLink);

            // Get the first person the article mentions
            if (articlePeople.length!=0) {
                person1 = articlePeople[0].text;
            }

            // Date info retrieved
            retrievalDate = new Date;

            // Sorting empty images (Irish Times & The Examiner have none)
            if (articleImage == "") {
                articleImage = "https://www.heighpubs.org/articleIcons/0423042031704article-icon[1].png"
            }

            // Stored the info in an object
            obj = new Object({
                title: articleTitle,
                date: articleDate,
                description: articleDescription,
                image: articleImage,
                link: articleLink,
                text: articleInfo.text,
                person1: person1,
                visible: "",
                source: articleSource,
            });
            // Insert into Articles database
            Articles.insert(obj);
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

            // Display link on console
            console.log(articleLink);

            // Get the first person the article mentions
            if (articlePeople.length!=0) {
                person1 = articlePeople[0].text;
            }

            // Date info retrieved
            retrievalDate = new Date;

            // Sorting empty images (Irish Times & The Examiner have none)
            if (articleImage == "") {
                articleImage = "https://www.heighpubs.org/articleIcons/0423042031704article-icon[1].png"
            }

            // Stored the info in an object
            obj = new Object({
                title: articleTitle,
                date: articleDate,
                description: articleDescription,
                image: articleImage,
                link: articleLink,
                text: articleInfo.text,
                person1: person1,
                visible: "",
                source: articleSource,
            });
            // Insert into Articles database
            Articles.insert(obj);
            // Add the object to position i in array
            //returnThis[i] = obj;
        }

        // ========== Irish Independent scraping... ==========
        console.log("Scraping Irish Independent Data");

        // Irish Independent - Transform Retrieve Data into Usable Information
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

            // Display link on console
            console.log(articleLink);

            // Get the first person the article mentions
            if (articlePeople.length!=0) {
                person1 = articlePeople[0].text;
            }

            // Date info retrieved
            retrievalDate = new Date;

            // Sorting empty images (Irish Times & The Examiner have none)
            if (articleImage == "") {
                articleImage = "https://www.heighpubs.org/articleIcons/0423042031704article-icon[1].png"
            }

            // Stored the info in an object
            obj = new Object({
                title: articleTitle,
                date: articleDate,
                description: articleDescription,
                image: articleImage,
                link: articleLink,
                text: articleInfo.text,
                person1: person1,
                visible: "",
                source: articleSource,
            });
            // Insert into Articles database
            Articles.insert(obj);
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

            // Display link on console
            console.log(articleLink);

            // Get the first person the article mentions
            if (articlePeople.length!=0) {
                person1 = articlePeople[0].text;
            }

            // Date info retrieved
            retrievalDate = new Date;

            // Sorting empty images (Irish Times & The Examiner have none)
            if (articleImage == "") {
                articleImage = "https://www.heighpubs.org/articleIcons/0423042031704article-icon[1].png"
            }

            // Stored the info in an object
            obj = new Object({
                title: articleTitle,
                date: articleDate,
                description: articleDescription,
                image: articleImage,
                link: articleLink,
                text: articleInfo.text,
                person1: person1,
                visible: "",
                source: articleSource,
            });
            // Insert into Articles database
            Articles.insert(obj);
            // Add the object to position i in array
            //returnThis[i] = obj;
        }

        // return the array for Session variable
        //return returnThis;
    },
    'testing': function () {
        console.log("Server test works!");
    }
});