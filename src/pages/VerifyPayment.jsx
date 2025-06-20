// pages/verify-payment.jsx
import { verifyOrderTransaction } from '@/utils/settings';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function VerifyPayment() {
  const navigate = useNavigate();
  const { ref, id } = useParams();

  const [status, setStatus] = useState('Verifying payment...');
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!ref || !id) return;

    const verifyTransaction = async () => {
      try {
        const result = await verifyOrderTransaction(ref, ref);

        if (result.data?.success) {
          setStatus('✅ Payment verified successfully!');
          toast.success('Payment verified successfully!')
          // optionally redirect after delay
          setTimeout(() => {
            navigate(`/vote/${id}`); // or dashboard, etc.
          }, 2000);
        } else {
          setError(result.data?.message || 'Verification failed');
          toast.error(result.data?.message || 'Verification failed');
        }
      } catch (err) {
        console.error(err);
        setError('An unexpected error occurred during verification.');
        toast.error('An unexpected error occurred during verification.');
      }
    };

    verifyTransaction();
  }, [ref, id]);

  return (
    <div className="p-4 text-center">
      <h2 className="text-xl font-bold mb-2">Payment Verification</h2>
      {error ? <p className="text-red-500">{error}</p> : <p>{status}</p>}
    </div>
  );
}
