import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';

import './overview.html';

Template.overview.onCreated(function bodyOnCreated() {
    this.state = new ReactiveDict();
    this.state.set('searchTerm', "");
});

Template.overview.helpers({
    articles() {
        const instance = Template.instance();
        // If the Reactive Dict has the Search Term set
        if (instance.state.get('searchTerm')) {
            // Return articles where...
            return Articles.find({
                $or: [
                    {person2: Template.instance().state.get('searchTerm')}, // Person2 = Search Term, OR
                    {person1: Template.instance().state.get('searchTerm')}, // Person 1 = Search Term, OR
                    {text : {$regex : ".*"+Template.instance().state.get('searchTerm')+".*"}}, // Search Term appears in Text of Article
                    { sort: { createdAt: -1 } }
                ]
            });
        }
        // Return all articles
        return Articles.find({}, { sort: { date: -1 } });
    },
    countSources() {
        rteCount = Articles.find({source: "RTE"}, { sort: { date: -1 } }).count();
        timesCount = Articles.find({source: "Irish Times"}, { sort: { date: -1 } }).count();
        indCount = Articles.find({source: "Irish Independent"}, { sort: { date: -1 } }).count();
        examCount = Articles.find({source: "Irish Times"}, { sort: { date: -1 } }).count();
        return {key1: rteCount, key2: timesCount, key3: indCount, key4: examCount};
    },
});