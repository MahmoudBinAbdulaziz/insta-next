"use client";
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { signIn, useSession, signOut } from "next-auth/react";
import { IoMdAddCircleOutline } from "react-icons/io";
import { AiOutlineClose } from "react-icons/ai";
import { HiCamera } from "react-icons/hi";
import Modal from "react-modal";
import { db } from "@/app/api/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
function Header() {
  const { data: session } = useSession();
  const filePickerRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const [caption, setCaption] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const addImageToPost = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);

      // Convert file to base64 for Imgur upload
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setImageFileUrl(reader.result); // This will be used for the Imgur API
      };
    }
  };

  const handleUpload = async () => {
    if (!imageFileUrl) return;

    try {
      setUploading(true);
      const response = await fetch("/api/uploadToImgur", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageData: imageFileUrl }),
      });
      setUploading(false);
      // console.log(response);
      const data = await response.json();
      const post = {
        username: session.user.username,
        profileImg: session.user.image,
        timestamp: serverTimestamp(),
        img: data.imageUrl,
        caption: caption,
      };
      await addDoc(collection(db, "posts"), post);
      setCaption("");
      setSelectedFile(null);
      setImageFileUrl(null);
      setIsOpen(false);
      // console.log(post);
    } catch (error) {
      setUploading(false);
    }
  };

  return (
    <header className="shadow-sm border-b sticky top-0 bg-white z-30 p-3">
      <div className="flex justify-between items-center max-w-6xl mx-auto">
        <Link href={"/"}>
          <Image
            className="lg:hidden"
            src="/logo.webp"
            width={40}
            height={40}
            alt="insta logo"
          />
          <Image
            className="hidden lg:inline-flex"
            src="/logo_black.webp"
            width={96}
            height={96}
            alt="insta logo"
          />
        </Link>
        <input
          type="text"
          placeholder="Search"
          className="bg-gray-50 border border-gray-200 rounded text-sm w-full py-2 px-4 max-w-[210px]"
        />
        {session ? (
          <div className="flex gap-2 items-center">
            <IoMdAddCircleOutline
              className="text-2xl cursor-pointer tranform hover:scale-125 transition duration-300 hover:text-red-600"
              onClick={() => setIsOpen(true)}
            />
            <img
              src={session.user.image}
              alt={session.user.name}
              className="h-10 w-10 rounded-full cursor-pointer"
              onClick={signOut}
            />
          </div>
        ) : (
          <button
            onClick={() => signIn()}
            className="text-sm font-semibold text-blue-500"
          >
            Log In
          </button>
        )}
      </div>
      {isOpen && (
        <Modal
          isOpen={isOpen}
          className="max-w-lg w-[90%] p-6 absolute top-56 left-[50%] translate-x-[-50%] bg-white border-2 rounded-md shadow-md"
          onRequestClose={() => setIsOpen(false)}
          ariaHideApp={false}
        >
          <AiOutlineClose
            className="cursor-pointer absolute top-2 right-2 hover:text-red-600 transition duration-300"
            onClick={() => setIsOpen(false)}
          />
          <div className="flex flex-col justify-center items-center h-[100%]">
            {selectedFile ? (
              <img
                onClick={() => setSelectedFile(null)}
                src={imageFileUrl}
                alt="selected file"
                className={`w-full max-h-[250px] object-over cursor-pointer ${
                  uploading ? "animate-pulse" : ""
                }`}
              />
            ) : (
              <HiCamera
                onClick={() => filePickerRef.current.click()}
                className="text-5xl text-gray-400 cursor-pointer"
              />
            )}
            <input
              hidden
              ref={filePickerRef}
              type="file"
              accept="image/*"
              onChange={addImageToPost}
            />
          </div>
          <input
            type="text"
            maxLength="150"
            placeholder="Please enter your caption..."
            className="m-4 border-none text-center w-full focus:ring-0 outline-none"
            onChange={(e) => setCaption(e.target.value)}
          />
          <button
            onClick={handleUpload}
            disabled={!selectedFile || caption.trim() === ""}
            className="w-full bg-red-600 text-white p-2 shadow-md rounded-lg hover:brightness-105 disabled:bg-gray-200 disabled:cursor-not-allowed disabled:hover:brightness-100"
          >
            Upload Post
          </button>
        </Modal>
      )}
    </header>
  );
}

export default Header;
