export default class ITransactionManager {
  transaction: (
    callback: (t: TransactionType) => Promise<FixType>,
  ) => Promise<FixType>;
}
