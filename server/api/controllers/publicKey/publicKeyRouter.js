import * as express from 'express';
import controller from './publicKeyController';

export default express
    .Router()
    .get('/publicKey', controller.publicKey)