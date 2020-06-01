
export default class Vote{

    /**
     * 
     * @param nonceId the id of the nonce assign to the given vote.
     * @param encryptedVote the vote previously encrypted.
     * @param electionId the id of the election
     * @param clientPublicKey  the client's public key 
     */
    constructor(nonceId, encryptedVote, electionId, clientPublicKey) {
        this.nonceId = nonceId;
        this.encryptedVote = encryptedVote;
        this.electionId = electionId;
        this.clientPublicKey = clientPublicKey;
    }

    getNonceId() {
        return this.nonceId;
    }
    
    setNonceId(nonceId) {
        this.nonceId = nonceId;
    }

    getEncryptedVote(){
        return this.encryptedVote;
    }

    setEncryptedVote(encryptedVote){
        this.encryptedVote = encryptedVote;
    }

    getClientPublicKey() {
        return this.clientPublicKey;
    }

    setClientPublicKey(clientPublicKey) {
        this.clientPublicKey = clientPublicKey;
    }
}