/*
 * Helper node script that enrolls a the admin of the app into the
 * blockchain network, creates a file system wallet and imports the
 * identity of the admin into said wallet
 */

const FabricCaServices = require('fabric-ca-client');
const { FileSystemWallet, X509WalletMixin } = require('fabric-network');

const fs = require('fs');
const path = require('path');

const configPath = path.join(process.cwd(), './config.json');
const configJSON = fs.readFileSync(configPath, 'utf-8');
const config = JSON.parse(configJSON);

async function main() {
    const appAdmin = config.appAdmin;
    const appAdminSecret = config.appAdminSecret;
    const orgMSPID = config.orgMSPID;
    const caName = config.caName;

    try {
        // create new CA client for interacting with the CA
        const caURL = caName;
        const ca = new FabricCaServices(caURL);

        // create a new fiel system based wallet for managing identities
        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = new FileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // check if the admin is already enrolled
        const adminExists = await wallet.exists(appAdmin);
        if (adminExists) {
            console.log('An identity for the admin user "admin" already exists in the wallet');
            return;
        }

        // enroll the admin user and import its identity to the wallet
        const enrollment = await ca.enroll({
            enrollmentID: appAdmin,
            enrollmentSecret: appAdminSecret,
        });
        const identity = X509WalletMixin.createIdentity(
            orgMSPID,
            enrollment.certificate,
            enrollment.key.toBytes(),
        );
        wallet.import(appAdmin, identity);
        console.log(`Successfully enrolled the user ${appAdmin} and imported it into the wallet`);
    }
    catch (error) {
        console.log(`Failed to enroll admin user ${appAdmin}: ${error}`);
        process.exit(1);
    }
}

main();
