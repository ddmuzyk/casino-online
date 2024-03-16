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

export const takeMoney = async () => {
  
}