/*
 * File containing all the logic necessary to connect the aplication
 * to a hyperledger fabric blockchain network
 */

import { FileSystemWallet, Gateway, X509WalletMixin } from 'fabric-network';
import l from '../common/logger';

import path from 'path';
import fs from 'fs';
import util from 'util';

class FabricNetwork {

    #gatewayDiscovery;
    #appAdmin;
    #orgMSPID;
    #ccp;

    constructor() {
        const configPath = path.join(process.cwd(), './config.json');
        const configJSON = fs.readFileSync(configPath, 'utf-8');
        const config = JSON.parse(configJSON);
        const connectionFile = config.connection_file;
        const ccpPath = path.join(process.cwd(), connectionFile);
        const ccpJSON = fs.readFileSync(ccpPath, 'utf8');
        
        this.#gatewayDiscovery = config.gatewayDiscovery;
        this.#appAdmin = config.appAdmin;
        this.#orgMSPID = config.orgMSPID;
        this.#ccp = JSON.parse(ccpJSON);
    }

    /**
     * Connect to the network using a specific user name as the identity
     * 
     * @param userName The name of a user that is already enrolled in the network 
     */
    async connectToNetwork(userName) {
        const gateway = new Gateway();

        try {
            const walletPath = path.join(process.cwd(), 'wallet');
            const wallet = new FileSystemWallet(walletPath);

            l.info({
                walletPath,
                userName, 
                wallet: util.inspect(wallet),
                ccp: util.inspect(this.#ccp)
            });

            const userExists = await wallet.exists(userName);
            if (!userExists) {
                let response = {};
                response.error = `An identity for the user ${userName} does not exist in the wallet. Register ${userName} first`;
                return response;
            }

            await gateway.connect(ccp, { wallet, identity: userName, discovery: this.#gatewayDiscovery });
            
            const network = await gateway.getNetwork('mychannel');
            l.info('connected to channel');
            const contract = await network.getContract('VoteContract');

            const networkObj = {
                contract,
                network,
                gateway
            };

            return networkObj;
        }
        catch (error) {
            l.fatal(`Error processing transaction: ${error}`);
            let response = {};
            response.error = error;
            
            return response;
        }
    }
}