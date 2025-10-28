export interface AtmView {
  onLoginSuccess(cardNumber: string, pin: string): void;
  onLoginError(message: string): void;
  onWithdrawSuccess(): void;
  onWithdrawError(message: string): void;
  onError(message: string): void;
}

export class AtmPresenter {
  private view: AtmView;

  constructor(view: AtmView) {
    this.view = view;
  }

  async login(cardNumber: string, pin: string) {
    try {
      // Verifica tarjeta
      const verifyRes = await fetch(`http://localhost:3001/api/verify?cardNumber=${cardNumber}`);
      const verifyData = await verifyRes.json();
      if (!verifyData.valid) {
        this.view.onLoginError("Tarjeta no válida o no encontrada.");
        return;
      }
      this.view.onLoginSuccess(cardNumber, pin);
    } catch (err) {
      this.view.onError("Error de conexión con el backend.");
    }
  }

  async withdraw(cardNumber: string, pin: string, amount: number) {
    try {
      const res = await fetch("http://localhost:3001/api/withdraw", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cardNumber, pin, amount }),
      });
      const data = await res.json();
      if (!data.success) {
        this.view.onWithdrawError(data.error || data.message || "No se pudo realizar el retiro.");
        return;
      }
      this.view.onWithdrawSuccess();
    } catch (err) {
      this.view.onError("Error de conexión con el backend.");
    }
  }
}