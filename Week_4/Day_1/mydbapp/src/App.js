import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar/navbar";

import Post from "./components/post";
import Comments from "./components/comments";
import Users from "./components/users";
import HomePage from "./components/Homepage/HomePage";
import Albums from "./components/albums";
import Photos from "./components/photos";
import Todos from "./components/todos";
import Cars from "./components/cars";
import Bikes from "./components/bikes";

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<HomePage/>} />
        <Route path="/posts" element={<Post />} />
        <Route path="/comments" element={<Comments />} />
        <Route path="/albums" element={<Albums/>} />
        <Route path="/photos" element={<Photos/>} />
        <Route path="/todos" element={<Todos/>} />
        <Route path="/users" element={<Users />} />
        <Route path="/cars" element={<Cars/>} />
        <Route path="/bikes" element={<Bikes/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
