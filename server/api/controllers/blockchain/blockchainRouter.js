import * as express from 'express';
import controller from './blockchainController';

export default express
    .Router()
    .post('/castBallot', controller.castBallot)
    .post('/registerVoter', controller.registerVoter)
    .post('/validateVoter', controller.validateVoter);
