const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let electionSchema = new Schema({
    name: String,
    date: Date,
    organizer: String,
    options: [Number],
    results: [
        {
            option_id: Number,
            results: Number,
        }
    ]
},
{
    autoIndex: true,
    autoCreate: true
});

let Election = mongoose.model('Election', electionSchema);

export default Election;