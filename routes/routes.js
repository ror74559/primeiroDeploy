const express = require('express');
const transactionRouter = express.Router();
const transactionService = require('../services/transactionService.js');



transactionRouter.get('/:yearMonth', transactionService.retrieveMonth);

transactionRouter.get('/:yearMonth/:description', transactionService.retrieveMonthDesc);

transactionRouter.post('/', transactionService.create);

transactionRouter.delete('/:id', transactionService.remove);

transactionRouter.put('/up/:id',transactionService.update);


module.exports = transactionRouter;
