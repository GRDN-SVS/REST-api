import Axios from 'axios';

class AnonymityNetService {

    /**
     * Sends the vote info to the anonymity network, using an http
     * post request.
     * 
     * @param electionId the id of the election in which the vote takes place.
     * @param voterId the id of the voter.
     * @param optionId the id of the option the voter chose.
     */
    async send(electionId, voterId, optionId) {
        return Axios.post(process.env.ANONYMITY_NET_ENTRY_POINT, {
            election_id: electionId,
            voter_id: voterId,
            option: optionId,
        });
    }

}

export default new AnonymityNetService();