import { Template } from 'meteor/templating';

import { Queries } from '../../api/queries.js';

import './query.html';

Template.query.onCreated(function bodyOnCreated() {
    this.state = new ReactiveDict();
    this.state.set('searchTerm', "");
});

Template.query.helpers({

});

Template.query.events({
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
        // Just getting some Queries data to check it's working
        console.log(Queries.find(this._id));
        console.log(this._id);
        source = this.source;
        polarity = this.polarity;
        searchTerm = this.text;
        console.log(source + " | " + polarity + " | " + searchTerm);
        // Not working, try using Reactive Dictionary like on Home.html/js
        queriesResults = Articles.find({polarity: polarity, source: source});
        Session.set( "QueriesResults", queriesResults );
        // NOTE: you might have to move the query.html/js back into the queries.html/js
    }
});