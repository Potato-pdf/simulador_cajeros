import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export type Step = 'login' | 'withdrawal' | 'receipt';

export interface Transaction {
  cardNumber: string;
  amount: number;
  date: Date;
  transactionId: string;
}

export interface AtmState {
  step: Step;
  transaction: Transaction | null;
  isLoading: boolean;
  errorMessage: string;
  pin: string;
}

/**
 * AtmViewModel - MVVM Pattern Implementation para Banco 2
 * 
 * Responsabilidades:
 * - Mantener el estado reactivo de la aplicación
 * - Exponer observables para que las vistas se suscriban
 * - Ejecutar la lógica de presentación
 * - Manejar login, retiro y transacciones
 */
export class AtmViewModel {
  // BehaviorSubject privado para mantener el estado
  private stateSubject = new BehaviorSubject<AtmState>({
    step: 'login',
    transaction: null,
    isLoading: false,
    errorMessage: '',
    pin: '',
  });

  // Observables públicos - las vistas se suscriben a estos
  public state$: Observable<AtmState> = this.stateSubject.asObservable();

  // Observables derivados para fácil acceso a propiedades específicas
  public step$: Observable<Step> = this.state$.pipe(map(state => state.step));
  public transaction$: Observable<Transaction | null> = this.state$.pipe(map(state => state.transaction));
  public isLoading$: Observable<boolean> = this.state$.pipe(map(state => state.isLoading));
  public errorMessage$: Observable<string> = this.state$.pipe(map(state => state.errorMessage));
  public pin$: Observable<string> = this.state$.pipe(map(state => state.pin));

  /**
   * Obtiene el estado actual sin necesidad de Observable
   */
  get currentState(): AtmState {
    return this.stateSubject.getValue();
  }

  /**
   * Actualiza el estado de forma reactiva
   */
  private updateState(partial: Partial<AtmState>): void {
    const currentState = this.currentState;
    this.stateSubject.next({ ...currentState, ...partial });
  }

  /**
   * Comando: Establecer paso actual
   */
  public setStep(step: Step): void {
    this.updateState({ step });
  }

  /**
   * Comando: Establecer transacción
   */
  public setTransaction(transaction: Transaction | null): void {
    this.updateState({ transaction });
  }

  /**
   * Comando: Establecer estado de carga
   */
  public setLoading(isLoading: boolean): void {
    this.updateState({ isLoading });
  }

  /**
   * Comando: Establecer mensaje de error
   */
  public setError(errorMessage: string): void {
    this.updateState({ errorMessage });
  }

  /**
   * Comando: Limpiar mensaje de error
   */
  public clearError(): void {
    this.updateState({ errorMessage: '' });
  }

  /**
   * Comando: Establecer PIN
   */
  public setPin(pin: string): void {
    this.updateState({ pin });
  }

  /**
   * Comando: Login - Verificar tarjeta y PIN
   */
  public async login(cardNumber: string, pin: string): Promise<boolean> {
    this.setLoading(true);
    this.clearError();

    try {
      // Verificar tarjeta
      const verifyRes = await fetch(`http://localhost:3001/api/verify?cardNumber=${cardNumber}`);
      const verifyData = await verifyRes.json();

      if (!verifyData.valid) {
        this.setError('Tarjeta no válida o no encontrada.');
        return false;
      }

      // Login exitoso
      this.setPin(pin);
      const newTransaction: Transaction = {
        cardNumber,
        amount: 0,
        date: new Date(),
        transactionId: Math.random().toString(36).substring(2, 15).toUpperCase(),
      };

      this.setTransaction(newTransaction);
      this.setStep('withdrawal');
      return true;
    } catch (err) {
      this.setError('Error de conexión con el backend.');
      return false;
    } finally {
      this.setLoading(false);
    }
  }

  /**
   * Comando: Procesar retiro
   */
  public async withdraw(amount: number): Promise<boolean> {
    this.setLoading(true);
    this.clearError();

    try {
      const { transaction, pin } = this.currentState;

      if (!transaction) {
        this.setError('No hay transacción activa');
        return false;
      }

      const res = await fetch('http://localhost:3001/api/withdraw', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cardNumber: transaction.cardNumber,
          pin,
          amount,
        }),
      });

      const data = await res.json();

      if (!data.success) {
        this.setError(data.error || data.message || 'No se pudo realizar el retiro.');
        return false;
      }

      // Retiro exitoso
      const updatedTransaction: Transaction = {
        ...transaction,
        amount,
        date: new Date(),
      };

      this.setTransaction(updatedTransaction);
      this.setStep('receipt');
      return true;
    } catch (err) {
      this.setError('Error de conexión con el backend.');
      return false;
    } finally {
      this.setLoading(false);
    }
  }

  /**
   * Comando: Nueva transacción
   */
  public newTransaction(): void {
    this.stateSubject.next({
      step: 'login',
      transaction: null,
      isLoading: false,
      errorMessage: '',
      pin: '',
    });
  }

  /**
   * Comando: Volver a login
   */
  public backToLogin(): void {
    this.setStep('login');
    this.setTransaction(null);
    this.setPin('');
  }
}
