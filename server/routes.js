import examplesRouter from './api/controllers/examples/router';
import blockchainRouter from './api/controllers/blockchain/blockchainRouter';
import voteRouter from './api/controllers/vote/voteRouter';
import electionRouter from './api/controllers/election/electionRouter';

export default function routes(app) {
    app.use('/grdn/api/examples', examplesRouter);

    app.use('/grdn/api/blockchain', blockchainRouter);
    app.use('/grdn/api/vote', voteRouter);
    app.use('/grdn/api/election', electionRouter);
}
