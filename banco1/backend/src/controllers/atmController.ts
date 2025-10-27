import { WithdrawCommandHandler } from "../cqrs/commands/WithdrawCommandHandler";
import { GetAccountQueryHandler } from "../cqrs/queries/GetAccountQueryHandler";
import { CreateAccountCommandHandler } from "../cqrs/commands/CreateAccountCommandHandler";

export class AtmController {
  static async verifyCard(req: any, res: any) {
    try {
      const { cardNumber } = req.query;
      const account = await GetAccountQueryHandler.handle({ cardNumber });
      if (account) {
        res.json({ valid: true });
      } else {
        res.json({ valid: false });
      }
    } catch (error: any) {
      res.status(500).json({ error: "Error interno del servidor" });
    }
  }

  static async withdraw(req: any, res: any) {
    try {
      const { cardNumber, pin, amount } = req.body;
      const result = await WithdrawCommandHandler.handle({ cardNumber, pin, amount: parseFloat(amount) });
      res.json(result);
    } catch (error: any) {
      res.status(400).json({ error: error.message || "Error en la transacción" });
    }
  }

  static async createAccount(req: any, res: any) {
    const { titular, saldoInicial } = req.body;
    try {
      const result = await CreateAccountCommandHandler.handle({ titular, saldoInicial: parseFloat(saldoInicial) });
      res.json(result);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}