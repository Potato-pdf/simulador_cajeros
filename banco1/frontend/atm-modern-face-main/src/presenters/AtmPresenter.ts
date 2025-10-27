export class AtmPresenter {
  private view: any;

  constructor(view: any) {
    this.view = view;
  }

  async verifyCard(cardNumber: string) {
    try {
      const response = await fetch(`http://localhost:3000/api/verify?cardNumber=${cardNumber}`);
      const data = await response.json();
      if (data.valid) {
        this.view.onCardValid();
      } else {
        this.view.onCardInvalid();
      }
    } catch (error) {
      this.view.onError("Error al verificar tarjeta");
    }
  }

  async withdraw(cardNumber: string, pin: string, amount: number) {
    try {
      const response = await fetch('http://localhost:3000/api/withdraw', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cardNumber, pin, amount })
      });
      const data = await response.json();
      if (data.success) {
        this.view.onWithdrawSuccess(data.message);
      } else {
        this.view.onWithdrawError(data.message);
      }
    } catch (error) {
      this.view.onError("Error en la transacción");
    }
  }
}