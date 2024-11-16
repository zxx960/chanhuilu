<template>
  <div class="min-h-screen bg-gray-900 text-gray-100 p-4">
    <!-- 头部 -->
    <header class="max-w-2xl mx-auto mb-8 mt-12">
      <h1 class="text-3xl font-bold text-center text-purple-400">忏悔录</h1>
      <p class="text-center text-gray-400 text-sm mt-2">记录你的忏悔，没人知道你是谁</p>
    </header>

    <!-- 主要内容区 -->
    <main class="max-w-2xl mx-auto mb-24">
      <!-- 加载状态 -->
      <div v-if="pending" class="text-center text-gray-400">
        加载中...
      </div>
      
      <!-- 错误提示 -->
      <div v-if="error" class="text-center text-red-400 mb-4">
        {{ error }}
      </div>

      <!-- 信息流列表 -->
      <div class="space-y-4">
        <div v-for="mood in data?.result || []" :key="mood.id" 
             class="bg-gray-800 rounded-lg p-4 shadow-lg hover:bg-gray-750 transition">
          <p class="text-gray-300 break-words">{{ mood.content }}</p>
          <div class="mt-2 text-sm text-gray-500 flex justify-between items-center">
            <span>{{ new Date(mood.created_at).toLocaleString() }}</span>
            <div class="flex items-center space-x-2">
              <button @click="likeMood(mood.id)" 
                      class="flex items-center space-x-1 text-purple-400 hover:text-purple-300 transition">
                <span>❤️</span>
                <span>{{ mood.likes }}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- 输入区域 -->
    <div class="fixed bottom-0 left-0 right-0 bg-gray-800/95 backdrop-blur-sm p-4 border-t border-gray-700">
      <div class="max-w-2xl mx-auto flex gap-2">
        <input v-model="newPost" 
               @keyup.enter="addPost"
               placeholder="分享你的忏悔..." 
               class="flex-1 bg-gray-700 text-gray-100 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
               maxlength="200"/>
        <button @click="addPost" 
                class="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
                :disabled="!newPost.trim() || pending">
          发送
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const newPost = ref('')
const error = ref<string | null>(null)

// 获取所有数据
const { data, pending, refresh } = await useFetch('/api/moods', {
  method: 'POST',
  body: {
    sql: 'SELECT * FROM data ORDER BY id DESC'
  }
})

// 添加新内容
async function addPost() {
  if (!newPost.value.trim()) return
  
  try {
    const response = await $fetch('/api/moods', {
      method: 'POST',
      body: {
        sql: `INSERT INTO data (content) VALUES ('${newPost.value}') RETURNING *`
      }
    })
    
    if (response) {
      newPost.value = ''
      refresh()
    }
  } catch (e) {
    error.value = e instanceof Error ? e.message : '发送失败'
    console.error('添加失败:', e)
  }
}

// 点赞功能
async function likeMood(id: number) {
  try {
    const response = await $fetch('/api/moods', {
      method: 'POST',
      body: {
        sql: `UPDATE data SET likes = likes + 1 WHERE id = ${id} RETURNING *`
      }
    })
    
    if (response) {
      refresh()
    }
  } catch (e) {
    error.value = e instanceof Error ? e.message : '点赞失败'
    console.error('点赞失败:', e)
  }
}

definePageMeta({
  layout: 'default'
})
</script>
