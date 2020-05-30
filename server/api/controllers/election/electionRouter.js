import * as express from 'express';
import controller from './electionController';

export default express
    .Router()
    .get('/getOptions', controller.getOptions)
    .get('/getResults', controller.getResults)