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
        let encryptedVote = new Vote(req.body.nonceId, req.body.encryptedVote, req.electionId, req.body.clientPublicKey);
        let judgeResponse = await JudgeService.sendEncryptedContent(encryptedVote.getNonceId(), encryptedVote.getEncryptedVote(), encryptedVote.getClientPublicKey());

        res.send(judgeResponse.data);
    }
}

export default new VoteController();