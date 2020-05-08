import * as express from 'express';
import controller from './voteController';

export default express
    .Router()
    .post('/submitVote', controller.submitVote);