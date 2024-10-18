import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

export default function ResetPasswordPage() {
  const [token, setToken] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const router = useRouter();

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setMessage('');
    setIsError(false);

    try {
      const response = await axios.post('/api/auth/reset-password', { token, password });
      setMessage(response.data.message);
      setIsError(false); // ไม่มีข้อผิดพลาด
      // คุณสามารถนำทางไปยังหน้า login หรือหน้าอื่น ๆ ได้ที่นี่
    } catch (error) {
      setMessage(error.response?.data?.message || 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง.');
      setIsError(true); // มีข้อผิดพลาด
    }
  };

  return (
    <div>
      <h2>รีเซ็ตรหัสผ่าน</h2>
      <form onSubmit={handleResetPassword}>
        <input
          type="text"
          placeholder="Token"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="รหัสผ่านใหม่"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">รีเซ็ตรหัสผ่าน</button>
      </form>

      {message && (
        <div className={`mt-2 ${isError ? 'bg-red-50 border-red-400' : 'bg-green-50 border-green-400'} border-l-4 p-4`}>
          <p className={`text-sm ${isError ? 'text-red-700' : 'text-green-700'}`}>
            {message}
          </p>
        </div>
      )}
    </div>
  );
}
