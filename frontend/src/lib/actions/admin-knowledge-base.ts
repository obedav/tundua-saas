'use server'

import { cookies } from 'next/headers';

const API_URL = process.env['NEXT_PUBLIC_API_URL'] || 'http://localhost:8000';

async function getAuthHeaders() {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;
  return {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
  };
}

export async function getAdminArticles(params?: { page?: number; per_page?: number; category?: string }) {
  try {
    const headers = await getAuthHeaders();
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set('page', String(params.page));
    if (params?.per_page) searchParams.set('per_page', String(params.per_page));
    if (params?.category) searchParams.set('category', params.category);

    const url = `${API_URL}/api/admin/knowledge-base${searchParams.toString() ? '?' + searchParams.toString() : ''}`;
    const response = await fetch(url, { headers });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Failed to fetch articles:', error);
    return { success: false, error: 'Failed to fetch articles' };
  }
}

export async function createArticle(data: {
  title: string;
  slug?: string;
  content: string;
  excerpt?: string;
  category: string;
  tags?: string[];
  is_published?: boolean;
  is_featured?: boolean;
}) {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_URL}/api/admin/knowledge-base`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Failed to create article:', error);
    return { success: false, error: 'Failed to create article' };
  }
}

export async function updateArticle(id: number, data: {
  title?: string;
  slug?: string;
  content?: string;
  excerpt?: string;
  category?: string;
  tags?: string[];
  is_published?: boolean;
  is_featured?: boolean;
}) {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_URL}/api/admin/knowledge-base/${id}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(data),
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Failed to update article:', error);
    return { success: false, error: 'Failed to update article' };
  }
}

export async function deleteArticle(id: number) {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_URL}/api/admin/knowledge-base/${id}`, {
      method: 'DELETE',
      headers,
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Failed to delete article:', error);
    return { success: false, error: 'Failed to delete article' };
  }
}
