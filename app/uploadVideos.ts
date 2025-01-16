import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";

const addVideosToFirestore = async () => {
  const videos_1 = [
    {
      id: 1,
      title: "What is Python?",
      url: "WhatIsPython.mp4",
      description: "This video introduces Python and its features.",
      duration: "4:06",
    },
    {
      id: 2,
      title: "Why Learn Python?",
      url: "WhyLearnPython.mp4",
      description: "This video introduces Python and its features.",
      duration: "2:12",
    },
    {
      id: 3,
      title: "Getting Started with Python",
      url: "GettingStarted.mp4",
      description: "This video introduces Python and its features.",
      duration: "2:47",
    },
    {
      id: 4,
      title: "Python Setup",
      url: "PythonSetup.mp4",
      description: "This video introduces Python and its features.",
      duration: "6:56",
    },
  ];

  const videos_2 = [
    {
      id: 1,
      title: "If Statements are Easy",
      url: "IfStatements.mp4",
      description: "This video introduces Python and its features.",
      duration: "4:06",
    },
    {
      id: 2,
      title: "Contra Flow in Python",
      url: "ContraFlowPython.mp4",
      description: "This video introduces Python and its features.",
      duration: "16:08",
    },
  ];

  const videos_3 = [
    {
      id: 1,
      title: "Loops in Python",
      url: "LoopsPython.mp4",
      description: "This video introduces Python and its features.",
      duration: "14:42",
    },
    {
      id: 2,
      title: "For Loop in Python",
      url: "ForLoop.mp4",
      description: "This video introduces Python and its features.",
      duration: "5:06",
    },
    {
      id: 3,
      title: "While Loop in Python",
      url: "WhileLoop.mp4",
      description: "This video introduces Python and its features.",
      duration: "6:58",
    },
    {
      id: 4,
      title: "For vs While Loop in Python",
      url: "ForVSWhile.mp4",
      description: "This video introduces Python and its features.",
      duration: "8:45",
    },
  ];

  const videos_4 = [
    {
      id: 1,
      title: "Functions in Python",
      url: "FunctionsPython.mp4",
      description: "This video introduces Python and its features.",
      duration: "10:38",
    },
    {
      id: 2,
      title: "Function for Beginner",
      url: "BeginnerFunction.mp4",
      description: "This video introduces Python and its features.",
      duration: "21:47",
    },
    {
      id: 3,
      title: "Define a Function",
      url: "FunctionDefining.mp4",
      description: "This video introduces Python and its features.",
      duration: "2:47",
    },
    {
      id: 4,
      title: "10 Important Functions",
      url: "10Functions.mp4",
      description: "This video introduces Python and its features.",
      duration: "22:16",
    },
  ];

  const videos_5 = [
    {
      id: 1,
      title: "Nested Loop in Python",
      url: "NestedLoop.mp4",
      description: "This video introduces Python and its features.",
      duration: "5:34",
    },
  ];

  const videos_6 = [
    {
      id: 1,
      title: "Data Structure 101",
      url: "DataStructure101.mp4",
      description: "This video introduces Python and its features.",
      duration: "17:06",
    },
    {
      id: 2,
      title: "What are Data Structure",
      url: "DataStructureDesc.mp4",
      description: "This video introduces Python and its features.",
      duration: "5:47",
    },
    {
      id: 3,
      title: "List, Tuples, Set & Direction",
      url: "DataStructuresPython.mp4",
      description: "This video introduces Python and its features.",
      duration: "19:01",
    },
  ];

  const videos_7 = [
    {
      id: 1,
      title: "Sorting Algorithm",
      url: "SortingAlgorithm.mp4",
      description: "This video introduces Python and its features.",
      duration: "4:06",
    },
  ];

  const modules = {
    "1": videos_1,
    "2": videos_2,
    "3": videos_3,
    "4": videos_4,
    "5": videos_5,
    "6": videos_6,
    "7": videos_7,
  };

  // Update Firestore
  try {
    for (const [moduleId, videos] of Object.entries(modules)) {
      const moduleRef = doc(db, "module", moduleId); // Replace "module" with your Firestore collection name
      await updateDoc(moduleRef, { videos });
      console.log(`Videos for module ${moduleId} added successfully.`);
    }
  } catch (error) {
    console.error("Error adding videos to Firestore:", error);
  }
};

addVideosToFirestore();
