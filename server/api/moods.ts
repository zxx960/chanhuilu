import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://fseftsqlgaafkfrkrdsn.supabase.co'
const supabaseKey = process.env.SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

export default defineEventHandler(async (event) => {
  console.log('API路由被调用')

  try {
    const body = await readBody(event)
    console.log('请求体:', body)

    if (!supabaseKey) {
      throw new Error('Supabase Key未配置')
    }

    // 解析SQL语句类型
    const sql = body.sql.trim().toUpperCase()
    let response

    if (sql.startsWith('SELECT')) {
      response = await supabase
        .from('info')
        .select('*')
        .order('created_at', { ascending: false })
    } 
    else if (sql.startsWith('INSERT')) {
      const content = body.sql.match(/VALUES \('([^']+)'/)[1]
      response = await supabase
        .from('info')
        .insert([{ content }])
        .select()
    }
    else if (sql.startsWith('UPDATE')) {
      const id = body.sql.match(/WHERE id = (\d+)/)[1]
      const { data: mood } = await supabase
        .from('info')
        .select('likes')
        .eq('id', id)
        .single()

      response = await supabase
        .from('info')
        .update({ likes: (mood?.likes || 0) + 1 })
        .eq('id', id)
        .select()
    }

    if (response.error) {
      throw response.error
    }

    console.log('API响应数据:', response.data)
    return {
      result: response.data
    }
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
