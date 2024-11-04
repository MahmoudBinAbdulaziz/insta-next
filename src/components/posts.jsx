"use client";
import {
  collection,
  onSnapshot,
  getDocs,
  orderBy,
  query,
} from "firebase/firestore";
import { db } from "@/app/api/firebase";
import Post from "./post";
import { useEffect, useState } from "react";

export default function Posts() {
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    onSnapshot(
      query(collection(db, "posts"), orderBy("timestamp", "desc")),
      (snapShot) => {
        setPosts(
          snapShot.docs.map((e) => {
            return { id: e.id, ...e.data() };
          })
        );
      }
    );
  }, [db]);
  return (
    <div>
      {posts.map((post) => (
        <Post key={post.id} post={post} />
      ))}
    </div>
  );
}
