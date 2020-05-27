import Option  from '../../models/option.model';
import Election from '../../models/election.model';
import Result from '../../models/result.model';

export class ElectionController {

    /**
     * Get every option stored in the database
     */
    getOptions(req, res) {
        Option.find(function(err, options) {
            if (err) {
                res.send(err);
            }
            else {
                res.send(options);
            }
        })
    }

    /**
     * Get the results from the election
     */
    getResults(req, res) {
        Result.find(function(err, results) {
            if (err) {
                res.send(err);
            }
            else {
                res.send(results);
            }
        });
    }
}

export default new ElectionController;