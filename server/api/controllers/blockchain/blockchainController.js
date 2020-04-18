import l from '../../../common/logger';
import fabricNetwork from '../../../fabric/network';
import encrypter from '../../../crypto/encrypter';
import anonymityNetworkService from '../../services/anonymityNet/anonymityNet.service';
import judgeService from '../../services/judge/judge.service';
import scrutinizerService from '../../services/scrutinizer/scrutinizer.service';

export class BlockchainController {
    /**
     * Vote for an available option, consuming the voter's ballot.
     *
     * @param req.body.voterId the id of an already registered voter.
     * @param req.body.electionId the id of the election in which to vote will take place.
     * @param req.body.optionId the id of a valid option within the specified election.
     */
    async castBallot(req, res) {

        let networkObj = await fabricNetwork.connectToNetwork(req.body.voterId);
        req.body = JSON.stringify(req.body);
        let args = [req.body];

        let response = await fabricNetwork.invoke(
            networkObj,
            false,
            'castVote',
            args,
        );

        if (response.error) {
            return res.send(response.error);
        }
        else {
            let parsedResponse = JSON.parse(response);
            if (parsedResponse.error) {
                return res.send(parsedResponse);
            }
            else {
                try {
                    // REQUEST id and nonce
                    let netResponse = await anonymityNetworkService.requestNonce(); 
                    let xorVote = encrypter.xor(req.optionId, netResponse.nonce);

                    const scrutinizerPublicKey = await scrutinizerService.requestPublicKey();

                    let encryptedOption = encrypter.seal(xorVote, nonce, scrutinizerPublicKey);

                    let vote = {
                        nonceId: netResponse.id,
                        option: encryptedOption
                    }

                    let judgeResponse = await judgeService.sendEncryptedContent(vote);
                    
                    let responsesObj = {
                        blockchain: response,
                        judge: judgeResponse,
                    };

                    return res.send(responsesObj);
                }
                catch (error) {
                    const msg = `Connection to the anonymity net failed: ${error}`;
                    l.error(msg);
                    let errorResponse = {};
                    errorResponse.error = msg;
                    return res.send(errorResponse);
                }
            }
        }
    }

    /**
     * Get voter info, create voter, and update the blockchain state,
     * ultimately registering the user as a valid voter.
     *
     * @param req.body.voterId the id of a new voter.
     * @param req.body.registrarId the id of a valid registrar.
     * @param req.body.firstName the new voter's first name.
     * @param req.body.lastName the new voter's last name.
     */
    async registerVoter(req, res) {
        let voterId = req.body.voterId;

        let response = await fabricNetwork.registerVoter(
            voterId,
            req.body.registrarId,
            req.body.firstName,
            req.body.lastName,
        );

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

            let invokeResponse = await fabricNetwork.invoke(
                networkObj,
                false,
                'createVoter',
                args,
            );

            if (invokeResponse.error) {
                return res.send(invokeResponse.error);
            }
            else {
                return res.send(response);
            }
        }
    }

    /**
     * Used as a way to log in the user to the app and make sure
     * they haven't voted before.
     *
     * @param req.body.voterId the id of an already registered voter.
     */
    async validateVoter(req, res) {
        let networkObj = await fabricNetwork.connectToNetwork(req.body.voterId);
        if (networkObj.error) {
            return res.send(networkObj);
        }

        let invokeResponse = await fabricNetwork.invoke(
            networkObj,
            true,
            'readVote',
            req.body.voterId,
        );
        
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
