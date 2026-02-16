declare module 'razorpay' {
  export interface RazorpayOptions {
    key_id: string;
    key_secret: string;
    headers?: Record<string, string>;
    timeout?: number;
  }

  export interface RazorpayOrder {
    id: string;
    amount: number;
    currency: string;
    receipt?: string;
    status: string;
    attempts: number;
    notes?: Record<string, string>;
    created_at?: number;
  }

  export interface RazorpayPayment {
    id: string;
    entity: string;
    amount: number;
    currency: string;
    status: string;
    method: string;
    order_id?: string;
    invoice_id?: string | null;
    description?: string;
    created_at?: number;
  }

  export default class Razorpay {
    constructor(options: RazorpayOptions);

    orders: {
      create(options: {
        amount: number;
        currency: string;
        receipt?: string;
        notes?: Record<string, string>;
      }): Promise<RazorpayOrder>;
    };

    payments: {
      all(options?: {
        from?: number;
        to?: number;
        count?: number;
        skip?: number;
      }): Promise<{
        entity: string;
        count: number;
        items: RazorpayPayment[];
      }>;
    };
  }
}
