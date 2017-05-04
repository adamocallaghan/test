import { Template } from 'meteor/templating';

import { Queries } from '../../api/queries.js';

import './home.html';

Template.home.events({
    'click .btn'(event) {
        // Search Term
        var mySearchTerm = "Shane Ross"; // hardcoding this in for testing purposes
        // Client log
        console.log("Hello client!" + mySearchTerm);
        // Server call
        Meteor.call('runQuery', mySearchTerm, function(error, result) {
            console.log(result);
        });
    },
});