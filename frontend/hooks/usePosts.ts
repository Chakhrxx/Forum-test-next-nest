import { useState, useEffect } from "react";
import { PostService } from "@/services/post";
import { PostPaginateResponse, Post, PostRequest } from "@/types/post";

export const usePosts = () => {
  const [posts, setPosts] = useState<PostPaginateResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [singlePost, setSinglePost] = useState<Post | null>(null);
  const [isMyPosts, setIsMyPosts] = useState<boolean>(false); // State to track fetching of my posts

  const createPost = async (data: PostRequest) => {
    setLoading(true);
    setError(null);
    try {
      await PostService.create(data);
      await refetchPosts();
    } catch (err) {
      setError("Error creating post");
      console.error("Error creating post:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const response: PostPaginateResponse = await PostService.findAll();
      setPosts(response);
    } catch (err) {
      setError("Error fetching posts");
    } finally {
      setLoading(false);
    }
  };

  const fetchMyPosts = async () => {
    setLoading(true);
    try {
      const response: PostPaginateResponse = await PostService.findMyPost();
      setPosts(response);
    } catch (err) {
      setError("Error fetching my posts");
    } finally {
      setLoading(false);
    }
  };

  const fetchSinglePost = async (id: string) => {
    setLoading(true);
    setSinglePost(null);
    try {
      const post: Post = await PostService.findOne(id);
      setSinglePost(post);
    } catch (err) {
      setError("Error fetching post");
    } finally {
      setLoading(false);
    }
  };

  const deletePost = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await PostService.delete(id);
      await refetchPosts();
    } catch (err) {
      setError("Error deleting post");
      console.error("Error deleting post:", err);
    } finally {
      setLoading(false);
    }
  };

  const updatePost = async (id: string, data: PostRequest) => {
    setLoading(true);
    setError(null);
    try {
      const response = await PostService.update(id, data);
      await fetchSinglePost(response.id);
      await refetchPosts();
    } catch (err) {
      setError("Error updating post");
      console.error("Error updating post:", err);
    } finally {
      setLoading(false);
    }
  };

  const refetchPosts = async () => {
    if (isMyPosts) {
      await fetchMyPosts();
    } else {
      await fetchPosts();
    }
  };

  // Effect to fetch posts based on the current state
  useEffect(() => {
    if (isMyPosts) {
      fetchMyPosts();
    } else {
      fetchPosts();
    }
  }, [isMyPosts]); // Run effect when `isMyPosts` changes

  return {
    singlePost,
    posts: posts ? posts.posts : [],
    total: posts ? posts.total : 0,
    loading,
    error,
    createPost,
    fetchSinglePost,
    refetchPosts,
    updatePost,
    deletePost,
    setIsMyPosts, // Expose the setter to change the state
  };
};
