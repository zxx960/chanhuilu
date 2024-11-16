const config = useRuntimeConfig()

export default defineEventHandler(async (event) => {
  console.log('API路由被调用')
  
  const config = useRuntimeConfig()
  console.log('运行时配置:', {
    apiUrl: config.public.apiUrl,
    hasToken: !!config.public.apiToken
  })

  try {
    const body = await readBody(event)
    console.log('请求体:', body)

    if (!config.public.apiUrl) {
      throw new Error('API URL未配置')
    }

    if (!config.public.apiToken) {
      throw new Error('API Token未配置')
    }

    console.log('准备发送请求到:', `${config.public.apiUrl}/query`)
    
    const response = await fetch(`${config.public.apiUrl}/query`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${config.public.apiToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body)
    })

    console.log('收到响应:', {
      status: response.status,
      statusText: response.statusText
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('API错误响应:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText
      })
      throw new Error(`API请求失败: ${response.status} ${errorText}`)
    }

    const data = await response.json()
    console.log('API响应数据:', data)
    return data
  } catch (error) {
    console.error('服务器端错误:', error instanceof Error ? {
      message: error.message,
      stack: error.stack
    } : error)
    
    throw createError({
      statusCode: 500,
      message: error instanceof Error ? error.message : 'Internal Server Error',
      stack: error instanceof Error ? error.stack : undefined
    })
  }
})
