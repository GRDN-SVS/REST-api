import fabricNetwork from '../../../fabric/network';

export class BlockchainController {

    /** Vote for an available option, consuming the voters ballot */
    async castBallot(req, res) {
        let networkObj = await fabricNetwork.connectToNetwork(req.body.voterId);
        req.body = JSON.stringify(req.body);
        let args = [req.body];

        let response = await fabricNetwork.invoke(networkObj, false, 'castVote', args);
        if (response.error) {
            res.send(response.error);
        }
        else {
            res.send(response);
        }
    }

    /** Get voter info, create voter, and update state with their voterId */
    async registerVoter(req, res) {
        let voterId = req.body.voterId;

        let response = await fabricNetwork.registerVoter(voterId, req.body.registrarId, req.body.firstName, req.body.lastName);
        if (response.error) {
            res.send(response.error);
        }
        else {
            let networkObj = await fabricNetwork.connectToNetwork(voterId);
            if (networkObj.error) {
                res.send(networkObj.error);
            }
            req.body = JSON.stringify(req.body);
            let args = [req.body];

            let invokeResponse = await fabricNetwork.invoke(networkObj, false, 'createVoter', args);
            if (invokeResponse.error) {
                res.send(invokeResponse.error);
            }
            else {
                res.send(JSON.parse(invokeResponse));
            }
        }
    }

    /** Used as a way to log in the user to the app and make sure they haven't voted before. */
    async validateVoter(req, res) {
        let networkObj = await fabricNetwork.connectToNetwork(req.body.voterId);
        if (networkObj.error) {
            res.send(networkObj.error);
        }

        let invokeResponse = await fabricNetwork.invoke(networkObj, true, 'readVote', req.body.voterId);
        if (invokeResponse.error) {
            res.send(invokeResponse.error);
        }
        else {
            let parsedResponse = JSON.parse(invokeResponse);
            if (parsedResponse.ballotCast) {
                let response = {};
                response.error = 'This voter has already cast a ballot!';
                res.send(response);
            }
            res.send(parsedResponse);
        }
    }

}

export default new BlockchainController();