import Vote from '../../models/vote.model';
import JudgeService from '../../services/judge/judge.service';

export class VoteController {

    /**
     * Receive vote, validate parameters and then send it to Judge Agent
     *
     * @param req.body.nonceId the id of a nonce associated to the vote.
     * @param req.body.encryptedVote encrypted vote from the client
     * @param req.body.electionId the id of the election in which to vote will take place.
     * @param req.body.clientPublicKey the voter's public key
     * 
     */
    async submitVote(req, res) {
        encryptedVote = new Vote(req.body.nonceId, req.body.encryptedVote, req.body.clientPublicKey);
        JudgeService.sendEncryptedContent(encryptedVote);
    }
}

export default new VoteController();