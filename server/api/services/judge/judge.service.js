import Axios from 'axios';

class JudgeService {
    
    async sendEncryptedContent(content) {
        let res = await Axios.post(`${process.env.JUDGE_ENTRY_POINT}/submitVote`, {
            encryptedVote: content
        });

        if (res.error == undefined) {
            return res;
        }
        else {
            return res;
        }
    }

}

export default new JudgeService();