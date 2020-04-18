import examplesRouter from './api/controllers/examples/router';
import blockchainRouter from './api/controllers/blockchain/blockchainRouter';
import publicKeyController from './api/controllers/publicKey/publicKeyController';

export default function routes(app) {
    app.use('/grdn/api/examples', examplesRouter);

    app.use('/grdn/api/blockchain', blockchainRouter);
    app.use('grdn/api/publicKey', publicKeyController);
}
