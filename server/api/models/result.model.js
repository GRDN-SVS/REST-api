const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let resultSchema = new Schema({
    results: [
        {
            option_id: Buffer,
            results: Number,
        }
    ]
},
{
    autoIndex: true,
    autoCreate: true
});

let Result = mongoose.model('Result', resultSchema);

export default Result;