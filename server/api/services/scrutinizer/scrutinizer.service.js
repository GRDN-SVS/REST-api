import Axios from 'axios';

class ScrutinizerService {

    async requestPublicKey() {
        return Axios.get(`${process.env.SCRUTINIZER_ENTRY_POINT}/publicKey`);
    }

}

export default new ScrutinizerService;