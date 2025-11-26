import React, { createContext, useContext, useState, useEffect } from 'react';
import { BlogPost, BlogContextType } from '../types';
import { api } from '../services/api';

const BlogContext = createContext<BlogContextType | undefined>(undefined);

export const BlogProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch posts on mount
  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      try {
        const data = await api.posts.getAll();
        setPosts(data);
      } catch (error) {
        console.error("Failed to fetch posts", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const addPost = async (post: BlogPost) => {
    // Optimistic update could go here, but let's wait for API for consistency
    try {
      const newPost = await api.posts.create(post);
      setPosts((prev) => [newPost, ...prev]);
    } catch (error) {
      console.error("Failed to create post", error);
      throw error;
    }
  };

  const deletePost = async (id: string) => {
    try {
      await api.posts.delete(id);
      setPosts((prev) => prev.filter((p) => p.id !== id));
    } catch (error) {
      console.error("Failed to delete post", error);
      throw error;
    }
  };

  const getPost = (id: string) => {
    return posts.find((p) => p.id === id);
  };

  const incrementViews = async (id: string) => {
    try {
      const newViewCount = await api.posts.incrementViews(id);
      setPosts((prev) => 
        prev.map(post => 
          post.id === id ? { ...post, views: newViewCount } : post
        )
      );
    } catch (error) {
      console.error("Failed to increment views", error);
    }
  };

  return (
    <BlogContext.Provider value={{ posts, isLoading, addPost, deletePost, getPost, incrementViews }}>
      {children}
    </BlogContext.Provider>
  );
};

export const useBlogStore = () => {
  const context = useContext(BlogContext);
  if (!context) {
    throw new Error('useBlogStore must be used within a BlogProvider');
  }
  return context;
};