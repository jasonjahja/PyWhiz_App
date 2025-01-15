import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";

const addVideosToFirestore = async () => {
  const videos_1 = [
    {
      id: 1,
      title: "What is Python?",
      url: "WhatIsPython.mp4",
      description: "This video introduces Python and its features.",
      duration: "2:30",
    },
    {
      id: 2,
      title: "Why Learn Python?",
      url: "WhyLearnPython.mp4",
      description: "This video introduces Python and its features.",
      duration: "2:30",
    },
    {
      id: 3,
      title: "Getting Started with Python",
      url: "GettingStarted.mp4",
      description: "This video introduces Python and its features.",
      duration: "2:30",
    },
    {
      id: 4,
      title: "Python Setup",
      url: "PythonSetup.mp4",
      description: "This video introduces Python and its features.",
      duration: "2:30",
    },
  ];

  const videos = videos_1;

  const moduleId = "1"; // Replace with the actual module ID

  try {
    const moduleRef = doc(db, "module", moduleId);
    await updateDoc(moduleRef, { videos });
    console.log("Videos added successfully");
  } catch (error) {
    console.error("Error adding videos to Firestore:", error);
  }
};

addVideosToFirestore();
