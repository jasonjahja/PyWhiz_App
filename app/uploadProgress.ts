import { collection, doc, getDoc, getDocs, setDoc } from "firebase/firestore";
import { db } from "../firebase";

// Fungsi untuk mengambil data modul dari Firestore
const getCoursesFromDB = async () => {
  try {
    const coursesCollection = collection(db, "module"); // Pastikan koleksi bernama 'modules'
    const snapshot = await getDocs(coursesCollection);

    const courses: { id: string; totalVideos: number }[] = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      courses.push({
        id: doc.id,
        totalVideos: data.totalVideos,
      });
    });

    console.log("Modules fetched from Firestore:", courses);
    return courses;
  } catch (error) {
    console.error("Error fetching modules from Firestore:", error);
    return [];
  }
};

// Fungsi untuk membuat koleksi user_module_progress jika belum ada
const createUserModuleProgress = async (userId: string) => {
  try {
    const courses = await getCoursesFromDB(); // Ambil data modul dari Firestore

    if (courses.length === 0) {
      console.error("No modules found in Firestore.");
      return;
    }

    console.log(`Creating progress for user: ${userId}`);
    for (const course of courses) {
      const userProgressRef = doc(
        db,
        "user_module_progress",
        `${userId}_${course.id}`
      );
      const userProgressSnap = await getDoc(userProgressRef);

      if (!userProgressSnap.exists()) {
        await setDoc(userProgressRef, {
          userId,
          moduleId: course.id,
          watchedVideos: [], // Tidak ada video yang ditonton pada awalnya
        });
        console.log(
          `Initialized watchedVideos for user "${userId}" in module "${course.id}"`
        );
      } else {
        console.log(
          `Progress for user "${userId}" in module "${course.id}" already exists.`
        );
      }
    }
  } catch (error) {
    console.error("Error creating user_module_progress:", error);
  }
};

// Fungsi utama untuk mengelola pembuatan data awal
export async function initializeUserProgress(userId: string): Promise<void> {
  try {
    // Tambahkan ID pengguna di sini
    console.log(`Initializing progress for user "${userId}"...`);
    await createUserModuleProgress(userId);
    console.log("Initialization complete!");
  } catch (error) {
    console.error("Error initializing user progress:", error);
  }
}

// Jalankan skrip
initializeUserProgress("8hzRnSqWVZXH1zEIvm2Ayrps9442");
