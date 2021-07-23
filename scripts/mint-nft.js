require('dotenv').config();
const ALCHEMY_API_URL = process.env.ALCHEMY_API_URL;
const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const web3 = createAlchemyWeb3(ALCHEMY_API_URL);

const contract = require("../artifacts/contracts/MyNFT.sol/MyNFT.json"); 

// console.log(JSON.stringify(contract.abi));

const contractAddress = "0x4d47f75bd5faa7c032b8c38a42ccf397b6e628b0";
const nftContract = new web3.eth.Contract(contract.abi, contractAddress);

const PRIVATE_KEY = process.env.PRIVATE_KEY;
const PUBLIC_KEY = process.env.PUBLIC_KEY;

async function mintNFT(tokenURI) {
    const nonce = await web3.eth.getTransactionCount(PUBLIC_KEY, 'latest'); //get latest nonce
  
    //the transaction
    const tx = {
      'from': PUBLIC_KEY,
      'to': contractAddress,
      'nonce': nonce,
      'gas': 500000,
      'data': nftContract.methods.mintNFT(PUBLIC_KEY, tokenURI).encodeABI()
    };
  
  
    const signPromise = web3.eth.accounts.signTransaction(tx, PRIVATE_KEY);
    signPromise.then((signedTx) => {
  
      web3.eth.sendSignedTransaction(signedTx.rawTransaction, function(err, hash) {
        if (!err) {
          console.log("The hash of your transaction is: ", hash, "\nCheck Alchemy's Mempool to view the status of your transaction!"); 
        } else {
          console.log("Something went wrong when submitting your transaction:", err)
        }
      });
    }).catch((err) => {
      console.log(" Promise failed:", err);
    });
  }

mintNFT("https://gateway.pinata.cloud/ipfs/QmQpqNKzBQv8UMR7Vcy8wUm3HzEqmahuP3vf6mdfz3Nc4L");