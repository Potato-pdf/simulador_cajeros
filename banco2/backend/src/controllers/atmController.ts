import { WithdrawCommandHandler } from "../cqrs/commands/WithdrawCommandHandler";
import { GetAccountQueryHandler } from "../cqrs/queries/GetAccountQueryHandler";
import { CreateAccountCommandHandler } from "../cqrs/commands/CreateAccountCommandHandler";
import { ExternalBankService } from "../domain/services/ExternalBankService";

export class AtmController {
  static async verifyCard(req: any, res: any) {
    const { cardNumber } = req.query;
    const isLocal = cardNumber.startsWith('22');
    if (isLocal) {
      const account = await GetAccountQueryHandler.handle({ cardNumber });
      res.json({ valid: !!account });
    } else {
      const valid = await ExternalBankService.verifyCard(cardNumber);
      res.json({ valid });
    }
  }

  static async withdraw(req: any, res: any) {
    const { cardNumber, pin, amount, isInterbankRequest } = req.body;
    const result = await WithdrawCommandHandler.handle({ cardNumber, pin, amount: parseFloat(amount), isInterbankRequest });
    res.json(result);
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