/* Mocha Tests for Queries */
import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';
import { assert } from 'meteor/practicalmeteor:chai';
import { Queries } from './queries.js';

if (Meteor.isServer) {
    describe('Queries', () => {
        describe('methods', () => {
            const userId = Random.id();
            let queryId;

            beforeEach(() => {
                Queries.remove({});
                queryId = Queries.insert({
                    text: 'test query',
                    createdAt: new Date(),
                    owner: userId,
                    username: 'adam-test',
                    source: 'RTE',
                    polarity: 'pos',
                });
            });

            it('can delete owned task', () => {
                console.log("Removed Query: " + queryId);
                Queries.remove({queryId});
            });
        });
    });
}