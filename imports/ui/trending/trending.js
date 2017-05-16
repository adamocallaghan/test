import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';

import './trending.html';

Template.trending.onCreated(function bodyOnCreated() {
    this.state = new ReactiveDict();
    this.state.set('searchTerm', "");
});

Template.trending.helpers({
    tweets() {
        const instance = Template.instance();
        if (instance.state.get('searchTerm')) {
            today = new Date;
            niceToday = today.toLocaleDateString();
            return Tweets.find({tweet: {$regex : ".*"+Template.instance().state.get('searchTerm')+".*"}});
        }
    },
});

Template.trending.events({
    'submit .new-search'(event, instance) {
        event.preventDefault();
        // Get the target
        const target = event.target;
        // Search Term
        var mySearchTerm = target.text.value; // make search term the one the user entered
        // Setting the state
        instance.state.set('searchTerm', mySearchTerm);
        console.log("Hello client!" + mySearchTerm);
        // *** STOPPING CALL FOR NOW TO STOP SO MUCH SERVER PROCESSING ***
        //Meteor.call('findTweets', mySearchTerm, function(error, result) {});
    },
});