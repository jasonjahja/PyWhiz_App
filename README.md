# PyWhiz: Virtual Lab for Computational Thinking

## Project Description

PyWhiz is an interactive learning platform designed to help students learn Python programming in a practical and structured way. Utilizing **System Thinking**, **User-Centered Design (UCD)**, and **UI/UX Design**, PyWhiz integrates elements such as learning videos, interactive quizzes, and progress tracking to create a comprehensive learning experience.

## PyWhiz Features

1. **User Authentication**
   - Users can sign up and log in using their email and password via Firebase Authentication.
   - The system generates secure tokens to protect user data.

2. **Access to Learning Videos**
   - Each module is equipped with engaging and structured learning videos categorized by difficulty level (Beginner, Intermediate, Expert).
   - Users can play videos, view descriptions, and track video completion.

3. **Interactive Quizzes**
   - After completing videos in a module, users can take interactive quizzes to assess their understanding.

4. **Progress Tracking**
   - The system tracks the number of videos watched and displays completed modules.
   - User progress is synchronized in real-time with the database.

5. **Profile Updates**
   - Users can easily update their names and profile information.

6. **Responsive Interface**
   - PyWhiz is built using React Native, ensuring support for mobile, tablet, and desktop devices.

## Technologies Used

| Component         | Technology                          |
|-------------------|-------------------------------------|
| **Frontend**      | React Native (TypeScript)          |
| **Backend**       | Firebase (Firestore, Authentication) |
| **App Hosting**   | Expo                               |
| **Website Hosting** | Vercel                           |

## System Architecture

PyWhiz employs a **System Thinking** approach to integrate the following components:

- **Frontend**: Provides a responsive and intuitive user interface.
- **Backend**: Manages business logic, user authentication, and data handling.
- **Database**: Firebase Firestore is used to store user information, quiz results, and learning progress.

## Key Workflows

### 1. User Opens PyWhiz
- The frontend requests module data from the backend.
- The backend processes the request and retrieves data from the database.

### 2. User Completes Learning Modules
- Quiz answers are sent to the backend.
- The backend updates the progress in the database.
- Updated progress is displayed on the frontend.

### 3. User Updates Profile
- Profile data is sent from the frontend to the backend.
- The backend updates the database.
- Confirmation of updates is sent back to the frontend.

## Development

### Implementation Phases

1. **Idea and Concept**
   - Surveys were conducted to understand user needs.
   - Resulted in user workflows and navigation concepts for PyWhiz.

2. **Environment Setup**
   - Development environment was set up using React Native, Firebase, and Expo.

3. **React Native Implementation**
   - Built the frontend for module lists, learning videos, interactive quizzes, and user profiles.
   - Integrated the backend using Firebase Authentication and Firestore.

4. **Testing & Improvements**
   - Comprehensive testing ensured the app operates optimally.
   - Addressed issues with responsiveness, feature validation, and data load times.

5. **Documentation**
   - The development process was documented, including UML diagrams and evaluation results.

## Testing

### Functional Requirements

1. User authentication via Firebase Authentication.
2. Access to a categorized list of learning modules.
3. Video playback within each module.
4. Interactive quizzes with saved scores.
5. Learning progress tracking.
6. User profile updates.

### Non-Functional Requirements

1. Responsiveness across various devices.
2. Data loading times under 3 seconds.
3. User data security.
4. 99.9% application uptime.
5. Intuitive navigation.

## Usage

1. Clone the repository:
   ```bash
   git clone https://github.com/jasonjahja/PyWhiz_App.git
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the application:
   ```bash
   npx expo start
   ```
4. Access the application on your device via
- Expo Go
- Android or iOS emulator

Prepared by:
Jason Jahja (18222116)
Anindita Widya Santoso (18222128)