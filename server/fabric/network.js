import { FileSystemWallet, Gateway, X509WalletMixin } from 'fabric-network';
import l from '../common/logger';

import path from 'path';
import fs from 'fs';
import util from 'util';

/**
 * Class that contains all the logic necessary to connect the application
 * to a hyperledger fabric blockchain network.
 * 
 * It is intended to be used as a singleton, that is why only an instance
 * of should be exported.
 */
class FabricNetwork {

    #gatewayDiscovery;
    #appAdmin;
    #orgMSPID;
    #ccp;

    /**
     * Create a new FabricNetwork instance.
     */
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
     * Connect to the network using a specific user name as the identity.
     * 
     * @param userName The name of a user that is already enrolled in the network.
     * @returns a network object, which contains the contract, network and gateway associated to the identity.
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
            l.error(`Error processing transaction: ${error}`);
            let response = {};
            response.error = error;
            
            return response;
        }
    }

    /**
     * Invokes a function from the smart contract, either to process a
     * transaction or to evaluate a query.
     * 
     * @param networkObj object that contains the contract, network and gateway associated to an identity.
     * @param isQuery true if what will be invoked is a query to the blockchain, false otherwise.
     * @param func function to be invoked from the smart contract.
     * @param args arguments to be passed down to the smart contract function.
     * @returns response from the smart contract function.
     */
    async invoke(networkObj, isQuery, func, args) {
        try {
            if (isQuery === true) {
                if (args) {
                    let response = await networkObj.contract.evaluateTransaction(func, args);
                    l.info(`Transaction ${func} with args ${args} has been evaluated`);
                    await networkObj.gateway.disconnect();

                    return response;
                }
                else {
                    let response = await networkObj.contract.evaluateTransaction(func);
                    l.info(`Transaction ${func} without args has been evaluated`);
                    await networkObj.disconnect();

                    return response;
                }
            }
            else {
                if (args) {
                    args = JSON.parse(args[0]);
                    args = JSON.stringify(args);
                    let response = await networkObj.contract.submitTransaction(func, args);
                    l.info(`Transaction ${func} with args ${args} has been submitted`);
                    await networkObj.gateway.disconnect();

                    return response;
                }
                else {
                    let response = await networkObj.contract.submitTransaction(func);
                    l.info(`Transaction ${func} without args has been submitted`);
                    await networkObj.gateway.disconnect();

                    return response;
                }
            }
        }
        catch (error) {
            l.error(`Failed to submit transaction: ${error}`);
            return error;
        }
    }

    /**
     * Register a voter into the wallet.
     * 
     * @param voterId ID that the voter.
     * @param registrarId ID of a valid registrar.
     * @param firstName First name of the voter.
     * @param lastName Last name of the voter.
     * @returns success or failure message.
     */
    async registerVoter(voterId, registrarId, firstName, lastName) {
        if (!voterId || !registrarId || !firstName || !lastName) {
            let response = {};
            response.error = `You need to fill all fields before you can register!`;
            return response;
        }

        try {
            const walletPath = path.join(process.cwd(), 'wallet');
            const wallet = new FileSystemWallet(walletPath);

            const userExists = await wallet.exists(voterId);
            if (userExists) {
                let response = {};
                const msg = `An identity for the user ${voterId} already exists in the wallet`;
                l.info(msg);
                response.error = `${msg}. Please enter a different one to proceed.`;

                return response;
            }

            const adminExists = await wallet.exists(this.#appAdmin);
            if (!adminExists) {
                const msg = `An identity for the Admin user does not exist in the wallet`;
                l.error(`${msg}. Run the enrollAdmin.js script before retrying`);
                let response = {};
                response.error = msg;
                
                return response;
            }

            const gateway = new Gateway();
            await gateway.connect(this.#ccp, { wallet, identity: this.#appAdmin, discovery: this.#gatewayDiscovery });

            const ca = gateway.getClient().getCertificateAuthority();
            const adminIdentity = gateway.getCurrentIdentity();
            const secret = ca.register({ affiliation: 'org1', enrollmentID: voterId, role: 'client' }, adminIdentity);

            const enrollment = await ca.enroll({ enrollmentID: voterId, enrollmentSecret: secret });
            const userIdentity = await X509WalletMixin.createIdentity(this.#orgMSPID, enrollment.certificate, enrollment.key.toBytes());
            await wallet.import(voterId, userIdentity);
            const msg = `Successfully registered voter ${firstName} ${lastName}`;
            l.info(msg);
            let response = msg;

            return response;
        }
        catch (error) {
            l.error(`Failed to register user ${voterId}: ${error}`);
            let response = {};
            response.error = error;

            return response;
        }
    }
}

export default new FabricNetwork();