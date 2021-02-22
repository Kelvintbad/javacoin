const {Block} = require('./Block')
const {Transaction} = require('./Transaction')

class Blockchain {
    constructor() {
      this.chain = [this.createGenesisBlock()];
      this.difficulty = 2;
      this.pendingTransactions = [];
      this.miningReward = 100;
    }
  
    /**
     * @returns {Block}
     */
    createGenesisBlock() {
      return new Block(Date.parse('2021-20-14'), [], '0');
    }
  
    /**
     *
     * @returns {Block[]}
     */
    getLatestBlock() {
      return this.chain[this.chain.length - 1];
    }
  
    /**
     *
     * @param {string} miningRewardAddress
     */
    minePendingTransactions(miningRewardAddress) {
      const rewardTx = new Transaction(null, miningRewardAddress, this.miningReward);
      this.pendingTransactions.push(rewardTx);
  
      const block = new Block(Date.now(), this.pendingTransactions, this.getLatestBlock().hash);
      block.mineBlock(this.difficulty);
  
      console.log('Block successfully mined!');
      this.chain.push(block);
  
      this.pendingTransactions = [];
    }
  
    /**
     *
     * @param {Transaction} transaction
     */
    addTransaction(transaction) {
      if (!transaction.fromAddress || !transaction.toAddress) {
        throw new Error('Transaction must include from and to address');
      }
  
      // Verify the transactiion
      if (!transaction.isValid()) {
        throw new Error('Cannot add invalid transaction to chain');
      }
      
      if (transaction.amount <= 0) {
        throw new Error('Transaction amount should be higher than 0');
      }
      
      // Making sure that the amount sent is not greater than existing balance
      if (this.getBalanceOfAddress(transaction.fromAddress) < transaction.amount) {
        
        throw new Error('Not enough balance');
      }
  
      this.pendingTransactions.push(transaction);
      console.log('transaction added: ', transaction);
    }
  
    /**
     *
     * @param {string} address
     * @returns {number} The balance of the wallet
     */
    getBalanceOfAddress(address) {
      let balance = 0;
  
      for (const block of this.chain) {
        for (const trans of block.transactions) {
          if (trans.fromAddress === address) {
            balance -= trans.amount;
          }
  
          if (trans.toAddress === address) {
            balance += trans.amount;
          }
        }
      }
  
      console.log('BALANCE : ', balance)
      return balance;
    }
  
    /**
     *
     * @param  {string} address
     * @return {Transaction[]}
     */
    getAllTransactionsForWallet(address) {
      const txs = [];
  
      for (const block of this.chain) {
        for (const tx of block.transactions) {
          if (tx.fromAddress === address || tx.toAddress === address) {
            txs.push(tx);
          }
        }
      }
  
     console.log('get transactions for wallet count: %s', txs.length);
      return txs;
    }
  
    /**
     *
     * @returns {boolean}
     */
    isChainValid() {
 
      const realGenesis = JSON.stringify(this.createGenesisBlock());
  
      if (realGenesis !== JSON.stringify(this.chain[0])) {
        return false;
      }
  
      for (let i = 1; i < this.chain.length; i++) {
        const currentBlock = this.chain[i];
  
        if (!currentBlock.hasValidTransactions()) {
          return false;
        }
  
        if (currentBlock.hash !== currentBlock.calculateHash()) {
          return false;
        }
      }
  
      return true;
    }
  }

  module.exports.Blockchain = Blockchain;
