import Axios from 'axios';

class JudgeService {
    
    async sendEncryptedContent(nonceId, encryptedVote, clientPublicKey) {
        try {
            let res = await Axios.post(`${process.env.JUDGE_ENTRY_POINT}/submitVote`, {
                nonceId: nonceId,
                encryptedVote: encryptedVote,
                clientPublicKey: clientPublicKey
            });
    
            if (res.error == undefined) {
                return res;
            }
            else {
                return res;
            }
        }
        catch (error) {
            return error;
        }
    }

}

export default new JudgeService();