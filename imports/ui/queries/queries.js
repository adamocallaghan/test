import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';

import { Queries } from '../../api/queries.js';

import './queries.html';

Template.queries.onCreated(function bodyOnCreated() {
    this.state = new ReactiveDict();
    this.state.set('searchTerm', "");
    this.state.set('polarity', "");
    this.state.set('source', "");
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
    queriesResults() {
        myInstance = Template.instance();
        if (myInstance.state.get('searchTerm')) {
            // If hide completed is checked, filter articles
            return Articles.find({
                $or: [
                    {person2: Template.instance().state.get('searchTerm')},
                    {person1: Template.instance().state.get('searchTerm')},
                    {text : {$regex : ".*"+Template.instance().state.get('searchTerm')+".*"}},
                    { sort: { createdAt: -1 } }
                ],
                $and: [
                    {source: Template.instance().state.get('source')},
                    {polarity: Template.instance().state.get('polarity')}
                ]
            });
        }
    }
});

// Event listener inserts new task to the database
Template.queries.events({
    'submit .new-task'(event) {
        // Prevent default browser form submit
        event.preventDefault();

        // Get value from form element
        const target = event.target;
        const text = target.text.value;
        const radio = target.optionsRadios.value;
        const pol = target.sentimentOptions.value;
        //console.log(event);

        // Insert a task into the collection
        Queries.insert({
            text,
            createdAt: new Date(), // current time
            owner: Meteor.userId(),
            username: Meteor.user().username,
            source: radio,
            polarity: pol,
        });

        // Clear form
        target.text.value = '';
    },
    'change .hide-completed input' (event, instance) {
        instance.state.set('hideCompleted', event.target.checked);
    },
    'click .toggle-checked'() {
        // Set the checked property to the opposite of its current value
        Queries.update(this._id, {
            $set: { checked: ! this.checked },
        });
    },
    'click .delete'() {
        Queries.remove(this._id);
    },
    'click .run'() {
        /* Just getting some Queries data to check it's working
        console.log(Queries.find(this._id));
        console.log(this._id);
        // info from query

        console.log(source + " | " + polarity + " | " + searchTerm);
        // setting Session to query results
        queriesResults = Articles.find({polarity: polarity, source: source});
        Session.set( "QueriesResults", Articles.find({polarity: polarity, source: source}) ); */

        event.preventDefault();

        source = this.source;
        polarity = this.polarity;
        searchTerm = this.text;

        // Client log
        console.log("Showing only articles about " + searchTerm + " with polarity: " + polarity + " from source: " + source);

        // Setting the state
        myInstance.state.set('searchTerm', searchTerm);
        myInstance.state.set('polarity', polarity);
        myInstance.state.set('source', source);
    }
});