import { INITIAL_POSTS } from '../constants';
import { BlogPost } from '../types';

// MOCK DATABASE
let mockPosts: BlogPost[] = [...INITIAL_POSTS];

// Helper to simulate network delay
const delay = (ms: number = 800) => new Promise((resolve) => setTimeout(resolve, ms));

export const api = {
  posts: {
    getAll: async (): Promise<BlogPost[]> => {
      await delay();
      return [...mockPosts];
    },

    getById: async (id: string): Promise<BlogPost | undefined> => {
      await delay(500);
      return mockPosts.find((p) => p.id === id);
    },

    create: async (post: BlogPost): Promise<BlogPost> => {
      await delay();
      mockPosts = [post, ...mockPosts];
      return post;
    },

    delete: async (id: string): Promise<void> => {
      await delay();
      mockPosts = mockPosts.filter((p) => p.id !== id);
    },

    incrementViews: async (id: string): Promise<number> => {
      await delay(300); // Faster for interactions
      const postIndex = mockPosts.findIndex((p) => p.id === id);
      if (postIndex > -1) {
        const currentViews = mockPosts[postIndex].views || 0;
        mockPosts[postIndex] = {
          ...mockPosts[postIndex],
          views: currentViews + 1,
        };
        return mockPosts[postIndex].views;
      }
      return 0;
    },
  },

  auth: {
    login: async (
      username: string,
      password: string,
    ): Promise<{ user: string; isAdmin: boolean }> => {
      await delay(1000);

      // Mock validation logic moved from UI to API
      if (username === 'admin' && password === '123456') {
        return { user: 'admin', isAdmin: true };
      }

      // Allow other users for testing, but not as admin
      if (username && username !== 'admin') {
        return { user: username, isAdmin: false };
      }

      throw new Error('Invalid credentials');
    },
  },
};
