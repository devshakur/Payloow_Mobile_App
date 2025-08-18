import client from "./client";

const getTutorProfile = () => client.get("/v1/tutors/profile");

const registerTutor = (
  firstName: string,
  lastName: string,
  password: string,
  phone: number | string,
  email: string,
  country: string,
  state: string,
  address: string
) =>
  client.post("/elearning/register-tutor", {
    firstName,
    lastName,
    password,
    phone,
    email,
    country,
    state,
    address,
  });

const createTutorProfile = (
  tutorName: string,
  tutorEmail: string,
  tutorPhone: string,
  tutorAbout: string,
  tutorImage: string,
  tutorQualification: string,
  tutorExperience: string,
  tutorAchievements: string,
  tutorFacebook?: string,
  tutorTwitter?: string,
  tutorLinkedIn?: string,
  tutorInstagram?: string
) =>
  client.post("/elearning/create-tutor-profile", {
    tutorName,
    tutorEmail,
    tutorPhone,
    tutorAbout,
    tutorImage,
    tutorQualification,
    tutorExperience,
    tutorAchievements,
    tutorFacebook,
    tutorTwitter,
    tutorLinkedIn,
    tutorInstagram,
  });

const updateTutorProfile = (
  tutorName: string,
  tutorEmail: string,
  tutorPhone: string,
  tutorAbout: string,
  tutorImage: string,
  tutorQualification: string,
  tutorExperience: string,
  tutorAchievements: string,
  tutorFacebook?: string,
  tutorTwitter?: string,
  tutorLinkedIn?: string,
  tutorInstagram?: string
) =>
  client.patch("/elearning/create-tutor-profile", {
    tutorName,
    tutorEmail,
    tutorPhone,
    tutorAbout,
    tutorImage,
    tutorQualification,
    tutorExperience,
    tutorAchievements,
    tutorFacebook,
    tutorTwitter,
    tutorLinkedIn,
    tutorInstagram,
  });

const getCourses = () => client.get("/v1/students/courses");

const getCoursesByTutor = () => client.get("/v1/tutors/courses");

const uploadLesson = (fileName: string, fileType: string, courseId: string) =>
  client.post("/v1/elearning-uploads/courses/intro-video-upload-url", {
    fileName,
    fileType,
    courseId,
  });

const uploadIntro = (fileName: string, fileType: string) =>
  client.post("/v1/elearning-uploads/courses/intro-video-upload-url", {
    fileName,
    fileType,
  });

const uploadToGoogle = (uploadUrl: string, file: Blob, contentType: string) => {
  return client.put(uploadUrl, file, {
    headers: {
      "Content-Type": contentType,
    },
  });
};

const myCourses = () => client.get("/v1/students/my-courses");

const createCourse = (formData: any) =>
  client.post("/v1/tutors/courses", formData);

const updateCourse = (formData: any, courseId: string) =>
  client.patch(`/v1/tutors/courses/${courseId}`, formData);

const createSection = (
  courseId: string,
  title: string,
  description: string,
  lessons: {
    title: string;
    videoUrl: string;
    duration: number;
    order: number;
  }[]
) => {
  return client.post("/v1/tutors/courses/sections", {
    courseId,
    title,
    description,
    lessons,
  });
};

const updateSection = (
  sectionId: string,
  courseId: string,
  title: string,
  description: string,
  lessons: {
    title: string;
    videoUrl: string;
    duration: number;
    order: number;
  }[]
) => {
  return client.patch(`/v1/tutors/courses/sections/${sectionId}`, {
    courseId,
    title,
    description,
    lessons,
  });
};

const getquizzes = (lessonId: string) => {
  return client.get(`/v1/students/lessons/${lessonId}/quizzes`);
};

const getCart = () => client.get("/v1/students/cart");

const removeFromCart = (courseId: string) =>
  client.delete(`/v1/students/courses/${courseId}/cart`);

const addToCart = (courseId: string) =>
  client.post(`/v1/students/courses/${courseId}/cart`);

const enrollFromCart = () => client.post("/v1/students/cart/enroll");

const directEnroll = (courseId: string) =>
  client.post(`/v1/students/courses/${courseId}/enroll`);

const submitQuizAnswers = (
  quizId: string,
  answers: { question_id: string; selected_option: string }[]
) => {
  return client.post(`/v1/quiz/${quizId}/submit`, {
    answers,
  });
};

const addLessonQuiz = (
  title: string,
  course_id: string,
  lesson_id: string,
  questions: {
    question_text: string;
    options: { option: string; is_correct: boolean }[];
  }[]
) => {
  return client.post("/v1/tutors/quiz", {
    title,
    course_id,
    lesson_id,
    questions,
  });
};

const getLessonBytutor = (courseId: string) =>
  client.post(`/v1/students/courses/${courseId}/cart`);

const createAnnouncement = (
  courseId: string,
  title: string,
  description: string
) => {
  return client.post(`/v1/tutors/announcements`, {
    courseId,
    title,
    description,
  });
};

const getAnnouncement = () => {
  return client.get(`/v1/tutors/announcements`, {});
};
const getMessages = (chatId: string) => {
  return client.post(`/v1/e-learning/live-messaging/messages/${chatId}`, {});
};

export default {
  createTutorProfile,
  registerTutor,
  getTutorProfile,
  updateTutorProfile,
  getCourses,
  createCourse,
  createSection,
  getCoursesByTutor,
  myCourses,
  uploadToGoogle,
  uploadIntro,
  uploadLesson,
  updateSection,
  getCart,
  removeFromCart,
  addToCart,
  enrollFromCart,
  directEnroll,
  submitQuizAnswers,
  addLessonQuiz,
  createAnnouncement,
  getLessonBytutor,
  getAnnouncement,
  getMessages,
  updateCourse,
  getquizzes,
};
