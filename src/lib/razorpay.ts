type RazorpayConfig = {
  keyId?: string;
  keySecret?: string;
  missing: string[];
  isValid: boolean;
};

type RazorpayInstance = InstanceType<typeof import('razorpay').default>;

let razorpayInstance: RazorpayInstance | null = null;

export const getRazorpayConfig = (): RazorpayConfig => {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  const missing: string[] = [];

  if (!keyId) {
    missing.push('RAZORPAY_KEY_ID');
  }

  if (!keySecret) {
    missing.push('RAZORPAY_KEY_SECRET');
  }

  return {
    keyId,
    keySecret,
    missing,
    isValid: missing.length === 0,
  };
};

export const getRazorpayClient = async () => {
  const config = getRazorpayConfig();

  if (!config.isValid) {
    return { client: null, config };
  }

  if (!razorpayInstance) {
    const { default: Razorpay } = await import('razorpay');
    razorpayInstance = new Razorpay({
      key_id: config.keyId as string,
      key_secret: config.keySecret as string,
    });
  }

  return { client: razorpayInstance, config };
};
