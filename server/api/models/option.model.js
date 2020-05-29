const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const optionSchema = new Schema({
    option_id: Number,
    name: String,
    date_birth: Date,
    number: Number,
    party: String,
    background: String,
    proposals: String
},
{   
    autoIndex: true,
    autoCreate: true,
});

let Option = mongoose.model('Option', optionSchema);

export default Option;