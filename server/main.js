import { Meteor } from 'meteor/meteor';
import nlp from 'nlp_compromise';

Meteor.startup(() => {
  // code to run on server at startup
});

import '../imports/api/tasks.js';
import '../imports/api/queries.js';

Meteor.methods({
    'runQuery': function (mySearchTerm) {
        console.log("Hello server!"+ mySearchTerm)
        // Scrape main Irish websites
        websiteData = Scrape.feed("http://www.rte.ie/news/rss/news-headlines.xml");
        //console.log(websiteData);
        // Array to Return
        returnThis = new Array();

        // Transform the scraped data into People, Places, Things, Important Sentences, Sentiment
        for (i=0; i<websiteData.items.length; i++) {
            articleTitle = websiteData.items[i].title; // Get the title
            articleDate = websiteData.items[i].pubDate; // Get the date
            articleLink = websiteData.items[i].link; // Get the hyperlink
            articleImage = websiteData.items[i].image; // Get the image
            articleDescription = websiteData.items[i].description; // Get the description
            // Scrape the text of the article
            articleInfo = Scrape.website(articleLink);
            // Find the named people in the text
            articlePeople = nlp.text(articleInfo.text).people();

            // Get the first person the article mentions
            if (articlePeople.length!=0) {
                person1 = articlePeople[0].text;
            }

            // Date info retrieved
            retrievalDate = new Date;

            if (mySearchTerm == person1) {
                // Stored the info in an object
                obj = new Object({
                    title: articleTitle,
                    date: articleDate,
                    description: articleDescription,
                    image: articleImage,
                    link: articleLink,
                    text: articleInfo.text,
                    person1: person1
                });
            }
            else {
                obj = new Object({
                    title:"No Results Found"
                });
            }
            returnThis[i] = obj;
        }

        // Add the info to the database (so as that it can be displayed/searched)
        return returnThis;
    },
    'testing': function () {
        console.log("Server test works!");
    }
});