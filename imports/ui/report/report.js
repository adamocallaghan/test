import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';

import './report.html';

Template.report.helpers({
    reports() {
        // Return all articles
        return Reports.find({});
    },
});