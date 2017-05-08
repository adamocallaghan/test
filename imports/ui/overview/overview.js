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
    topPos() {
        todayISO = new Date();
        todayClean = todayISO.toDateString();
        return Articles.find({polarity: "pos", cleanDate: todayClean}, { sort: { score: -1 }, limit: 5 });
    },
    topNeg() {
        todayISO = new Date();
        todayClean = todayISO.toDateString();
        return Articles.find({polarity: "neg", cleanDate: todayClean}, { sort: { score: 1 }, limit: 5 });
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

// This Week Chart
Template.overview.thisWeekChart = function() {

    // Get today's date
    todayISODate = new Date();
    // Get a readable date
    todayCleanDate = todayISODate.toDateString();

    // Use Moment.js to find yesterday
    day6 = moment(todayCleanDate).subtract(1, 'day');
    day5 = moment(todayCleanDate).subtract(2, 'day');
    day4 = moment(todayCleanDate).subtract(3, 'day');
    day3 = moment(todayCleanDate).subtract(4, 'day');
    day2 = moment(todayCleanDate).subtract(5, 'day');
    day1 = moment(todayCleanDate).subtract(6, 'day');

    // Format moment to match our own cleanDate
    day6Clean = moment(day6).format("ddd MMM DD YYYY");
    day5Clean = moment(day5).format("ddd MMM DD YYYY");
    day4Clean = moment(day4).format("ddd MMM DD YYYY");
    day3Clean = moment(day3).format("ddd MMM DD YYYY");
    day2Clean = moment(day2).format("ddd MMM DD YYYY");
    day1Clean = moment(day1).format("ddd MMM DD YYYY");


    // Find how many articles processed past 7 days
    today = Articles.find({cleanDate: todayCleanDate}).count();
    yesterday = Articles.find({cleanDate: day6Clean}).count();
    day5Count = Articles.find({cleanDate: day5Clean}).count();
    day4Count = Articles.find({cleanDate: day4Clean}).count();
    day3Count = Articles.find({cleanDate: day3Clean}).count();
    day2Count = Articles.find({cleanDate: day2Clean}).count();
    day1Count = Articles.find({cleanDate: day1Clean}).count();

    console.log(todayCleanDate);
    console.log(day6Clean + " --- Articles: " + yesterday);
    console.log(day5Clean + " --- Articles: " + day5Count);
    console.log(day4Clean + " --- Articles: " + day4Count);
    console.log(day3Clean + " --- Articles: " + day3Count);
    console.log(day2Clean + " --- Articles: " + day2Count);
    console.log(day1Clean + " --- Articles: " + day1Count);

    return {
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false
        },
        title: {
            text: 'Articles Processed: Past 7 Days'
        },

        colors: ['red', 'orange', 'green', 'blue', 'purple', 'brown'],

        xAxis: {
            categories: ['Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat', 'Sun']
        },

        series: [{
            data: [day1Count, day2Count, day3Count, day4Count, day5Count, yesterday, today],
            type: 'column',
            name: 'Articles Processed',
            colorByPoint: true
        }]
    };
};