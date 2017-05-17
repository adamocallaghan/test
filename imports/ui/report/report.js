import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';

import './report.html';

Template.report.helpers({
    reports() {
        // Return all articles
        return Reports.find({});
    },
});

Template.report.events({
    'click .run-report'(event, instance) {
        // Prevent default browser form submit
        event.preventDefault();
        searchTerm = this.reportTerm;

        // Client log
        console.log("Running Report for " + searchTerm);
        var articleTitles = Articles.find({
            $or: [
                {person2: searchTerm},
                {person1: searchTerm},
            ]
        }).map(function(i){
            return i.title;
        });
        var articlePolarity = Articles.find({
            $or: [
                {person2: searchTerm},
                {person1: searchTerm},
            ]
        }).map(function(i){
            return i.polarity;
        });
        var articleSource = Articles.find({
            $or: [
                {person2: searchTerm},
                {person1: searchTerm},
            ]
        }).map(function(i){
            return i.source;
        });
        var articleScore = Articles.find({
            $or: [
                {person2: searchTerm},
                {person1: searchTerm},
            ]
        }).map(function(i){
            return i.score;
        });

        // Define the pdf-document
        var docDefinition = {
            content: [
                { text: 'Report for Articles Containing: ' + searchTerm, style: 'headline'},
                { text: Date()},
                '----------------------------------------------------------------------------------------------------------------------------',
                articleTitles,
                '----------------------------------------------------------------------------------------------------------------------------',
                { text: 'END', style: 'headline'},
            ],
            // Style dictionary
            styles: {
                headline: { fontSize: 20, bold: true, margin: [0, 0, 0, 25] },
                article: { fontSize: 14, margin: [0, 0, 0, 5] },
            }
        };

        // Start the pdf-generation process
        pdfMake.createPdf(docDefinition).open();
    },
});