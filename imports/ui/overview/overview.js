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

// Sources Chart
Template.overview.topGenresChart = function() {
    rteCount = Articles.find({source: "RTE"}, { sort: { date: -1 } }).count();
    timesCount = Articles.find({source: "Irish Times"}, { sort: { date: -1 } }).count();
    indCount = Articles.find({source: "Irish Independent"}, { sort: { date: -1 } }).count();
    examCount = Articles.find({source: "Irish Times"}, { sort: { date: -1 } }).count();
    totalCount = rteCount + timesCount + indCount + examCount;
    percent = totalCount/100;
    return {
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false
        },
        title: {
            text: "Article Sources"
        },
        tooltip: {
            pointFormat: '<b>{point.percentage:.1f}%</b>'
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: true,
                    format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                    style: {
                        color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                    },
                    connectorColor: 'silver'
                }
            }
        },
        series: [{
            type: 'pie',
            name: 'Sources',
            data: [
                ['RTE',   rteCount*percent],
                ['Irish Times',       timesCount*percent],
                ['Irish Independent',   indCount*percent],
                ['Irish Examiner',    examCount*percent],
            ]
        }]
    };
};

// Sentiment Chart
Template.overview.sentimentChart = function() {
    positive = Articles.find({polarity: "pos"}, { sort: { date: -1 } }).count();
    negative = Articles.find({polarity: "neg"}, { sort: { date: -1 } }).count();
    neutral = Articles.find({polarity: "neu"}, { sort: { date: -1 } }).count();
    totalCount = positive + negative + neutral;
    percent = totalCount/100;
    return {
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false
        },
        title: {
            text: "Sentiment Breakdown"
        },
        colors: ['#5cb85c', '#d9534f', '#5bc0de'],
        tooltip: {
            pointFormat: '<b>{point.percentage:.1f}%</b>'
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: true,
                    format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                    style: {
                        color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                    },
                    connectorColor: 'silver'
                }
            }
        },
        series: [{
            type: 'pie',
            name: 'Sources',
            data: [
                ['Positive',   positive],
                ['Negative',       negative],
                ['Neutral',   neutral],
            ]
        }]
    };
};