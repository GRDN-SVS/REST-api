import Encrypter from '../../../crypto/encrypter';

export class PublicKeyController {

    async publicKey(req, res) {
        res.send(Encrypter.publicKey);
    }

}

export default new PublicKeyController();