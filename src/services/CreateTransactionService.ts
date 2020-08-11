import TransactionsRepository from '../repositories/TransactionsRepository';
import Transaction from '../models/Transaction';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
}

class CreateTransactionService {
  private transactionsRepository: TransactionsRepository;

  constructor(transactionsRepository: TransactionsRepository) {
    this.transactionsRepository = transactionsRepository;
  }

  public execute({ title, value, type }: Request): Transaction {
    const {
      total: valueTotalBalance,
    } = this.transactionsRepository.getBalance();

    if (type !== 'income' && type !== 'outcome') {
      throw Error('Enter a valid type (income, outcome)');
    }

    if (type === 'outcome' && value > valueTotalBalance) {
      throw Error(
        'It was not possible to register an exit, cash value less than the exit',
      );
    }

    const transaction = this.transactionsRepository.create({
      title,
      value,
      type,
    });

    return transaction;
  }
}

export default CreateTransactionService;
