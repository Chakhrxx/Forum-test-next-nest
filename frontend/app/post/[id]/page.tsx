"use client";
import React, { useEffect } from "react";
import { use } from "react"; // Import use from React
import LeftSidebar from "@/components/LeftSidebar";
import Navbar from "@/components/Navbar";
import { useState } from "react";
import CommentFormModal from "@/components/CommentFormModal";
import CommentInput from "@/components/CommentInput";
import { usePosts } from "@/hooks/usePosts";
import { useAuth } from "@/hooks/useAuth";
import { notFound } from "next/navigation";
import { useComments } from "@/hooks/useComments";
import { Comment } from "@/types/comment";

export default function HomePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: postId } = use(params);
  const { singlePost, fetchSinglePost, loading, error } = usePosts();
  const { createComment, updateComment, deleteComment } = useComments();
  const { user } = useAuth();

  const [isAddCommentsOpen, setIsAddCommentsOpen] = useState<boolean>(false);
  const [comment, setComment] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCommentId(null); // Reset editing state on close
  };

  const handleToggleComments = (): void => {
    setIsAddCommentsOpen((prev) => !prev);
    setComment(""); // Clear textarea when opening
  };

  const handlePostClick = async (): Promise<void> => {
    const userId = user?.id || "";
    const data = {
      message: comment,
      postId,
      userId,
    };
    console.log("data", data);
    if (comment.trim()) {
      if (editingCommentId !== null) {
        await updateComment(editingCommentId, data);
        await fetchSinglePost(postId);
      } else {
        await createComment(data);
        await fetchSinglePost(postId);
      }

      setComment(""); // Clear the textarea
      setIsAddCommentsOpen(false); // Close the textarea after posting
      closeModal();
    }
  };

  const handleEdit = (commentToEdit: Comment) => {
    setComment(commentToEdit.message);
    setEditingCommentId(commentToEdit.id);
    setIsAddCommentsOpen(true); // Open the comment input
    setIsModalOpen(true);
  };

  const handleDeleteClick = async (id: string) => {
    await deleteComment(id);
    await fetchSinglePost(postId);
  };

  const formatTimeDifference = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) {
      return `${diffInSeconds} second${diffInSeconds !== 1 ? "s" : ""} ago`;
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} minute${minutes !== 1 ? "s" : ""} ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
    } else {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} day${days !== 1 ? "s" : ""} ago`;
    }
  };

  useEffect(() => {
    fetchSinglePost(postId);
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center w-full h-screen">
        <div className="loader"></div>
      </div>
    );

  if (error && !singlePost) {
    notFound();
  }

  return (
    <>
      <Navbar rightSidebarIndex={""} />
      <main className="w-full flex flex-col bg-white pt-[60px] lg:pl-[280px]  min-h-screen">
        <div className="flex w-full h-full justify-center lg:justify-start ">
          <LeftSidebar index={"home"} />
          <div className="flex flex-col w-full  lg:w-[60%] items-center">
            <div className="flex flex-col w-full px-4 lg:px-8">
              <div className="bg-white mb-10 ">
                {/* Post */}
                <div>
                  <div className="px-8 py-6 pb-6">
                    <a href="/">
                      <button
                        className="w-[44px] h-[44px] flex items-center rounded-full bg-green-100 py-1 px-3 mt-2  mb-4"
                        onClick={handlePostClick}
                      >
                        <img
                          src="/images/arrow-left.svg"
                          alt="Comments Icon"
                          className="w-[44px] h-[44px]"
                        />
                      </button>
                    </a>

                    {/* Profile */}
                    <div className="flex items-center space-x-2">
                      <div className="relative inline-block drop-shadow-sm">
                        <img
                          src={`https://avatar.iran.liara.run/username?username=${singlePost?.users.username}`}
                          alt="User Avatar"
                          className="rounded-full w-10 h-10 object-cover"
                        />
                        <span className="absolute bottom-0 right-0 block w-3 h-3 bg-green-400 border border-white rounded-full"></span>
                      </div>
                      <p className="text-primary font-medium">
                        {singlePost?.users.username}
                      </p>
                      <p className="text-gray-300  text-[12px] font-normal">
                        {`${formatTimeDifference(
                          singlePost?.created?.toLocaleString()
                        )}`}
                      </p>
                    </div>

                    {/* Community */}
                    <p className="bg-gray-100 text-[#4A4A4A] font-ibm-plex py-1 px-2 rounded-full text-[10px] w-[70px] text-center overflow-hidden whitespace-nowrap text-ellipsis  my-2">
                      {singlePost?.community}
                    </p>
                    {/* Title */}
                    <h1 className="font-bold text-[16px] text-[#101828]">
                      {singlePost?.title}
                    </h1>
                    {/* Description */}
                    <p className="line-clamp-2 text-[#101828] text-[12px]">
                      {singlePost?.description}
                    </p>
                    {/* Comments */}
                    {singlePost?.comments?.length !== 0 && (
                      <div className="flex items-center space-x-1 my-4 text-[14px] text-gray-300">
                        <img
                          src="/images/message-circle.svg"
                          alt="Comments Icon"
                          className="w-[20px] h-[20px]"
                        />
                        <p className="text-gray-500">
                          {`${
                            singlePost?.comments
                              ? singlePost?.comments?.length
                              : 0
                          }`}{" "}
                          Comments
                        </p>
                      </div>
                    )}
                    {!isAddCommentsOpen && (
                      <button
                        className={`hidden lg:flex w-auto bg-white font-ibm-plex text-success border-[1px] border-success text-[14px] font-semibold rounded-lg py-1 px-3 opacity-70 ${
                          singlePost?.comments?.length !== 0 ? "" : "mt-4"
                        }`}
                        onClick={handleToggleComments}
                      >
                        Add Comments
                      </button>
                    )}
                    {/* Add Comments */}
                    {!isAddCommentsOpen && (
                      <button
                        className="w-auto lg:hidden bg-white font-ibm-plex text-success border-[1px] border-success text-[14px] font-semibold rounded-lg py-1 px-3 opacity-70"
                        onClick={openModal}
                      >
                        Add Comments
                      </button>
                    )}

                    <CommentInput
                      isOpen={isAddCommentsOpen}
                      comment={comment}
                      setComment={setComment}
                      onPost={handlePostClick}
                      onCancel={handleToggleComments}
                    />
                    {/* Comments List */}
                    <ul
                      className={`space-y-6 ${
                        isAddCommentsOpen ? "mt-4" : "mt-10"
                      }`}
                    >
                      {singlePost?.comments
                        ?.sort(
                          (a, b) =>
                            new Date(b.created).getTime() -
                            new Date(a.created).getTime()
                        )
                        .map((comment) => (
                          <li key={comment.id}>
                            <div className="flex items-center justify-between space-x-2">
                              <div className="flex items-center space-x-2">
                                <div className="relative inline-block drop-shadow-sm">
                                  <img
                                    src={`https://avatar.iran.liara.run/username?username=${comment?.users.username}`}
                                    alt="User Avatar"
                                    className="rounded-full w-10 h-10 object-cover"
                                  />
                                </div>
                                <p className="text-primary text-[14px] font-medium">
                                  {comment?.users?.username}
                                </p>
                                <p className="text-gray-300 text-[12px] font-medium">
                                  {`${formatTimeDifference(
                                    comment.created.toLocaleString()
                                  )}`}
                                </p>
                              </div>
                              <div
                                className={
                                  user?.id === comment.users.id
                                    ? "flex"
                                    : "hidden"
                                }
                              >
                                <img
                                  src="/images/edit-green.svg"
                                  alt="Close"
                                  className="w-[16px] h-[16px] cursor-pointer ml-2"
                                  onClick={() => handleEdit(comment)}
                                />
                                <img
                                  src="/images/trash-green.svg"
                                  alt="Close"
                                  className="w-[16px] h-[16px] cursor-pointer ml-2"
                                  onClick={() => handleDeleteClick(comment?.id)}
                                />
                              </div>
                            </div>
                            <p className="pl-12 pt-2 font-normal text-[12px] text-primary">
                              {comment?.message}
                            </p>
                          </li>
                        ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <CommentFormModal
        isOpen={isModalOpen}
        onClose={closeModal}
        comment={comment}
        editingComment={editingCommentId || ""}
        setComment={setComment}
        onPost={handlePostClick}
      />
    </>
  );
}
