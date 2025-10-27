import type{ GetAccountQuery } from "./GetAccountQuery";
import { CuentaDao } from "../../daos/cuentaDao";
import type { Cuenta } from "../../models/cuenta";

export class GetAccountQueryHandler {
  static async handle(query: GetAccountQuery): Promise<Cuenta | null> {
    return await CuentaDao.findByCardNumber(query.cardNumber);
  }
}