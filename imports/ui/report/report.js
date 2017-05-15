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
    'click .run-report'(event) {
        // Prevent default browser form submit
        event.preventDefault();
        searchTerm = this.reportTerm;

        // Client log
        console.log("Running Report for " + searchTerm);
    },
});