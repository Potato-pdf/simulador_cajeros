export class ExternalBankService {
  static async verifyCard(cardNumber: string): Promise<boolean> {
    try {
      const response = await fetch('http://localhost:3000/api/verify?cardNumber=' + cardNumber);
      const data : any = await response.json();
      return data.valid || false;
    } catch {
      return false;
    }
  }

  static async performInterbankWithdrawal(cardNumber: string, pin: string, amount: number): Promise<{ success: boolean; message: string }> {
    try {
      const response = await fetch('http://localhost:3000/api/withdraw', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cardNumber, pin, amount }),
      });
      const data : any = await response.json();
      return { success: data.success, message: data.message || 'Error interbancario' };
    } catch (error) {
      return { success: false, message: 'Error de conexión con banco externo' };
    }
  }
}