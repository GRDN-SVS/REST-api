import NaCl from '@tripod/tweetnacl';

/**
 * Class to encrypt the vote by applying XOR with its nonce,
 * and by vreating 
 */
class Encrypter {

    publicKey;
    secretKey;

    /**
     * Creates a new Encrypter instance, which contains a pair of
     * public and secret keys.
     */
    constructor() {
        // TODO: Implement some caching method to save and read keypairs, in case the server goes down
        const keyPair = NaCl.box.keyPair();

        this.publicKey = keyPair.publicKey;
        this.secretKey = keyPair.secretKey;
    }

    /**
     * Applies an xor between the specified content and a nonce.
     * 
     * @param content the content that will be encrypted.
     * @param nonce the nonce used to encrypt the content. 
     */
    xor(content, nonce) {
        return content ^ nonce;
    }

    /**
     * Encrypts the specified content using the given nonce, the
     * recipients secret key and this intances public key.
     * 
     * @param content the content that will be encrypted. 
     * @param nonce the nonce used to encrypt the content.
     * @param otherPublicKey public key from the recipient.
     */
    seal(content, nonce, otherPublicKey) {
        return NaCl.box(content, nonce, otherPublicKey, this.secretKey);
    }

}

export default new Encrypter();