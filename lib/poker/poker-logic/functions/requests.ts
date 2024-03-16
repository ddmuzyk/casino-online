export const register = async (username: string, email: string, password: string) => {
  let url = 'http://localhost:3000/register'
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include',
    body: JSON.stringify({username, email, password})
  })
  const data = await response.json()
  console.log(data)
  return data
}

export const login = async (email: string, password: string) => {
  try {
    let url = 'http://localhost:3000/signin'
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({email, password})
    })
    const data = await response.json()
    if (data.accessToken) {
      return data
    }
  } catch (error) {
    console.log('Login error: ', error)
    return error
  }
}

interface updateParams {
  take: boolean;
  amount: number;
  prevAmount: number;
}

export const updateMoney = async (take: boolean, amount: number, prevAmount: number) => {

  const payload = {
    action: {
      type: 'update',
      take,
      amount,
      prevAmount,
    }
  }
  try {
    const data = await fetch('/api/transaction', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify(payload)
    })
    const response = await data.json()  
    return response
  } catch (error) {
    console.log('Error: ', error)
    return null
  }
}