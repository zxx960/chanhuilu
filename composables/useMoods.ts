import { ref } from 'vue'

interface Mood {
  id: number
  content: string
  created_at: string
  likes: number
}

export function useMoods() {
  const config = useRuntimeConfig()
  const moods = ref<Mood[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // 获取所有心情
  async function fetchMoods() {
    loading.value = true
    error.value = null
    try {
      const response = await fetch(`${config.public.apiUrl}/query`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${config.public.apiToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sql: 'SELECT * FROM data ORDER BY id DESC'
        })
      })
      
      if (!response.ok) {
        throw new Error('Failed to fetch moods')
      }
      
      const data = await response.json()
      moods.value = data.result || []
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Unknown error'
      console.error('Error fetching moods:', e)
    } finally {
      loading.value = false
    }
  }

  // 添加新心情
  async function addMood(content: string) {
    loading.value = true
    error.value = null
    try {
      const response = await fetch(`${config.public.apiUrl}/query`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${config.public.apiToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sql: `INSERT INTO data (content) VALUES ('${content.replace(/'/g, "''")}')`
        })
      })
      
      if (!response.ok) {
        throw new Error('Failed to add mood')
      }
      
      return await response.json()
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Unknown error'
      console.error('Error adding mood:', e)
      return null
    } finally {
      loading.value = false
    }
  }

  // 点赞功能
  async function likeMood(id: number) {
    try {
      const response = await fetch(`${config.public.apiUrl}/query`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${config.public.apiToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sql: `UPDATE data SET likes = likes + 1 WHERE id = ${id}`
        })
      })
      
      if (!response.ok) {
        throw new Error('Failed to like mood')
      }
      
      await fetchMoods()
    } catch (e) {
      console.error('Error liking mood:', e)
    }
  }

  return {
    moods,
    loading,
    error,
    fetchMoods,
    addMood,
    likeMood
  }
}
