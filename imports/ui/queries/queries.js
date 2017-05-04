import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';

import { Queries } from '../../api/queries.js';

import '../query/query.js';
import './queries.html';

Template.queries.onCreated(function bodyOnCreated() {
    this.state = new ReactiveDict();
});

// Helper returns the list of querys from the database
Template.queries.helpers({
    querys() {
        const instance = Template.instance();
        if (instance.state.get('hideCompleted')) {
            // If hide completed is checked, filter querys
            return Queries.find({ checked: { $ne: true } }, { sort: { createdAt: -1 } });
        }
        // Show the newest querys at the top
        return Queries.find({}, { sort: { createdAt: -1 } });
    },
    incompleteCount() {
        return Queries.find({ checked: { $ne: true } }).count();
    },
});

// Event listener inserts new task to the database
Template.queries.events({
    'submit .new-task'(event) {
        // Prevent default browser form submit
        event.preventDefault();

        // Get value from form element
        const target = event.target;
        const text = target.text.value;
        //console.log(event);

        // Insert a task into the collection
        Queries.insert({
            text,
            createdAt: new Date(), // current time
            owner: Meteor.userId(),
            username: Meteor.user().username,
        });

        // Clear form
        target.text.value = '';
    },
    'change .hide-completed input' (event, instance) {
        instance.state.set('hideCompleted', event.target.checked);
    }
});