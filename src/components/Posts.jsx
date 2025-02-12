import React, { useEffect, useState } from "react";
import { deletePost, getPost } from "../services/PostApi";
import { toast, ToastContainer } from "react-toastify";
import Spinner from "./Spinner";
import Form from "./Form";

const Posts = () => {
  const [data, setData] = useState([]);
  const [updateData, setUpdateData] = useState({});
  const [loadingState, setLoadingState] = useState({
    isLoading: false,
    message: "",
  });

  // Fetch posts
  const getPostData = async () => {
    setLoadingState({ isLoading: true, message: "Loading Posts..." });
    try {
      const res = await getPost();
      setData(res?.data || []);
    } catch (error) {
      toast.error(`Error fetching posts: ${error}`, {
        position: "bottom-center",
        autoClose: 6000,
        pauseOnHover: false,
      });
    } finally {
      setLoadingState({ isLoading: false, message: "" });
    }
  };

  useEffect(() => {
    getPostData();
  }, []);

  // Delete post
  const handleDeletePost = async (id) => {
    if (confirm("Are you sure you want to delete this post?")) {
      setLoadingState({ isLoading: true, message: "Deleting Post..." });
      try {
        const res = await deletePost(id);
        if (res.status === 200) {
          setData((prevData) =>
            prevData.filter((curPost) => curPost?.id !== id)
          );
          toast.success("Post deleted successfully", {
            position: "bottom-center",
            autoClose: 1500,
            pauseOnHover: false,
          });
        }
      } catch (error) {
        toast.error(`Failed to deleting post: ${error}`, {
          position: "bottom-center",
          autoClose: 6000,
          pauseOnHover: false,
        });
      } finally {
        setLoadingState({ isLoading: false, message: "" });
      }
    }
  };

  // update post
  const handleUpdatePost = (curEle) => {
    setUpdateData(curEle);
  };

  return (
    <>
      <div className="section-form">
        <Form
          data={data}
          setData={setData}
          updateData={updateData}
          setUpdateData={setUpdateData}
        />
      </div>
      {loadingState.isLoading ? (
        <Spinner text={loadingState.message} />
      ) : (
        <div className="section-post">
          {data.length === 0 ? (
            <p className="no-post">No posts available</p>
          ) : (
            <ol>
              {data.map((curEle) => (
                <li key={curEle?.id}>
                  <div>
                    <p className="clamp-title">
                      <b>Title:</b> {curEle?.title}
                    </p>
                    <p className="clamp-body">
                      <b>Body:</b> {curEle?.body}
                    </p>
                  </div>
                  <div className="btn_container flex gap-2">
                    <button onClick={() => handleUpdatePost(curEle)}>
                      Edit
                    </button>
                    <button
                      className="btn-delete flex items-center justify-center"
                      onClick={() => handleDeletePost(curEle?.id)}
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ol>
          )}
        </div>
      )}
      <ToastContainer />
    </>
  );
};

export default Posts;
