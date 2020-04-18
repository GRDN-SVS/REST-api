import Axios from 'axios';

class AnonymityNetService {

    /**
     * Asks for an id and a nonce from the anonymity network using an http get request.
     */
    async requestNonce() {
        return Axios.get(`${process.env.ANONYMITY_NET_ENTRY_POINT}/forward`);
    }

}

export default new AnonymityNetService();