import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';

//import { Articles } from '../../../collections/articles.js';

import './home.html';
import './articlemodal.html';

Template.home.onCreated(function bodyOnCreated() {
    this.state = new ReactiveDict();
    this.state.set('searchTerm', "");
});

Template.home.helpers({
    searchResults: function () {
        return Session.get('searchResults');
    },
    articles() {
        const instance = Template.instance();
        if (instance.state.get('hideCompleted')) {
            // If hide completed is checked, filter articles
            return Articles.find({ person1: "Joan Burton"}, { sort: { createdAt: -1 } });
        }
        if (instance.state.get('searchTerm')) {
            // If hide completed is checked, filter articles
            return Articles.find({ person1: Template.instance().state.get('searchTerm')}, { sort: { createdAt: -1 } });
        }
        if (instance.state.get('rte')) {
            // If source RTE is checked, filter articles
            return Articles.find({ source: "RTE"}, { sort: { createdAt: -1 } });
        }
        if (instance.state.get('independent')) {
            // If source RTE is checked, filter articles
            return Articles.find({ source: "Irish Independent"}, { sort: { createdAt: -1 } });
        }
        if (instance.state.get('times')) {
            // If source RTE is checked, filter articles
            return Articles.find({ source: "Irish Times"}, { sort: { createdAt: -1 } });
        }
        if (instance.state.get('examiner')) {
            // If source RTE is checked, filter articles
            return Articles.find({ source: "Irish Examiner"}, { sort: { createdAt: -1 } });
        }
        // Return all articles
        return Articles.find({}, { sort: { date: -1 } });
    },
});

Template.home.events({
    'click .runsearch'(event) {
        // Prevent default browser form submit
        event.preventDefault();

        // Client log
        console.log("Running Scrape and NLP Processing on the Server");

        // Server call
        Meteor.call('runQuery', function(error, result) {
            //Session.set('searchResults', result);
            //console.log(result);
            console.log("Server call made");
        });
    },
    'submit .new-search'(event, instance) {
        // Prevent default browser form submit
        event.preventDefault();

        // Get value from form element
        const target = event.target;

        // Search Term
        var mySearchTerm = target.text.value; // make search term the one the user entered

        // Client log
        console.log("Showing only articles about " + mySearchTerm);

        // Setting the state
        instance.state.set('searchTerm', mySearchTerm);
    },
    'click .toggle-checked'() {
        // Set the checked property to the opposite of its current value
        Articles.update(this._id, {
            $set: { checked: ! this.checked },
        });
    },
    'change .hide-completed input' (event, instance) {
        instance.state.set('hideCompleted', event.target.checked);
    },
    'change .rte input' (event, instance) {
        instance.state.set('rte', event.target.checked);
    },
    'change .independent input' (event, instance) {
        instance.state.set('independent', event.target.checked);
    },
    'change .times input' (event, instance) {
        instance.state.set('times', event.target.checked);
    },
    'change .examiner input' (event, instance) {
        instance.state.set('examiner', event.target.checked);
    },
    'click .view'() {
        Articles.find(this._id);
        Modal.show('articlemodal', {
            id: this._id,
            title: this.title,
            description: this.description,
            text: this.text,
            person: this.person1,
            polarity: this.polarity,
            source: this.source,
            link: this.link,
            posWords: this.posWords.length,
            negWords: this.negWords.length,
        });
        console.log(this._id);
    },
});