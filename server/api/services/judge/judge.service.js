import Axios from 'axios';

class JudgeService {
    
    async sendEncryptedContent(content) {
        return Axios.post(`${process.env.JUDGE_ENTRY_POINT}/submitVote`, {
            encryptedVote: content
        });
    }

}

export default new JudgeService();