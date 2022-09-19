import { getManager, EntityManager } from 'typeorm';
import ITransactionManager from '@domain/repository/transaction';

export type Transaction = EntityManager;

export default class TransactionManager implements ITransactionManager {
  async transaction(
    callback: (t: Transaction) => Promise<FixType>,
  ): Promise<FixType> {
    return getManager().transaction(callback);
  }
}
