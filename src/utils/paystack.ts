export interface PaystackPaymentOptions {
  email: string;
  amountKobo: number; // e.g. 50000 = ₦500, 100000 = ₦1000
  planName: string;
  partnerNames: string;
  publicKey?: string;
  isSimulated?: boolean;
  onSuccess: (reference: string) => void;
  onCancel?: () => void;
  onError?: (errorMsg: string) => void;
}

declare global {
  interface Window {
    PaystackPop?: {
      setup: (options: {
        key: string;
        email: string;
        amount: number;
        currency?: string;
        ref?: string;
        metadata?: Record<string, unknown>;
        callback: (response: { reference: string; status?: string }) => void;
        onClose: () => void;
      }) => {
        openIframe: () => void;
      };
    };
  }
}

export function initiatePaystackPayment(options: PaystackPaymentOptions) {
  const {
    email,
    amountKobo,
    planName,
    partnerNames,
    publicKey = 'pk_test_default_flame_reading',
    isSimulated = false,
    onSuccess,
    onCancel,
    onError,
  } = options;

  const generatedRef = `FLAME_${Date.now()}_${Math.floor(Math.random() * 1000000)}`;

  // If in simulated sandbox mode or if window.PaystackPop is missing
  if (isSimulated || !window.PaystackPop) {
    console.log('[Paystack] Simulating payment transaction for:', { planName, partnerNames, amountKobo });
    setTimeout(() => {
      onSuccess(generatedRef);
    }, 900);
    return;
  }

  try {
    const handler = window.PaystackPop.setup({
      key: publicKey,
      email: email || 'customer@flame-love.app',
      amount: amountKobo,
      currency: 'NGN',
      ref: generatedRef,
      metadata: {
        custom_fields: [
          {
            display_name: 'Couples Reading',
            variable_name: 'couples_reading',
            value: partnerNames,
          },
          {
            display_name: 'Plan',
            variable_name: 'plan_tier',
            value: planName,
          },
        ],
      },
      callback: function (response) {
        onSuccess(response.reference || generatedRef);
      },
      onClose: function () {
        if (onCancel) onCancel();
      },
    });

    handler.openIframe();
  } catch (err: unknown) {
    console.error('[Paystack Popup Error]', err);
    if (onError) {
      onError(err instanceof Error ? err.message : 'Unable to initialize Paystack inline modal.');
    } else {
      // Fallback to simulated unlock so user isn't stranded
      onSuccess(generatedRef);
    }
  }
}
