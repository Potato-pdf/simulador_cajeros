export class ExternalBankService {
  static async verifyCard(cardNumber: string): Promise<boolean> {
    try {
      const response = await fetch('http://localhost:3001/api/verify?cardNumber=' + cardNumber);
      const data : any = await response.json();
      return data.valid || false;
    } catch {
      return false;
    }
  }

  static async performInterbankWithdrawal(cardNumber: string, pin: string, amount: number): Promise<{ success: boolean; message: string }> {
    console.log('ExternalBankService: Iniciando retiro interbancario para', cardNumber, pin, amount);
    try {
      const response = await fetch('http://localhost:3001/api/withdraw', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cardNumber, pin, amount }),
      });
      console.log('ExternalBankService: Respuesta status', response.status);
      const data = await response.json();
      console.log('ExternalBankService: Datos recibidos', data);
      return { success: data.success, message: data.message || 'Error interbancario' };
    } catch (error) {
      console.log('ExternalBankService: Error en fetch', error);
      return { success: false, message: 'Error de conexión con banco externo' };
    }
  }
}