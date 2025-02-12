import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
});

// get method
export const getPost = () => {
  return api.get("/posts");
};

// delete method
export const deletePost = (id) => {
  return api.delete(`/posts/${id}`);
};

//Post method
export const postData = (post) => {
  return api.post("/posts", post);
};

// put method
export const putData = (id, post) => {
  return api.put(`/posts/${id}`, post);
};
