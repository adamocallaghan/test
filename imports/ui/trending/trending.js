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
    'click .search'(event, instance) {
        event.preventDefault();
        mySearchTerm = "Trump";
        // Setting the state
        instance.state.set('searchTerm', mySearchTerm);
        console.log("Hello client!" + mySearchTerm);
        Meteor.call('findTweets', mySearchTerm, function(error, result) {});
    },
});