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
    publicKey = 'pk_test_1d2ffab6b4e4642d0f893edb232013808b96b818',
    isSimulated = false,
    onSuccess,
    onCancel,
    onError,
  } = options;

  const generatedRef = `FLAME_${Date.now()}_${Math.floor(Math.random() * 1000000)}`;

  // Load Paystack script if not already loaded
  if (!window.PaystackPop && !isSimulated) {
    const script = document.createElement('script');
    script.src = 'https://js.paystack.co/v1/inline.js';
    script.async = true;
    script.onload = () => {
      initializePaystackPayment();
    };
    script.onerror = () => {
      if (onError) {
        onError('Failed to load Paystack. Please check your connection.');
      }
    };
    document.head.appendChild(script);
    return;
  }

  // If in simulated sandbox mode
  if (isSimulated) {
    console.log('[Paystack] Simulating payment transaction for:', { planName, partnerNames, amountKobo });
    setTimeout(() => {
      onSuccess(generatedRef);
    }, 900);
    return;
  }

  // If window.PaystackPop is already available
  if (window.PaystackPop) {
    initializePaystackPayment();
  }

  function initializePaystackPayment() {
    if (!window.PaystackPop) {
      if (onError) onError('Paystack failed to load. Please refresh and try again.');
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
              display_name: 'Reading Type',
              variable_name: 'reading_type',
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
          console.log('[Paystack] Payment successful:', response.reference);
          onSuccess(response.reference || generatedRef);
        },
        onClose: function () {
          console.log('[Paystack] Payment modal closed without completion');
          if (onCancel) onCancel();
        },
      });

      handler.openIframe();
    } catch (err: unknown) {
      console.error('[Paystack Popup Error]', err);
      if (onError) {
        onError(err instanceof Error ? err.message : 'Unable to initialize Paystack payment modal.');
      }
    }
  }
}
