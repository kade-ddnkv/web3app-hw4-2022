require("dotenv").config();

const CONTRACT_ABI = require('./CONTRACT_ABI.json');

const Web3 = require('web3');
var web3 = new Web3(new Web3.providers.HttpProvider(`https://goerli.infura.io/v3/${process.env.INFURA_API_KEY}`));
const address = process.env.CONTRACT_ADDRESS;
const ABI = CONTRACT_ABI;
console.log(await web3.eth.getBalance(process.env.MY_GOERLI_ADDRESS));
const contract = new web3.eth.Contract(ABI, address);

const signer = web3.eth.accounts.privateKeyToAccount(process.env.SIGNER_PRIVATE_KEY);
web3.eth.accounts.wallet.add(signer);

// ФУУУХ. У меня наконец получилось послать транзакцию. Слов нет.

// Добавляю 3 монетки рандомным людям.
// Транзакция может проваливаться из-за недостатка газа.
let tx = contract.methods.citizenEarnsCoin();
for (let i = 0; i < 3; i++) {
	let receipt = await tx.send({ from: signer.address, gas: await tx.estimateGas() }).once("transactionHash" , (txHash) => { console.info("mining transaction...", txHash) });
}

// Я, как robber, хочу подписаться на ивент somebodyEarnsCoin.
// :( пока не знаю, как создать полнодуплексное подключение.

// Узнаю, сколько всего монет в городе было заработано.
// Должно быть точно >= 3х монет.
contract.methods.coinsInTown().call().then(console.log);

// Это должно вывести >= 3х произошедших ивента.
contract.getPastEvents(
	'somebodyEarnsCoin',
	{
		fromBlock: 6321265,
		toBlock: 'latest'
	},
	(err, events) => { console.log(events) }
);

// TODO: Совершаю ограбление. Нужны какие-то токены, чтобы деактивировать существующие токены монет.
// Потому что делать transferFrom не с аккаунта владельца токена нельзя.
//tx = contract.methods.performRobbery();
//receipt = await tx.send({ from: signer.address, gas: await tx.estimateGas() }).once("transactionHash" , (txHash) => { console.info("mining transaction...", txHash) });

// Проверяю, что последний совершивший ограбление - действительно я.
//tx = contract.methods.checkLastRobber();
//receipt = await tx.send({ from: signer.address, gas: await tx.estimateGas() }).once("transactionHash" , (txHash) => { console.info("mining transaction...", txHash) });