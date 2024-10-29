"use client";
import LeftSidebar from "@/components/LeftSidebar";
import Navbar from "@/components/Navbar";
import Dropdown from "@/components/Dropdown";
import { useState, useEffect, useRef } from "react";
import { usePosts } from "@/hooks/usePosts";
import { useAuth } from "@/hooks/useAuth";
import { Post } from "@/types/post";
import { Community } from "@/types/post";
import PostFormModal from "@/components/PostFormModal";
import DeletePostModal from "@/components/DeletePostModal";

export default function HomePage() {
  const {
    posts,
    setIsMyPosts,
    createPost,
    deletePost,
    updatePost,
    loading,
    error,
  } = usePosts();
  const { user } = useAuth();

  const [isLeftMenuOpen, setIsLeftMenuOpen] = useState(true);
  const [isInputVisible, setIsInputVisible] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isDeletePostOpen, setIsDeletePostOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [postTitle, setPostTitle] = useState("");
  const [postDescription, setPostDescription] = useState("");
  const [filterCommunity, setFilterCommunity] = useState<string>("Community");
  const [postCommunity, setPostCommunity] = useState<string>("Community");
  const [currentPost, setCurrentPost] = useState<Post | null>(null);
  const [currentDelete, setCurrentDelete] = useState<string | null>(null);
  const [errorMessages, setErrorMessages] = useState({
    title: "",
    description: "",
    community: "",
  });
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (inputRef.current && !inputRef.current.contains(event.target as Node)) {
      setIsLeftMenuOpen(true);
      setIsInputVisible(false);
    }
  };

  useEffect(() => {
    setIsMyPosts(true);
  }, [setIsMyPosts]);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const filteredPosts = posts
    ?.filter((post) => {
      const matchesCommunity =
        filterCommunity === "Community" || post.community === filterCommunity;
      const matchesSearch =
        post.title.toLowerCase().includes(searchValue.toLowerCase()) ||
        post.description.toLowerCase().includes(searchValue.toLowerCase());
      return matchesCommunity && matchesSearch;
    })
    .sort((a, b) => {
      return new Date(b.created).getTime() - new Date(a.created).getTime(); // Sort by created date in ascending order
    });

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
  };

  const handleSearchClick = () => {
    setIsInputVisible(true);
    setIsLeftMenuOpen(false);
  };
  const handleOpenDeleteModal = (id: string) => {
    setIsDeletePostOpen(true);
    setCurrentDelete(id);
  };

  const openModal = () => {
    setCurrentPost(null);
    setPostTitle("");
    setPostDescription("");
    setPostCommunity("Community");
    setErrorMessages({ title: "", description: "", community: "" }); // Reset error messages
    setIsOpen(true);
  };

  const handlePostSubmit = async () => {
    const newErrorMessages = { title: "", description: "", community: "" };
    let hasError = false;

    if (!postTitle.trim()) {
      newErrorMessages.title = "Title cannot be empty.";
      hasError = true;
    }

    if (!postDescription.trim()) {
      newErrorMessages.description = "Description cannot be empty.";
      hasError = true;
    }

    if (postCommunity === "Community") {
      newErrorMessages.community = "Please select a community.";
      hasError = true;
    }

    setErrorMessages(newErrorMessages);

    if (hasError) return;

    if (currentPost) {
      await updatePost(currentPost.id, {
        title: postTitle,
        description: postDescription,
        community: Community[postCommunity as keyof typeof Community],
        userId: user?.id || "",
      });
    } else {
      await createPost({
        title: postTitle,
        description: postDescription,
        community: Community[postCommunity as keyof typeof Community],
        userId: user?.id || "",
      });
    }
    setIsMyPosts(true);
    setIsOpen(false);
    setPostTitle("");
    setPostDescription("");
    setPostCommunity("Community");
  };

  const handleEditPost = (post: Post) => {
    setCurrentPost(post);
    setPostTitle(post.title);
    setPostDescription(post.description);
    setPostCommunity(post.community);
    setErrorMessages({ title: "", description: "", community: "" });
    setIsOpen(true);
  };

  const handleDeletePost = () => {
    if (currentDelete) {
      deletePost(currentDelete);
      setIsMyPosts(true);
    }
    setIsDeletePostOpen(false);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPostTitle(e.target.value);
    if (errorMessages.title)
      setErrorMessages((prev) => ({ ...prev, title: "" })); // Clear error on change
  };

  const handleDescriptionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setPostDescription(e.target.value);
    if (errorMessages.description)
      setErrorMessages((prev) => ({ ...prev, description: "" })); // Clear error on change
  };

  const handleCommunitySelect = (community: string) => {
    setPostCommunity(community);
    if (errorMessages.community)
      setErrorMessages((prev) => ({ ...prev, community: "" })); // Clear error on select
  };

  if (loading)
    return (
      <div className="flex items-center justify-center w-full h-screen">
        <div className="loader"></div>
      </div>
    );
  if (error) return <p>{error}</p>;

  return (
    <>
      <Navbar rightSidebarIndex={"blogs"} />
      <main className="w-full flex flex-col bg-gray-100 pt-[60px] lg:pl-[280px]  min-h-screen">
        <div className="flex w-full justify-center lg:justify-start ">
          <LeftSidebar index={"blogs"} />
          <div className="flex flex-col w-full lg:w-[75%] items-center">
            <div className="flex w-full px-4 lg:px-8 py-4 justify-between  ">
              {isInputVisible ? (
                <div className="relative w-full flex items-center">
                  <input
                    ref={inputRef}
                    type="text"
                    value={searchValue}
                    onChange={handleSearchChange}
                    className="w-full bg-gray-100 font-ibm-plex rounded-lg py-2 pl-11 placeholder:text-secondary placeholder:text-[16px] placeholder:font-ibm-plex outline-none border-2 border-white"
                    placeholder="Search"
                  />
                  <img
                    src="/images/search.svg"
                    alt="Close"
                    className="w-[24px] h-[24px] absolute mx-3 cursor-pointer"
                    onClick={() => {
                      setSearchValue(""); // Clear search input on close
                      setIsInputVisible(false);
                    }}
                  />
                </div>
              ) : (
                <button
                  className="bg-success lg:hidden font-ibm-plex text-white text-[14px] font-semibold rounded-lg items-center px-4 py-2 shadow-sm"
                  onClick={handleSearchClick}
                >
                  Search
                </button>
              )}

              <div className="hidden lg:flex w-full relative items-center mr-4">
                <input
                  type="text"
                  value={searchValue}
                  onChange={handleSearchChange}
                  className="w-full bg-gray-100 font-ibm-plex rounded-lg py-2 pl-11 placeholder:text-secondary placeholder:text-[16px] placeholder:font-ibm-plex outline-none border-2 border-white"
                  placeholder="Search"
                />
                <img
                  src="/images/search.svg"
                  alt="Close"
                  className="w-[24px] h-[24px] absolute mx-3 cursor-pointer"
                  onClick={() => setSearchValue("")} // Clear search input on close
                />
              </div>

              {isLeftMenuOpen && (
                <div className="flex">
                  <Dropdown
                    selected={filterCommunity}
                    onSelect={setFilterCommunity} // Use separate state for filtering
                  />
                  <button
                    className="bg-success font-ibm-plex text-white text-[14px] font-semibold rounded-lg items-center w-24 py-2 shadow-sm"
                    onClick={openModal}
                  >
                    Create +
                  </button>
                </div>
              )}
            </div>

            <div className="flex flex-col w-full px-4 lg:px-8">
              <div className="bg-white rounded-[24px] pb-10 mb-10">
                {filteredPosts.length > 0 ? (
                  <>
                    {" "}
                    {filteredPosts?.map((post) => (
                      <div key={post.id} className="p-4 border-b">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <img
                              src={`https://avatar.iran.liara.run/username?username=${post.users.username}`}
                              alt="User Avatar"
                              className="rounded-full w-10 h-10 object-cover"
                            />

                            <p className="text-gray-300 text-[14px] font-medium">
                              {post.users.username}
                            </p>
                          </div>

                          <div
                            className={
                              user?.id === post.users.id ? "flex" : "hidden"
                            }
                          >
                            <img
                              src="/images/edit-green.svg"
                              alt="Close"
                              className="w-[16px] h-[16px] cursor-pointer ml-2"
                              onClick={() => handleEditPost(post)}
                            />
                            <img
                              src="/images/trash-green.svg"
                              alt="Close"
                              className="w-[16px] h-[16px] cursor-pointer ml-2"
                              onClick={() => handleOpenDeleteModal(post.id)}
                            />
                          </div>
                        </div>
                        <a href={`/post/${post.id}`}>
                          <p className="bg-gray-100 text-[#4A4A4A] font-ibm-plex py-1 px-2 rounded-full text-[10px] w-[70px] text-center overflow-hidden whitespace-nowrap text-ellipsis  my-2">
                            {post.community}
                          </p>
                          <h1 className="font-bold text-[16px] text-[#101828]">
                            {post.title}
                          </h1>
                          <p className="line-clamp-2 text-[#101828] text-[12px]">
                            {post.description}
                          </p>
                          <div className="flex space-x-1 mt-2 text-[14px]">
                            <img
                              src="/images/message-circle.svg"
                              alt="Comments Icon"
                              className="w-[20px] h-[20px]"
                            />
                            <p className="text-gray-500 text-[12px]">
                              {post.comments.length} Comments
                            </p>
                          </div>
                        </a>
                      </div>
                    ))}
                  </>
                ) : (
                  <div className="flex font-castoro italic  text-center items-center justify-center min-h-40 font-normal text-[20px]">
                    Couldn't find your post.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      {/* Create/Edit post modal */}
      <PostFormModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        currentPost={null}
        postTitle={postTitle}
        postDescription={postDescription}
        postCommunity={postCommunity}
        errorMessages={errorMessages}
        handleTitleChange={handleSearchChange}
        handleDescriptionChange={handleDescriptionChange}
        handleCommunitySelect={handleCommunitySelect}
        handlePostSubmit={handlePostSubmit}
      />

      {/* Delete post modal */}
      <DeletePostModal
        isOpen={isDeletePostOpen}
        onClose={() => setIsDeletePostOpen(false)}
        onDelete={handleDeletePost}
      />
    </>
  );
}
