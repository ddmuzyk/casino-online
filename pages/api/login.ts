import { NextApiRequest, NextApiResponse } from 'next';
import { login } from '@/lib/poker/poker-logic/functions/requests';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { email, password } = req.body;
  const response = await login(email, password);

  if (response === 'error') {
    res.status(401).json('error');
  } else {
    // Ensure you set cookies correctly; consider security flags
    res.setHeader('Set-Cookie', `accessToken=${response.accessToken}; Path=/; Secure; SameSite=Lax`);
    res.status(200).json({ success: true });
  }
}