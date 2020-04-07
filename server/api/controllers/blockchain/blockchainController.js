import fabricNetwork from '../../../fabric/network';
import l from '../../../common/logger';

export class BlockchainController {

    /** Vote for an available option, consuming the voters ballot */
    async castBallot(req, res) {
        let networkObj = await fabricNetwork.connectToNetwork(req.body.voterId);
        req.body = JSON.stringify(req.body);
        let args = [req.body];

        let response = await fabricNetwork.invoke(networkObj, false, 'castVote', args);
        if (response.error) {
            return res.send(response.error);
        }
        else {
            return res.send(response);
        }
    }

    /** Get voter info, create voter, and update state with their voterId */
    async registerVoter(req, res) {
        let voterId = req.body.voterId;

        let response = await fabricNetwork.registerVoter(voterId, req.body.registrarId, req.body.firstName, req.body.lastName);
        if (response.error) {
            return res.send(response.error);
        }
        else {
            let networkObj = await fabricNetwork.connectToNetwork(voterId);
            if (networkObj.error) {
                return res.send(networkObj.error);
            }
            req.body = JSON.stringify(req.body);
            let args = [req.body];

            let invokeResponse = await fabricNetwork.invoke(networkObj, false, 'createVoter', args);
            l.info(invokeResponse)
            if (invokeResponse.error) {
                return res.send(invokeResponse.error);
            }
            else {
                return res.send({msg: "SUCCESS"})
                // return res.send(JSON.parse(invokeResponse));
            }
        }
    }

    /** Used as a way to log in the user to the app and make sure they haven't voted before. */
    async validateVoter(req, res) {
        let networkObj = await fabricNetwork.connectToNetwork(req.body.voterId);
        if (networkObj.error) {
            return res.send(networkObj);
        }

        let invokeResponse = await fabricNetwork.invoke(networkObj, true, 'readVote', req.body.voterId);
        if (invokeResponse.error) {
            return res.send(invokeResponse);
        }
        else {
            let parsedResponse = JSON.parse(invokeResponse);
            if (parsedResponse.ballotCast) {
                let response = {};
                response.error = 'This voter has already cast a ballot!';
                return res.send(response);
            }
            return res.send(parsedResponse);
        }
    }

}

export default new BlockchainController();