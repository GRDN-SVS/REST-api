import Option  from '../../models/option.model';
import Election from '../../models/election.model';

export class ElectionController {

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

    getResults(req, res) {
        Election.findById(req.params.electionId, function(err, election) {
            if(err) {
                res.send(err);
            }
            else {
                res.send(election.results);
            }
        })
    }
}

export default new ElectionController;