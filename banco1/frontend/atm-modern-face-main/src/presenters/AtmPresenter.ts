export interface AtmView {
  onCardValid(): void;
  onCardInvalid(): void;
  onPinValid(): void;
  onWithdrawSuccess(message: string): void;
  onWithdrawError(message: string): void;
  onError(message: string): void;
}

export class AtmPresenter {
  private view: AtmView;

  constructor(view: AtmView) {
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

  async verifyPin(pin: string) {
    // Simulación de verificación PIN (podría verificarse en backend si es necesario)
    if (pin.length === 4) {
      this.view.onPinValid();
    } else {
      this.view.onError("PIN inválido");
    }
  }

  async withdraw(cardNumber: string, pin: string, amount: number) {
    console.log('AtmPresenter banco1: Withdraw llamado con', cardNumber, pin, amount);
    try {
      const response = await fetch('http://localhost:3000/api/withdraw', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cardNumber, pin, amount })
      });
      const data = await response.json();
      console.log('AtmPresenter banco1: Respuesta withdraw', data);
      if (data.success) {
        this.view.onWithdrawSuccess(data.message);
      } else {
        this.view.onWithdrawError(data.message);
      }
    } catch (error) {
      console.log('AtmPresenter banco1: Error en withdraw', error);
      this.view.onError("Error en la transacción");
    }
  }
}