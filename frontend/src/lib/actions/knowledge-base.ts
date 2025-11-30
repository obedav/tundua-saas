'use server'

/**
 * Server Actions for Knowledge Base
 *
 * Access help articles and documentation
 */

import { cookies } from 'next/headers'
import { revalidateTag } from 'next/cache'
import { clientEnv } from '@/lib/env'

const API_URL = clientEnv.NEXT_PUBLIC_API_URL

interface ActionResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
}

/**
 * Get auth token from cookies (optional for public articles)
 */
async function getAuthToken(): Promise<string | undefined> {
  return (await cookies()).get('auth_token')?.value
}

/**
 * Get knowledge base articles with optional filters
 */
export async function getKnowledgeBaseArticles(params?: {
  category?: string
  search?: string
  limit?: number
}) {
  try {
    const token = await getAuthToken()

    const url = new URL(`${API_URL}/api/knowledge-base`)
    if (params?.category) url.searchParams.set('category', params.category)
    if (params?.search) url.searchParams.set('search', params.search)
    if (params?.limit) url.searchParams.set('limit', String(params.limit))

    const headers: HeadersInit = {}
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    const response = await fetch(url.toString(), {
      headers,
      next: {
        tags: ['knowledge-base'],
        revalidate: 1800, // Cache for 30 minutes
      },
    })

    if (!response.ok) return null

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Get knowledge base articles error:', error)
    return null
  }
}

/**
 * Get a specific knowledge base article
 */
export async function getKnowledgeBaseArticle(id: number | string) {
  try {
    const token = await getAuthToken()

    const headers: HeadersInit = {}
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    const response = await fetch(`${API_URL}/api/knowledge-base/${id}`, {
      headers,
      next: {
        tags: [`kb-article-${id}`],
        revalidate: 1800, // Cache for 30 minutes
      },
    })

    if (!response.ok) return null

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Get knowledge base article error:', error)
    return null
  }
}

/**
 * Get popular articles
 */
export async function getPopularArticles(params?: { limit?: number }) {
  try {
    const token = await getAuthToken()

    const url = new URL(`${API_URL}/api/knowledge-base/popular`)
    if (params?.limit) url.searchParams.set('limit', String(params.limit))

    const headers: HeadersInit = {}
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    const response = await fetch(url.toString(), {
      headers,
      next: {
        tags: ['kb-popular'],
        revalidate: 3600, // Cache for 1 hour
      },
    })

    if (!response.ok) return null

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Get popular articles error:', error)
    return null
  }
}

/**
 * Get featured articles
 */
export async function getFeaturedArticles(params?: { limit?: number }) {
  try {
    const token = await getAuthToken()

    const url = new URL(`${API_URL}/api/knowledge-base/featured`)
    if (params?.limit) url.searchParams.set('limit', String(params.limit))

    const headers: HeadersInit = {}
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    const response = await fetch(url.toString(), {
      headers,
      next: {
        tags: ['kb-featured'],
        revalidate: 3600, // Cache for 1 hour
      },
    })

    if (!response.ok) return null

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Get featured articles error:', error)
    return null
  }
}

/**
 * Get knowledge base categories
 */
export async function getKnowledgeBaseCategories() {
  try {
    const token = await getAuthToken()

    const headers: HeadersInit = {}
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    const response = await fetch(`${API_URL}/api/knowledge-base/categories`, {
      headers,
      next: {
        revalidate: 3600, // Cache for 1 hour
      },
    })

    if (!response.ok) return null

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Get knowledge base categories error:', error)
    return null
  }
}

/**
 * Mark article as helpful/not helpful
 */
export async function markArticleHelpfulAction(
  id: number,
  helpful: boolean
): Promise<ActionResponse> {
  try {
    const token = await getAuthToken()
    if (!token) {
      return { success: false, error: 'Not authenticated' }
    }

    const response = await fetch(`${API_URL}/api/knowledge-base/${id}/feedback`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ helpful }),
    })

    if (!response.ok) {
      const error = await response.json()
      return { success: false, error: error.message || 'Failed to submit feedback' }
    }

    // Revalidate article
    revalidateTag(`kb-article-${id}`)

    return { success: true }
  } catch (error) {
    console.error('Mark article helpful error:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}
