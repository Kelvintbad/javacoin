// import the node module
const EdDSA = require('elliptic').eddsa
const ec = new EdDSA('ed25519')
const bip39 = require('bip39')
// import the class we need
const { Blockchain } = require('./class/Blockchain')
const { Transaction } = require('./class/Transaction')

// uncoment next line to select a language for your worlist
//bip39.setDefaultWordlist('french')

//generate a mnemonic
const mnemonic =  bip39.generateMnemonic();
console.log('MNEMONIC : ',mnemonic)

// Generate a seed
const seed =  bip39.mnemonicToSeed(mnemonic);

// We use the seed to produce keys
const myKey = ec.keyFromSecret(seed)

// We use the public key as the address
const pubKey = myKey.getPublic('hex')
console.log('MY PUBLIC KEY : ',pubKey)

/* create an instance of the blockchain
*  TODO: 
*  Look for other nodes and get current blockchain state
*  Add Save the bloackchain in a file and load the other block from other nodes
*  
*/
const jcoin = new Blockchain();

// create a transaction and sign it
const tx = new Transaction(pubKey, 'anotherAddress', 1);
tx.signTransaction(myKey);

// before we can send that first transaction ever we need tokens.
// let's mine a block
jcoin.minePendingTransactions(pubKey)
// Now we can send a token
jcoin.addTransaction(tx);
// for the transaction to be executes it has to be mined.
jcoin.minePendingTransactions(pubKey)
// display the balance
jcoin.getBalanceOfAddress(pubKey)