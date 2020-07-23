const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

// Aqui havia um erro difícil de pegar. Importei como "transactionModel",
// com "t" minúsculo. No Windows, isso não faz diferença. Mas como no Heroku
// o servidor é Linux, isso faz diferença. Gastei umas boas horas tentando
// descobrir esse erro :-/
const TransactionModel = require('../models/TransactionModel');

const retrieveMonth = async(req,res)=>{
	
	try{
		
		
		const transaction = await TransactionModel.find(req.params);
		let somaDespesa = 0;

		transaction.filter(filter =>{
			if(filter.type === "-"){
				somaDespesa += filter.value;
			}

		});

		let somaGanhos = 0;

		transaction.filter(filter =>{
			if(filter.type === "+"){
				somaGanhos += filter.value;
			}

		});

		let poupanca = somaGanhos - somaDespesa;
		
		res.send({
			totalTransactions:transaction.length,
			receita:somaGanhos,
			despesa:somaDespesa,
			saldo:poupanca,
			transactions:transaction
		});


	}catch(error){
		res.status(500).send(req.params);

	}


};

const retrieveMonthDesc = async(req,res)=>{
		
	try{
		const data = req.params;
		const anoMes = {"yearMonth":data.yearMonth};
		


		const transaction = await TransactionModel.find(anoMes);
		let somaDespesa = 0;

		let transactions = transaction.filter(filter =>{
			if (filter.description.indexOf(req.params.description) != -1){
				return filter;
			}
		})

		transactions.filter(filter =>{
			if(filter.type === "-"){
				somaDespesa += filter.value;
			}

		});

		let somaGanhos = 0;

		transactions.filter(filter =>{
			if(filter.type === "+"){
				somaGanhos += filter.value;
			}

		});

		let poupanca = somaGanhos - somaDespesa;
		
		res.send({
			totalTransactions:transactions.length,
			receita:somaGanhos,
			despesa:somaDespesa,
			saldo:poupanca,
			transactions:transactions
		});
		
		
		
		
		


	}catch(error){
		res.status(500).send(error);

	}


};

const create = async(req,res)=>{
	
	try{
		const transaction = new TransactionModel(req.body);
		await transaction.save();
		res.send(transaction);

	}catch(error){
		res.status(500).send(error);

	}


};

const remove = async(req,res)=>{
	
	try{
		const transaction =  await TransactionModel.findOneAndDelete({'_id':req.params.id})
		if(!transaction){
			res.status(404).send("Documento não encontrado na coleção");
		}
		res.status(200).send("Documento deletado");
		
		

	}catch(error){
		res.status(500).send(error);

	}


};

const update = async(req,res)=>{
	
	try{
		const transaction =  await TransactionModel.findOneAndUpdate({
			_id:req.params.id},req.body,
			{new:true
			});

		res.send(transaction);
		

	}catch(error){
		res.status(500).send(error);

	}


};

module.exports = {retrieveMonth, retrieveMonthDesc,create,remove,update};







