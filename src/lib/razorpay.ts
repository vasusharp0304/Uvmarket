type RazorpayConfig = {
  keyId?: string;
  keySecret?: string;
  missing: string[];
  isValid: boolean;
};

type RazorpayConstructor = typeof import('razorpay');

type RazorpayInstance = InstanceType<RazorpayConstructor>;

let razorpayInstance: RazorpayInstance | null = null;

const loadRazorpayConstructor = async (): Promise<RazorpayConstructor> => {
  const razorpayModule = await import('razorpay');
  const moduleWithDefault = razorpayModule as { default?: RazorpayConstructor };

  return moduleWithDefault.default ?? (razorpayModule as RazorpayConstructor);
};

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
    const Razorpay = await loadRazorpayConstructor();
    razorpayInstance = new Razorpay({
      key_id: config.keyId as string,
      key_secret: config.keySecret as string,
    });
  }

  return { client: razorpayInstance, config };
};
