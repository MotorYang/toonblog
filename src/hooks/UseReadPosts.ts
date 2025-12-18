import { useEffect, useState } from 'react';

const READ_POSTS_KEY = 'toonblog_read_posts';

interface ReadPostsHook {
  readPosts: Set<string>;
  markAsRead: (postId: string) => void;
  markAsUnread: (postId: string) => void;
  isRead: (postId: string) => boolean;
  clearAll: () => void;
}

export const useReadPosts = (): ReadPostsHook => {
  const [readPosts, setReadPosts] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem(READ_POSTS_KEY);
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch {
      return new Set();
    }
  });

  // 保存到 localStorage
  useEffect(() => {
    localStorage.setItem(READ_POSTS_KEY, JSON.stringify(Array.from(readPosts)));
  }, [readPosts]);

  const markAsRead = (postId: string) => {
    setReadPosts((prev) => new Set(prev).add(postId));
  };

  const markAsUnread = (postId: string) => {
    setReadPosts((prev) => {
      const newSet = new Set(prev);
      newSet.delete(postId);
      return newSet;
    });
  };

  const isRead = (postId: string) => {
    return readPosts.has(postId);
  };

  const clearAll = () => {
    setReadPosts(new Set());
  };

  return {
    readPosts,
    markAsRead,
    markAsUnread,
    isRead,
    clearAll,
  };
};
