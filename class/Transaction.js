const crypto = require('crypto');
const EdDSA = require('elliptic').eddsa
const ec = new EdDSA('ed25519')


class Transaction {
    /**
     * @param {string} fromAddress
     * @param {string} toAddress
     * @param {number} amount
     */
    constructor(fromAddress, toAddress, amount) {
      this.fromAddress = fromAddress;
      this.toAddress = toAddress;
      this.amount = amount;
      this.timestamp = Date.now();
    }
  
    /**
     * Creates a SHA256 hash of the transaction
     *
     * @returns {string}
     */
    calculateHash() {
      return crypto.createHash('sha256').update(this.fromAddress + this.toAddress + this.amount + this.timestamp).digest('hex');
    }
  
    /**
     *
     * @param {string} signingKey
     */
    signTransaction(signingKey) {
     
      let pubk = Buffer.from(signingKey.getPublic('hex'))
      let key = signingKey.getPublic('hex')
      console.log('PUBLIC KEY BUFFER : ',pubk.toString())
      console.log('PUBLIC KEY : ',key)

      
      if (key !== this.fromAddress) {
        console.log('FROM :',key)
        console.log('From : ', this.fromAddress)

        throw new Error('You cannot sign transactions for other wallets!');
      }

      const hashTx = this.calculateHash();
      const sig = signingKey.sign(hashTx).toHex();
  
      this.signature = sig
      console.log('SIGNATURE : ',sig)
    }
  
    /**
     *
     * @returns {boolean}
     */
    isValid() {

      if (this.fromAddress === null) return true;
  
      if (!this.signature || this.signature.length === 0) {
        throw new Error('No signature in this transaction');
      }
       console.log('THIS FROM ADDRESS : ',this.fromAddress)

      const publicKey = ec.keyFromPublic(this.fromAddress, 'hex');

      return publicKey.verify(this.calculateHash(), this.signature);
    }
  }
  
  module.exports.Transaction = Transaction;