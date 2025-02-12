import React, { useEffect, useState } from "react";
import { postData, putData } from "../services/PostApi";
import { toast } from "react-toastify";
import Spinner from "./Spinner";

const Form = ({ data, setData, setUpdateData, updateData }) => {
  const [addData, setAddData] = useState({ title: "", body: "" });
  const [loadingState, setLoadingState] = useState({
    isLoading: false,
    message: "",
  });

  let isEmpty = Object.keys(updateData).length === 0;

  //   get updatedData and set into input field
  useEffect(() => {
    updateData &&
      setAddData({
        title: updateData.title || "",
        body: updateData.body || "",
      });
  }, [updateData]);

  const handleInputChange = (e) => {
    setAddData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  //   adding data
  const addPostData = async () => {
    setLoadingState({ isLoading: true, message: "Adding Post..." });
    try {
      const res = await postData(addData);
      if (res.status === 201 || res.status === 200) {
        setData([...data, res.data]);
        toast.success("Post added successfully", {
          position: "bottom-center",
          autoClose: 1500,
          pauseOnHover: false,
        });
        setAddData({ title: "", body: "" });
      } else {
        throw new Error("Unexpected response from server");
      }
    } catch (error) {
      toast.error(`Failed to adding post: ${error}`, {
        position: "bottom-center",
        autoClose: 6000,
        pauseOnHover: false,
      });
    } finally {
      setLoadingState({ isLoading: false, message: "" });
    }
  };

  // Updating data
  const updatePostData = async () => {
    setLoadingState({ isLoading: true, message: "Updating Post..." });
    try {
      const res = await putData(updateData?.id, addData);
      if (res.status === 200) {
        setData((prevData) =>
          prevData.map((item) =>
            item.id === updateData.id ? { ...item, ...res.data } : item
          )
        );
        toast.success("Post updated successfully", {
          position: "bottom-center",
          autoClose: 1500,
          pauseOnHover: false,
        });
        setAddData({ title: "", body: "" });
        setUpdateData({});
      } else {
        throw new Error("Unexpected response from server");
      }
    } catch (error) {
      toast.error(`Failed to update post: ${error}`, {
        position: "bottom-center",
        autoClose: 6000,
        pauseOnHover: false,
      });
    } finally {
      setLoadingState({ isLoading: false, message: "" });
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const action = e.nativeEvent.submitter.value;

    if (!addData.title.trim() || !addData.body.trim()) {
      toast.error("Title and Post cannot be empty", {
        position: "bottom-center",
        autoClose: 2000,
      });
      return;
    }

    if (action === "Add") {
      addPostData();
    } else if (action === "Edit") {
      updatePostData();
    }
  };

  return (
    <>
      <form onSubmit={handleFormSubmit}>
        <div>
          <label htmlFor="title"></label>
          <input
            type="text"
            name="title"
            id="title"
            autoComplete="off"
            placeholder="Add Title"
            value={addData.title}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label htmlFor="body"></label>
          <input
            type="text"
            name="body"
            id="body"
            autoComplete="off"
            placeholder="Add Post"
            value={addData.body}
            onChange={handleInputChange}
          />
        </div>
        <button
          type="submit"
          value={isEmpty ? "Add" : "Edit"}
          disabled={loadingState.isLoading}
        >
          {isEmpty ? "Add" : "Edit"}
        </button>
      </form>
      {loadingState.isLoading && <Spinner text={loadingState.message} />}
    </>
  );
};

export default Form;
