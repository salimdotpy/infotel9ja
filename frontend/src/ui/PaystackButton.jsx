import { Button } from '@material-tailwind/react';
import { useEffect } from 'react';
import { toast } from 'react-toastify';

export default function PaystackButton({
  email,
  amount,
  publicKey,
  currency = 'NGN',
  reference = `ref-${Date.now()}`,
  channels = ['card', 'bank_transfer', 'ussd'], // default: all
  metadata = {},
  onSuccess = () => {},
  onClose = () => {},
  onSubmit = async () => {},
  children = 'Pay Now',
  ...prop
}) {
  useEffect(() => {
    if (!window.PaystackPop) {
      const script = document.createElement('script');
      script.src = 'https://js.paystack.co/v1/inline.js';
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  const handlePayment = async () => {
    if (!window.PaystackPop) {
      toast.warning('Paystack is not loaded yet');
      return;
    }
    const result = await onSubmit();
    const ref = result?.id;
    if (!ref) {
      toast.error('Something went wrong, please try again');
      return;
    }
    const handler = window.PaystackPop.setup({
      key: publicKey,
      email,
      amount: amount * 100, // convert to kobo
      currency,
      ref: ref,
      channels, // ✅ restrict payment methods
      metadata,
      callback: function (response) {
        onSuccess(response);
      },
      onClose: function () {
        onClose();
      },
    });

    handler.openIframe();
  };

  return (
    <Button onClick={handlePayment} {...prop}>{children}</Button>
  );
}
