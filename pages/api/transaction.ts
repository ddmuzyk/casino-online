import { NextApiResponse } from 'next';
import type { NextRequest } from 'next/server'
import cookieParser from 'cookie-parser';

export default async function handler(req: any, res: NextApiResponse) {
  const cookie = req.cookies.accessToken
  const body = req.body;
  console.log('cookie: ',cookie)
  if (!cookie) {
    return res.status(401).json({error: 'Unauthorized'})
  }
  
  body.cookies = {
    accessToken: cookie
  }
  try {
    const data = await fetch('http://localhost:3000/takeMoney', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })
    const response = await data.json()  
    res.status(200).json(response)
  } catch (error) {
    console.log('Error: ', error)
    res.status(401).json(null)
  }
}