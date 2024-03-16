import { NextApiRequest, NextApiResponse } from 'next';
import { cookies } from 'next/headers'
import cookie from 'cookie';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const cookieStore = cookies()
  const body = req.body;
  const cookie = cookieStore.get('accessToken');
  console.log('cookie: ',cookie)
  if (!cookie) {
    return res.status(401).json({error: 'Unauthorized'})
  }
  body.cookie = cookie
  body.shit = 'shit'
  try {
    const data = await fetch('http://localhost:3000/takeMoney', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })
    const response = await data.json()  
    return response
  } catch (error) {
    console.log('Error: ', error)
    return error
  }
}