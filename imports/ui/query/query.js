import { Template } from 'meteor/templating';

import { Queries } from '../../api/queries.js';

import './query.html';

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
});