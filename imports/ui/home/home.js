import { Template } from 'meteor/templating';

//import { Articles } from '../../../collections/articles.js';

import './home.html';

Template.home.helpers({
    searchResults: function () {
        return Session.get('searchResults');
    },
    articles() {
        // Return all articles
        return Articles.find({}, { sort: { date: -1 } });
    },
});

Template.home.events({
    'submit .new-search'(event) {
        // Prevent default browser form submit
        event.preventDefault();

        // Get value from form element
        const target = event.target;

        // Search Term
        var mySearchTerm = target.text.value; // make search term the one the user entered

        // Client log
        console.log("Hello client!" + mySearchTerm);

        // Server call
        Meteor.call('runQuery', mySearchTerm, function(error, result) {
            //Session.set('searchResults', result);
            //console.log(result);
        });
    },
});