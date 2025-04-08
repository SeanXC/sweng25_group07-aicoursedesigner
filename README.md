# AI Course Designer

### Your AI-powered assistant for building personalized language learning journeys

**AI Course Designer** is a full-stack web application that helps users create customized, AI-generated course plans based on their input, learning style, and goals. The platform combines the power of AWS Lambda, React, and Node.js to deliver an adaptive and interactive language learning experience.

## Features

1. **Flash Card Review** – Reinforce memory through AI-generated flash cards that support active recall and spaced repetition.
2. **Chatbot Interaction** – Engage in natural conversations with an AI chatbot to define learning goals and receive personalized feedback.
3. **Roleplay Conversations** – Simulate real-life scenarios to enhance contextual and conversational understanding.
4. **Question Generation** – Get comprehension questions auto-generated based on recent dialogues or content.
5. **Course Outline Suggestions** – Receive a custom-tailored learning journey built around your goals and preferences.
6. **Adaptive Week Planning** – The system dynamically adjusts course duration based on the number and difficulty of learning targets.

---

## Deployment

### 🌍 Try it now: [group7reactdemo.s3-website-eu-west-1.amazonaws.com](http://group7reactdemo.s3-website-eu-west-1.amazonaws.com/)

### 🔧 1. Live Deployment Details

- **Frontend** hosted on S3:  
  [http://group7reactdemo.s3-website-eu-west-1.amazonaws.com/](http://group7reactdemo.s3-website-eu-west-1.amazonaws.com/)
- **Backend** deployed via AWS Lambda and exposed using API Gateway.

🎥 **Demo Video:**  
[Watch on Google Drive](https://drive.google.com/file/d/1NEHvgArzDEscEg_cQBMgbmM5ldTAntgD/view?usp=sharing)

---

### 💻 2. Running Locally

#### Prerequisites

- [Node.js and npm](https://nodejs.org/) must be installed

---

#### 🚀 Frontend Setup

1. Navigate to the frontend directory:

    ```bash
    cd frontend
    ```

2. Install dependencies:

    ```bash
    npm install
    ```

3. Start the development server:

    ```bash
    npm run start
    ```

4. Open your browser at:

    ```
    http://localhost:3000/
    ```

---

#### 🛠️ Backend Setup

1. Navigate to the backend source directory:

    ```bash
    cd backend/src
    ```

2. Install dependencies:

    ```bash
    npm install
    ```

3. Run the backend:

    ```bash
    node app.mjs
    ```

---
