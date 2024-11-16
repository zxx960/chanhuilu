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
      <div v-if="loading" class="text-center text-gray-400">
        加载中...
      </div>
      
      <!-- 错误提示 -->
      <div v-if="error" class="text-center text-red-400 mb-4">
        {{ error }}
      </div>

      <!-- 信息流列表 -->
      <div class="space-y-4">
        <div v-for="mood in moods" :key="mood.id" 
             class="bg-gray-800 rounded-lg p-4 shadow-lg hover:bg-gray-750 transition">
          <p class="text-gray-300 break-words">{{ mood.content }}</p>
          <div class="mt-2 text-sm text-gray-500 flex justify-between items-center">
            <span>{{ new Date(mood.created_at).toLocaleString() }}</span>
            <div class="flex items-center space-x-2">
              <button @click="likePost(mood.id)" 
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
                :disabled="!newPost.trim() || loading">
          发送
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useMoods } from '~/composables/useMoods'

const { moods, loading, error, fetchMoods, addMood, likeMood } = useMoods()
const newPost = ref('')

// 初始加载数据
onMounted(() => {
  fetchMoods()
})

// 添加新心情
async function addPost() {
  if (!newPost.value.trim()) return
  
  const mood = await addMood(newPost.value)
  if (mood) {
    newPost.value = ''
    await fetchMoods()
  }
}

// 点赞功能
async function likePost(id: number) {
  await likeMood(id)
}

definePageMeta({
  layout: 'default'
})
</script>
