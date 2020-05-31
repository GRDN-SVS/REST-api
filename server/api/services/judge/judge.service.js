import Axios from 'axios';

class JudgeService {
    
    async sendEncryptedContent(content) {
        try {
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
        catch (error) {
            return error;
        }
    }

}

export default new JudgeService();