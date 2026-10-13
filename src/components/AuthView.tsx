"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useLearning } from "@/context/LearningContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  Brain,
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  Phone,
  Calendar as CalendarIcon,
  BookOpen,
  Compass,
  Smile,
  ShieldCheck,
  Check,
  ChevronRight,
  ChevronLeft,
  Upload,
  RefreshCw,
  Award,
  Sparkles,
  Smartphone,
  CheckCircle,
  HelpCircle,
  Volume2,
  Bell,
  HardDrive,
  Sun,
  Moon
} from "lucide-react";

// Types for Registration Wizard
type AuthViewType = "login" | "register" | "forgot_password";

interface StepIndicatorProps {
  currentStep: number;
  stepsCount: number;
  stepNames: string[];
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep, stepsCount, stepNames }) => {
  return (
    <div className="w-full mb-8">
      {/* Visual Progress Bar */}
      <div className="flex items-center justify-between relative mb-2">
        <div className="absolute left-0 right-0 top-1/2 h-1 bg-zinc-800 -translate-y-1/2 z-0 rounded-full" />
        <div 
          className="absolute left-0 top-1/2 h-1 bg-gradient-to-r from-primary to-secondary -translate-y-1/2 z-0 rounded-full transition-all duration-500" 
          style={{ width: `${((currentStep - 1) / (stepsCount - 1)) * 100}%` }}
        />
        {[...Array(stepsCount)].map((_, idx) => {
          const stepNum = idx + 1;
          const isActive = currentStep >= stepNum;
          const isCurrent = currentStep === stepNum;
          return (
            <div 
              key={idx} 
              className={`relative z-10 flex items-center justify-center w-8 h-8 rounded-full border transition-all duration-500 text-xs font-bold ${
                isCurrent 
                  ? "bg-zinc-950 border-primary text-primary shadow-[0_0_10px_rgba(139,92,246,0.5)]" 
                  : isActive
                  ? "bg-primary border-primary text-white" 
                  : "bg-zinc-900 border-zinc-800 text-zinc-500"
              }`}
            >
              {isActive && currentStep > stepNum ? <Check className="w-4 h-4" /> : stepNum}
            </div>
          );
        })}
      </div>
      {/* Label Subtitles */}
      <div className="flex justify-between text-[10px] text-zinc-500 font-bold uppercase tracking-wider px-1">
        {stepNames.map((name, idx) => (
          <span 
            key={idx} 
            className={`transition-colors duration-300 ${currentStep === idx + 1 ? "text-primary font-extrabold" : ""}`}
          >
            {name}
          </span>
        ))}
      </div>
    </div>
  );
};

export default function AuthView() {
  const router = useRouter();
  const { theme, toggleTheme, login, loginWithOtp, register } = useLearning();

  // Root screen state
  const [view, setView] = useState<AuthViewType>("login");
  const [isOtpLogin, setIsOtpLogin] = useState(false);

  // Forms state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [captchaPassed, setCaptchaPassed] = useState(false);

  // CAPTCHA Slider state
  const [sliderPos, setSliderPos] = useState(0);
  const [isDraggingSlider, setIsDraggingSlider] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);

  // Rate limiting lockout state
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockoutTimer, setLockoutTimer] = useState(0);

  // Forgot password states
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotStep, setForgotStep] = useState(1); // 1: input email, 2: verify code, 3: new password
  const [forgotCode, setForgotCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [forgotTimer, setForgotTimer] = useState(0);

  // Registration data state
  const [regStep, setRegStep] = useState(1);
  const [regData, setRegData] = useState({
    // Step 1: Personal
    photo: "" as string,
    name: "",
    displayName: "",
    bio: "",
    dob: "",
    gender: "Prefer not to say",
    mobile: "",
    email: "",
    preferredLanguage: "English",
    password: "",
    confirmPassword: "",
    
    // Step 3: Academic
    academicInfo: {
      country: "India",
      state: "",
      schoolName: "",
      course: "",
      department: "",
      yearOfStudy: "1st Year",
      studentId: "",
      timezone: typeof window !== "undefined" ? Intl.DateTimeFormat().resolvedOptions().timeZone : "Asia/Kolkata"
    },

    // Step 4: Learning Profile
    learningProfile: {
      goal: "School Learning",
      preferredSubjects: [] as string[],
      favoriteSubject: "",
      weakSubject: "",
      skillLevel: "Beginner",
      learningStyle: "Interactive Learning",
      preferredStudyTime: "Evening",
      dailyStudyDuration: "1–2 Hours",
      weeklyLearningGoal: "10 Hours"
    },

    // Step 5: Career
    careerPreferences: {
      dreamCareer: "",
      targetExams: [] as string[],
      interests: "",
      shortTermGoal: "",
      longTermGoal: ""
    },

    // Step 6: Personalization
    personalization: {
      avatarId: "chronos",
      voiceLearning: false,
      dailyReminders: true,
      offlineNotes: true,
      emailNotifications: true,
      pushNotifications: true,
      assignmentReminders: true,
      revisionAlerts: true,
      examCountdown: true,
      achievementsNotifications: true,
      weeklyProgress: true,
      smartBreak: true,
      fontSize: "normal",
      highContrast: false,
      voiceAssistance: false,
      textToSpeech: false
    }
  });

  // Step 2 Registration OTP code verification
  const [regEmailOtp, setRegEmailOtp] = useState(["", "", "", "", "", ""]);
  const [regMobileOtp, setRegMobileOtp] = useState(["", "", "", "", "", ""]);
  const [regOtpTimer, setRegOtpTimer] = useState(60);
  const [regOtpSent, setRegOtpSent] = useState(false);
  const [otpVerifySuccess, setOtpVerifySuccess] = useState(false);
  const [otpToastMessage, setOtpToastMessage] = useState("");

  // Step 7 Adaptive Quiz assessment states
  const [assessmentScore, setAssessmentScore] = useState(0);
  const [assessmentIndex, setAssessmentIndex] = useState(0);
  const [selectedAssessmentOption, setSelectedAssessmentOption] = useState<number | null>(null);
  const [assessmentComplete, setAssessmentComplete] = useState(false);

  // Custom Alert Toast system
  const [toastMessage, setToastMessage] = useState("");
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage("");
    }, 5000);
  };

  // Lockout tick effect
  useEffect(() => {
    if (lockoutTimer > 0) {
      const interval = setInterval(() => {
        setLockoutTimer(prev => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [lockoutTimer]);

  // Forgot password timer tick
  useEffect(() => {
    if (forgotTimer > 0) {
      const interval = setInterval(() => {
        setForgotTimer(prev => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [forgotTimer]);

  // Registration OTP Timer countdown
  useEffect(() => {
    if (regStep === 2 && regOtpTimer > 0 && !otpVerifySuccess) {
      const interval = setInterval(() => {
        setRegOtpTimer(prev => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [regStep, regOtpTimer, otpVerifySuccess]);

  // Trigger Registration OTP alert when entering step 2
  useEffect(() => {
    if (regStep === 2 && !regOtpSent) {
      // Generate a mock code
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      localStorage.setItem(`otp_${regData.email}`, code);
      setRegOtpSent(true);
      setRegOtpTimer(60);
      setOtpToastMessage(`IRIS Registration: Verification code sent to ${regData.email}. Use code ${code}`);
      setTimeout(() => setOtpToastMessage(""), 8000);
    }
  }, [regStep, regData.email, regOtpSent]);

  // Trusted Devices Auto-Login check
  useEffect(() => {
    if (typeof window !== "undefined") {
      const trusted = localStorage.getItem("iris_trusted_devices") || "[]";
      const trustedArr = JSON.parse(trusted);
      const currentDev = navigator.userAgent.split(")")[0] + ")";
      
      const savedSession = localStorage.getItem("iris_session");
      if (!savedSession && trustedArr.includes(currentDev)) {
        // Find user with this trusted device signature and remembered active session
        const usersStr = localStorage.getItem("iris_users") || "[]";
        const users = JSON.parse(usersStr);
        const user = users.find((u: any) => u.loginActivity?.some((l: any) => l.device === currentDev && l.trusted));
        if (user) {
          showToast(`Welcome back! Auto-login on trusted device initialized...`);
          setTimeout(() => {
            const sessionObj = {
              user,
              expiresAt: new Date().getTime() + 30 * 24 * 60 * 60 * 1000 // 30 days
            };
            localStorage.setItem("iris_session", JSON.stringify(sessionObj));
            window.location.reload();
          }, 1000);
        }
      }
    }
  }, []);

  // Profile Completion Percentage calculator
  const getProfileCompletion = () => {
    let fields = [
      regData.name,
      regData.displayName,
      regData.bio,
      regData.dob,
      regData.mobile,
      regData.email,
      regData.password,
      regData.academicInfo.schoolName,
      regData.academicInfo.course,
      regData.academicInfo.department,
      regData.learningProfile.goal,
      regData.learningProfile.favoriteSubject,
      regData.learningProfile.weakSubject,
      regData.careerPreferences.dreamCareer,
      regData.careerPreferences.shortTermGoal,
      regData.careerPreferences.longTermGoal
    ];
    let filled = fields.filter(Boolean).length;
    if (regData.learningProfile.preferredSubjects.length > 0) filled++;
    if (regData.photo) filled++;
    
    // Total fields tracked is 18
    const percentage = Math.round((filled / 18) * 100);
    return Math.min(100, percentage);
  };

  // Captcha Drag slider functionality
  const handleSliderMouseDown = () => {
    setIsDraggingSlider(true);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingSlider || !sliderRef.current) return;
      const rect = sliderRef.current.getBoundingClientRect();
      const pos = Math.min(Math.max(0, e.clientX - rect.left - 20), rect.width - 40);
      setSliderPos(pos);
      
      // Check if dragged to at least 92% of the width
      if (pos >= rect.width - 45) {
        setCaptchaPassed(true);
        setIsDraggingSlider(false);
      }
    };

    const handleMouseUp = () => {
      if (isDraggingSlider) {
        setIsDraggingSlider(false);
        if (!captchaPassed) {
          setSliderPos(0); // Snap back
        }
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDraggingSlider, captchaPassed]);

  // Password Strength Estimator
  const getPasswordStrength = (pass: string) => {
    if (!pass) return { score: 0, label: "None", color: "bg-zinc-800" };
    let score = 0;
    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;

    if (score <= 1) return { score, label: "Weak", color: "bg-red-500" };
    if (score <= 3) return { score, label: "Fair", color: "bg-amber-500" };
    return { score, label: "Strong", color: "bg-success" };
  };

  // Login handler
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (lockoutTimer > 0) {
      setErrorMessage(`Too many failed attempts. Try again in ${lockoutTimer}s.`);
      return;
    }
    if (!email || !password) {
      setErrorMessage("Please complete all required fields.");
      return;
    }
    if (!captchaPassed) {
      setErrorMessage("Please complete the slide verification puzzle.");
      return;
    }

    setLoading(true);
    setErrorMessage("");

    // Simulate database lookup latency
    setTimeout(async () => {
      const res = await login(email, password, rememberMe);
      setLoading(false);
      if (res.success) {
        // If Admin user, redirect to Admin panel
        const usersStr = localStorage.getItem("iris_users") || "[]";
        const users = JSON.parse(usersStr);
        const user = users.find((u: any) => u.email.toLowerCase() === email.toLowerCase());
        if (email.toLowerCase() === "admin@iris.edu" || user?.role === "ADMIN") {
          router.push("/admin/dashboard");
        }
      } else {
        const nextFailed = failedAttempts + 1;
        setFailedAttempts(nextFailed);
        if (nextFailed >= 5) {
          setLockoutTimer(30);
          setFailedAttempts(0);
          setErrorMessage("Too many failed attempts. Login locked for 30s.");
        } else {
          setErrorMessage(`${res.error} (${5 - nextFailed} attempts remaining)`);
        }
        setCaptchaPassed(false);
        setSliderPos(0);
      }
    }, 1500);
  };

  // OTP Login trigger and login submission
  const handleRequestLoginOtp = () => {
    if (!email) {
      setErrorMessage("Please enter your email first.");
      return;
    }
    const code = "123456";
    localStorage.setItem(`otp_${email}`, code);
    setOtpToastMessage(`IRIS Security: Your OTP code for Login is ${code}`);
    showToast("OTP code has been generated and sent.");
  };

  const handleOtpLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMessage("Please enter your email and 6-digit OTP code.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      const success = loginWithOtp(email, password); // OTP code is treated as "password" in input
      setLoading(false);
      if (!success) {
        setErrorMessage("Invalid OTP code. Try code 123456.");
      }
    }, 1500);
  };

  // Google / Microsoft OAuth simulator popups
  const handleOAuthLogin = (provider: "Google" | "Microsoft") => {
    const width = 500;
    const height = 600;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;
    
    showToast(`Opening secure connection with ${provider}...`);
    
    // Simulate a secure callback by writing a dummy account to database if not present and logging in
    setTimeout(async () => {
      // Mock account setup
      const mockEmail = `demo.${provider.toLowerCase()}@iris.edu`;
      const usersStr = localStorage.getItem("iris_users") || "[]";
      const users = JSON.parse(usersStr);
      let user = users.find((u: any) => u.email.toLowerCase() === mockEmail.toLowerCase());
      
      if (!user) {
        // Register mock user
        user = {
          email: mockEmail,
          name: `Jane Doe (${provider})`,
          passwordHash: "oauth-token-validated",
          createdAt: new Date().toISOString(),
          learningProfile: {
            goal: "Placement Preparation",
            preferredSubjects: ["Mathematics", "Programming"],
            skillLevel: "Intermediate",
            learningStyle: "Interactive Learning",
            preferredStudyTime: "Evening",
            dailyStudyDuration: "2–4 Hours"
          }
        };
        users.push(user);
        localStorage.setItem("iris_users", JSON.stringify(users));
      }
      
      // Auto Login
      await login(mockEmail, "dummy-pass-unused", true);
      // Mock bypass since we don't have real hashes matching
      localStorage.setItem("iris_session", JSON.stringify({
        user,
        expiresAt: new Date().getTime() + 2 * 60 * 60 * 1000
      }));
      window.location.reload();
    }, 2000);
  };

  // Forgot password flow handlers
  const handleForgotRequestOtp = () => {
    if (!forgotEmail) {
      showToast("Please enter an email address.");
      return;
    }
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    localStorage.setItem(`otp_${forgotEmail}`, code);
    setForgotTimer(60);
    setOtpToastMessage(`IRIS Recovery: Password reset code is ${code}`);
    setForgotStep(2);
  };

  const handleForgotVerifyOtp = () => {
    const savedOtp = localStorage.getItem(`otp_${forgotEmail}`);
    if (forgotCode === "123456" || forgotCode === savedOtp) {
      setForgotStep(3);
    } else {
      showToast("Invalid code. Use the code shown in the notification.");
    }
  };

  const handleForgotResetPassword = async () => {
    if (newPassword.length < 8) {
      showToast("Password must be at least 8 characters.");
      return;
    }
    if (newPassword !== confirmNewPassword) {
      showToast("Passwords do not match.");
      return;
    }
    // Update password in database
    const usersStr = localStorage.getItem("iris_users") || "[]";
    const users = JSON.parse(usersStr);
    const userIndex = users.findIndex((u: any) => u.email.toLowerCase() === forgotEmail.toLowerCase());
    
    if (userIndex === -1) {
      showToast("Account not found. Please register first.");
      return;
    }
    
    // Hash new password using Web Crypto-equivalent mock or custom function inside context. Let's just create hash
    setLoading(true);
    // Simple mock hash matching client-side
    const encoder = new TextEncoder();
    const data = encoder.encode(newPassword);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const passHash = hashArray.map(b => b.toString(16).padStart(2, "0")).join("");

    users[userIndex].passwordHash = passHash;
    localStorage.setItem("iris_users", JSON.stringify(users));
    
    setLoading(false);
    showToast("Password reset successfully! Please log in.");
    setView("login");
    setForgotStep(1);
    setForgotEmail("");
  };

  // Registration step validations
  const validateRegStep1 = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const mobileRegex = /^[0-9]{10}$/;
    
    if (!regData.name || !regData.displayName || !regData.dob || !regData.mobile || !regData.email || !regData.password) {
      showToast("All fields are required.");
      return false;
    }
    if (!emailRegex.test(regData.email)) {
      showToast("Please enter a valid email format.");
      return false;
    }
    if (!mobileRegex.test(regData.mobile)) {
      showToast("Mobile number must be exactly 10 digits.");
      return false;
    }
    const strength = getPasswordStrength(regData.password);
    if (strength.score < 3) {
      showToast("Please choose a stronger password (needs min 8 chars, uppercase, digits).");
      return false;
    }
    if (regData.password !== regData.confirmPassword) {
      showToast("Password confirmation does not match.");
      return false;
    }
    
    // Check if user email is already registered
    const usersStr = localStorage.getItem("iris_users") || "[]";
    const users = JSON.parse(usersStr);
    const exists = users.some((u: any) => u.email.toLowerCase() === regData.email.toLowerCase());
    if (exists) {
      showToast("An account with this email already exists.");
      return false;
    }

    return true;
  };

  // Step 2 validation (OTP digits)
  const handleRegOtpSubmit = () => {
    const code = regEmailOtp.join("");
    const savedOtp = localStorage.getItem(`otp_${regData.email}`);
    
    if (code === "123456" || code === savedOtp) {
      setOtpVerifySuccess(true);
      showToast("Email address successfully verified!");
      setTimeout(() => {
        setRegStep(3);
      }, 1000);
    } else {
      showToast("Invalid verification code. Please check the system alert notification.");
    }
  };

  // Profile image upload simulation
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setRegData(prev => ({ ...prev, photo: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Step 7 adaptive assessment questions database
  // Questions are selected depending on preferred subjects (Mathematics, Science, Programming, Literature, Career, General)
  const questionPool = [
    {
      subject: "Mathematics",
      question: "What is the limit of (sin x) / x as x approaches 0?",
      options: ["Infinity", "0", "1", "Does not exist"],
      correct: 2,
      explanation: "Using L'Hopital's rule or basic trigonometric limits, the limit of sin(x)/x is 1."
    },
    {
      subject: "Science",
      question: "Which Newton's law states that for every action, there is an equal and opposite reaction?",
      options: ["First Law", "Second Law", "Third Law", "Universal Law of Gravitation"],
      correct: 2,
      explanation: "Newton's Third Law states action and reaction forces are equal and opposite."
    },
    {
      subject: "Programming",
      question: "What is the worst-case time complexity of searching in a balanced Binary Search Tree (BST)?",
      options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
      correct: 1,
      explanation: "For a balanced BST, the depth is log(n), meaning searching takes log(n) in the worst case."
    },
    {
      subject: "Literature",
      question: "Which of the following is a key theme of Shakespeare's 'Hamlet'?",
      options: ["Love and Romance", "Decisiveness", "Action vs. Inaction and Revenge", "Utopian Society"],
      correct: 2,
      explanation: "Hamlet explores critical themes of existential delay, revenge, and ethical inaction."
    },
    {
      subject: "AI & ML",
      question: "What is the purpose of an activation function in a neural network layer?",
      options: ["Normalize dataset", "Introduce non-linearity", "Calculate gradient descent", "Perform matrix transposition"],
      correct: 1,
      explanation: "Activation functions introduce non-linear mapping capabilities to learn complicated boundaries."
    },
    {
      subject: "Data Science",
      question: "Which metric is best suited to evaluate classification models on highly imbalanced data?",
      options: ["Accuracy", "Mean Absolute Error", "F1-Score / Precision-Recall AUC", "R-squared"],
      correct: 2,
      explanation: "F1-Score balances precision and recall, whereas accuracy can be misleading in imbalanced datasets."
    }
  ];

  // Pick questions based on preferences
  const getAssessmentQuestions = () => {
    const selected = regData.learningProfile.preferredSubjects;
    let questions = questionPool.filter(q => selected.includes(q.subject));
    
    // Fallback if not enough subjects selected
    if (questions.length < 3) {
      const remaining = questionPool.filter(q => !questions.includes(q));
      questions = [...questions, ...remaining].slice(0, 4);
    }
    return questions.slice(0, 5); // Return 4 or 5 adaptive questions
  };

  const currentQuestions = getAssessmentQuestions();

  const handleAssessmentAnswerSubmit = () => {
    if (selectedAssessmentOption === null) return;
    
    const isCorrect = selectedAssessmentOption === currentQuestions[assessmentIndex].correct;
    if (isCorrect) {
      setAssessmentScore(prev => prev + 1);
    }

    if (assessmentIndex < currentQuestions.length - 1) {
      setAssessmentIndex(prev => prev + 1);
      setSelectedAssessmentOption(null);
    } else {
      setAssessmentComplete(true);
    }
  };

  const handleRegistrationComplete = async () => {
    setLoading(true);
    
    // Calculate final scores and generate Learning DNA Profile parameters
    const totalQ = currentQuestions.length;
    const scorePct = Math.round((assessmentScore / totalQ) * 100);
    
    // Initial DNA calculations
    const speed = 65 + Math.round(assessmentScore * 7);
    const retention = 60 + Math.round(assessmentScore * 8);
    const consistency = 80;
    
    let strengths = ["Inquisitive Thinker"];
    let weaknesses = ["Spaced Review Decays"];
    
    // Subjects selected mapping
    if (regData.learningProfile.preferredSubjects.includes("Mathematics")) {
      strengths.push("Quantitative Logic");
    }
    if (regData.learningProfile.preferredSubjects.includes("Programming")) {
      strengths.push("Algorithmic Coding");
    }
    if (regData.learningProfile.preferredSubjects.includes("Science")) {
      strengths.push("Scientific Reasoning");
    }

    const finalDnaStats = {
      score: 70 + (assessmentScore * 5),
      stats: {
        learningSpeed: speed,
        retentionRate: retention,
        focusDuration: 40,
        consistency,
        goalCompletion: 70,
        motivation: 75
      },
      strengths,
      weaknesses
    };

    const finalRegPayload = {
      ...regData,
      initialDnaStats: finalDnaStats
    };

    setTimeout(async () => {
      const res = await register(finalRegPayload);
      setLoading(false);
      if (res.success) {
        // Success welcome messages handled by local states redirecting to dashboard
      } else {
        showToast("Registration failed. Please check inputs.");
      }
    }, 2000);
  };

  // Helper for input steps OTP digit moving focus
  const handleOtpInput = (val: string, index: number, isEmail: boolean) => {
    if (val.length > 1) val = val[0];
    const newOtp = isEmail ? [...regEmailOtp] : [...regMobileOtp];
    newOtp[index] = val;
    
    if (isEmail) setRegEmailOtp(newOtp);
    else setRegMobileOtp(newOtp);

    // Auto-focus next field
    if (val && index < 5) {
      const nextInput = document.getElementById(`${isEmail ? "email" : "mobile"}-otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  // Multi-select for subjects helper
  const toggleSubject = (subj: string) => {
    const current = regData.learningProfile.preferredSubjects;
    if (current.includes(subj)) {
      setRegData(prev => ({
        ...prev,
        learningProfile: {
          ...prev.learningProfile,
          preferredSubjects: current.filter(s => s !== subj)
        }
      }));
    } else {
      setRegData(prev => ({
        ...prev,
        learningProfile: {
          ...prev.learningProfile,
          preferredSubjects: [...current, subj]
        }
      }));
    }
  };

  // Select list helpers
  const setGoal = (goal: string) => {
    setRegData(prev => ({ ...prev, learningProfile: { ...prev.learningProfile, goal } }));
  };

  const setSkillLevel = (skillLevel: string) => {
    setRegData(prev => ({ ...prev, learningProfile: { ...prev.learningProfile, skillLevel } }));
  };

  const setLearningStyle = (learningStyle: string) => {
    setRegData(prev => ({ ...prev, learningProfile: { ...prev.learningProfile, learningStyle } }));
  };

  const setStudyTime = (preferredStudyTime: string) => {
    setRegData(prev => ({ ...prev, learningProfile: { ...prev.learningProfile, preferredStudyTime } }));
  };

  const setStudyDuration = (dailyStudyDuration: string) => {
    setRegData(prev => ({ ...prev, learningProfile: { ...prev.learningProfile, dailyStudyDuration } }));
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center bg-background text-foreground py-12 px-4 sm:px-6 lg:px-8 overflow-hidden font-sans transition-colors duration-300">
      
      {/* Top right Theme Toggler */}
      <div className="absolute top-6 right-6 z-30">
        <button
          type="button"
          onClick={toggleTheme}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-zinc-900/80 border border-zinc-800 text-xs font-semibold text-zinc-300 hover:text-white transition-all shadow-md cursor-pointer backdrop-blur"
          title={`Switch to ${theme === "dark" ? "Light" : "Dark"} Mode`}
        >
          {theme === "dark" ? (
            <>
              <Sun className="w-4 h-4 text-amber-400" />
              <span>Light Mode</span>
            </>
          ) : (
            <>
              <Moon className="w-4 h-4 text-indigo-500" />
              <span>Dark Mode</span>
            </>
          )}
        </button>
      </div>

      {/* Background Neon Blobs */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[120px] animate-pulse-slow" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-secondary/10 rounded-full blur-[120px] animate-pulse-slow" />
      </div>

      {/* Styled OTP Banner Notification */}
      <AnimatePresence>
        {otpToastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-md bg-zinc-950 border border-primary text-zinc-100 p-4 rounded-2xl shadow-[0_0_20px_rgba(139,92,246,0.3)] flex items-start gap-3"
          >
            <Brain className="w-5 h-5 text-primary shrink-0 mt-0.5 animate-pulse" />
            <div className="flex-1">
              <h4 className="text-xs font-black text-primary uppercase tracking-wider">IRIS SECURITY NOTIFICATION</h4>
              <p className="text-xs text-zinc-350 mt-1 font-mono select-all">{otpToastMessage}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* General custom toast alerts */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="fixed bottom-6 right-6 z-50 bg-zinc-900 border border-zinc-800 text-zinc-200 px-4 py-3 rounded-xl text-xs font-semibold shadow-lg"
          >
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="w-full max-w-4xl z-10">
        
        {/* IRIS Logo Header */}
        <div className="flex flex-col items-center justify-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-primary to-secondary flex items-center justify-center shadow-[0_0_20px_rgba(139,92,246,0.4)] animate-float">
            <Brain className="w-7 h-7 text-white animate-pulse-slow" />
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white mt-4 uppercase">
            IRIS <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">AI</span>
          </h1>
          <p className="text-[10px] text-zinc-500 font-extrabold uppercase tracking-widest mt-1">
            Study OS Authentication Gate
          </p>
        </div>

        <motion.div 
          layout
          className="w-full rounded-3xl glass-panel border border-zinc-800/60 p-8 sm:p-10 shadow-2xl relative overflow-hidden transition-all duration-300"
        >
          {loading && (
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm z-50 flex flex-col items-center justify-center">
              <RefreshCw className="w-10 h-10 text-primary animate-spin mb-4" />
              <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest animate-pulse">Syncing Learning Profile...</span>
            </div>
          )}

          {/* VIEW: LOGIN SCREEN */}
          {view === "login" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
              
              {/* Left Column Welcome Info */}
              <div className="space-y-4 pr-0 md:pr-4">
                <span className="text-[10px] font-extrabold bg-primary/20 text-primary border border-primary/30 px-3 py-1 rounded-full uppercase tracking-wider">
                  IRIS OS v1.0
                </span>
                <h2 className="text-2xl font-black text-white leading-tight">
                  Welcome to the Ecosystem of Intelligent Responsive Study.
                </h2>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Sign in to load your study paths, sync cognitive states with the tutor nodes, and track active revisions.
                </p>
                <div className="space-y-2 pt-2">
                  <div className="flex items-center gap-2 text-xs text-zinc-400">
                    <CheckCircle className="w-4 h-4 text-secondary shrink-0" />
                    <span>Adaptive Spaced Recall Bank</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-zinc-400">
                    <CheckCircle className="w-4 h-4 text-secondary shrink-0" />
                    <span>6 Customized AI Mentor Tutors</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-zinc-400">
                    <CheckCircle className="w-4 h-4 text-secondary shrink-0" />
                    <span>Personalized Learning Profile</span>
                  </div>
                </div>
              </div>

              {/* Right Column Form */}
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-zinc-900 pb-2">
                  <h3 className="text-md font-extrabold uppercase text-zinc-200">
                    {isOtpLogin ? "OTP Gateway" : "Secure Login"}
                  </h3>
                  <button 
                    onClick={() => {
                      setIsOtpLogin(!isOtpLogin);
                      setErrorMessage("");
                    }}
                    className="text-[10px] font-bold text-primary hover:underline uppercase"
                  >
                    {isOtpLogin ? "Use Password" : "Login via OTP"}
                  </button>
                </div>

                {errorMessage && (
                  <div className="p-3.5 bg-error/10 border border-error/20 text-error rounded-xl text-xs font-semibold leading-relaxed">
                    {errorMessage}
                  </div>
                )}

                <form onSubmit={isOtpLogin ? handleOtpLoginSubmit : handleLoginSubmit} className="space-y-4">
                  {/* Email Input */}
                  <div>
                    <label className="text-[9px] text-zinc-500 font-extrabold uppercase tracking-widest">Email Address</label>
                    <div className="relative mt-1">
                      <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-zinc-500" />
                      <input 
                        type="email" 
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="john.doe@university.edu"
                        className="w-full pl-10 pr-4 py-3 rounded-2xl glass-input text-xs text-white"
                      />
                    </div>
                  </div>

                  {/* Password / OTP Input */}
                  <div>
                    <div className="flex justify-between items-center">
                      <label className="text-[9px] text-zinc-500 font-extrabold uppercase tracking-widest">
                        {isOtpLogin ? "Enter 6-Digit OTP Code" : "Security Password"}
                      </label>
                      {isOtpLogin && (
                        <button 
                          type="button" 
                          onClick={handleRequestLoginOtp}
                          className="text-[9px] text-secondary font-bold uppercase hover:underline"
                        >
                          Request Code
                        </button>
                      )}
                    </div>
                    
                    <div className="relative mt-1">
                      <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-zinc-500" />
                      <input 
                        type={showPassword || isOtpLogin ? "text" : "password"} 
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder={isOtpLogin ? "e.g. 123456" : "••••••••••••"}
                        className="w-full pl-10 pr-10 py-3 rounded-2xl glass-input text-xs text-white"
                      />
                      {!isOtpLogin && (
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-3.5 text-zinc-500 hover:text-zinc-300"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Remember Me and Forgot Password links */}
                  <div className="flex items-center justify-between pt-1">
                    <label className="flex items-center gap-2 text-xs text-zinc-400 font-medium cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="rounded border-zinc-800 bg-zinc-950 text-primary focus:ring-primary w-3.5 h-3.5"
                      />
                      Remember me
                    </label>
                    <button 
                      type="button" 
                      onClick={() => {
                        setView("forgot_password");
                        setForgotStep(1);
                      }}
                      className="text-xs font-bold text-zinc-400 hover:text-primary transition-colors"
                    >
                      Forgot password?
                    </button>
                  </div>

                  {/* CAPTCHA Slide Puzzle Gate */}
                  {!captchaPassed ? (
                    <div className="pt-2">
                      <label className="text-[9px] text-zinc-500 font-extrabold uppercase tracking-widest block mb-1">Slide CAPTCHA Gateway</label>
                      <div 
                        ref={sliderRef}
                        className="h-11 bg-zinc-950 border border-zinc-850 rounded-2xl relative overflow-hidden flex items-center justify-center"
                      >
                        <span className="text-[10px] font-bold text-zinc-650 uppercase tracking-widest select-none">Slide to unlock form</span>
                        <div 
                          className="absolute left-0 top-0 bottom-0 bg-primary/20 transition-all pointer-events-none"
                          style={{ width: `${sliderPos + 40}px` }}
                        />
                        <div 
                          onMouseDown={handleSliderMouseDown}
                          className="absolute w-10 h-9 bg-primary hover:bg-primary/95 text-white flex items-center justify-center rounded-xl cursor-grab active:cursor-grabbing shadow-[0_0_10px_rgba(139,92,246,0.3)] transition-colors"
                          style={{ left: `${sliderPos}px`, top: "3px" }}
                        >
                          <ChevronRight className="w-5 h-5" />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="p-2.5 bg-success/10 border border-success/20 rounded-2xl flex items-center gap-2.5 text-xs text-success font-semibold">
                      <Check className="w-4.5 h-4.5 text-success" />
                      <span>Security Validation Passed. Gate unlocked.</span>
                    </div>
                  )}

                  {/* Login buttons */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={lockoutTimer > 0 || (isOtpLogin ? !email || !password : !email || !password) || !captchaPassed}
                      className="w-full bg-gradient-to-r from-primary to-secondary disabled:from-zinc-900 disabled:to-zinc-900 text-white disabled:text-zinc-600 font-bold text-xs uppercase py-3.5 rounded-2xl shadow-xl hover:opacity-95 transition-all cursor-pointer text-center"
                    >
                      {lockoutTimer > 0 ? `Locked Out (${lockoutTimer}s)` : "Load IRIS Dashboard"}
                    </button>
                  </div>
                </form>

                {/* Social logins */}
                <div className="space-y-3 pt-3 border-t border-zinc-900">
                  <div className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest text-center">Or load identity via SSO</div>
                  <div className="grid grid-cols-2 gap-3">
                    <button 
                      onClick={() => handleOAuthLogin("Google")}
                      className="flex items-center justify-center gap-2.5 px-3 py-2.5 rounded-xl border border-zinc-800 bg-zinc-950/40 hover:border-zinc-700 transition-all text-xs font-semibold text-zinc-300 hover:text-white cursor-pointer"
                    >
                      <span className="text-sm">🌐</span> Google
                    </button>
                    <button 
                      onClick={() => handleOAuthLogin("Microsoft")}
                      className="flex items-center justify-center gap-2.5 px-3 py-2.5 rounded-xl border border-zinc-800 bg-zinc-950/40 hover:border-zinc-700 transition-all text-xs font-semibold text-zinc-300 hover:text-white cursor-pointer"
                    >
                      <span className="text-sm">💼</span> Microsoft
                    </button>
                  </div>
                </div>

                <div className="text-center pt-2">
                  <span className="text-xs text-zinc-500">Don't have an account? </span>
                  <button 
                    onClick={() => {
                      setView("register");
                      setRegStep(1);
                    }}
                    className="text-xs font-bold text-primary hover:underline uppercase"
                  >
                    Register
                  </button>
                </div>

              </div>

            </div>
          )}

          {/* VIEW: FORGOT PASSWORD */}
          {view === "forgot_password" && (
            <div className="max-w-md mx-auto space-y-6">
              <div className="border-b border-zinc-900 pb-2 flex items-center justify-between">
                <h3 className="text-md font-extrabold uppercase text-zinc-200">Reset Gateway</h3>
                <button onClick={() => setView("login")} className="text-xs font-bold text-zinc-500 hover:text-zinc-300">Back</button>
              </div>

              {/* Forgot password step 1 */}
              {forgotStep === 1 && (
                <div className="space-y-4">
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Enter the email associated with your IRIS profile. We will push a 6-digit verification code to reset your account.
                  </p>
                  <div>
                    <label className="text-[9px] text-zinc-500 font-extrabold uppercase tracking-widest">Email Address</label>
                    <input 
                      type="email" 
                      required
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      placeholder="e.g. user@gmail.com"
                      className="w-full px-4 py-3 rounded-2xl glass-input text-xs text-white mt-1"
                    />
                  </div>
                  <button 
                    onClick={handleForgotRequestOtp}
                    className="w-full bg-primary hover:bg-primary/95 text-white font-bold text-xs uppercase py-3 rounded-2xl transition-all cursor-pointer text-center"
                  >
                    Request Verification Code
                  </button>
                </div>
              )}

              {/* Forgot password step 2 */}
              {forgotStep === 2 && (
                <div className="space-y-4">
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    A recovery code was triggered. Enter the 6-digit code shown in the IRIS alert banner.
                  </p>
                  <div>
                    <label className="text-[9px] text-zinc-500 font-extrabold uppercase tracking-widest">Verification Code</label>
                    <input 
                      type="text" 
                      maxLength={6}
                      value={forgotCode}
                      onChange={(e) => setForgotCode(e.target.value)}
                      placeholder="Enter 6-digit code"
                      className="w-full text-center tracking-widest px-4 py-3 rounded-2xl glass-input text-sm text-white font-mono mt-1"
                    />
                  </div>
                  <button 
                    onClick={handleForgotVerifyOtp}
                    className="w-full bg-primary hover:bg-primary/95 text-white font-bold text-xs uppercase py-3 rounded-2xl transition-all cursor-pointer text-center"
                  >
                    Verify Code
                  </button>
                </div>
              )}

              {/* Forgot password step 3 */}
              {forgotStep === 3 && (
                <div className="space-y-4">
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Define a strong, secure password for your account.
                  </p>
                  <div>
                    <label className="text-[9px] text-zinc-500 font-extrabold uppercase tracking-widest">New Password</label>
                    <input 
                      type="password" 
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Min 8 characters"
                      className="w-full px-4 py-3 rounded-2xl glass-input text-xs text-white mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] text-zinc-500 font-extrabold uppercase tracking-widest">Confirm Password</label>
                    <input 
                      type="password" 
                      value={confirmNewPassword}
                      onChange={(e) => setConfirmNewPassword(e.target.value)}
                      placeholder="Confirm security password"
                      className="w-full px-4 py-3 rounded-2xl glass-input text-xs text-white mt-1"
                    />
                  </div>
                  <button 
                    onClick={handleForgotResetPassword}
                    className="w-full bg-gradient-to-r from-primary to-secondary text-white font-bold text-xs uppercase py-3.5 rounded-2xl transition-all cursor-pointer text-center"
                  >
                    Apply New Password
                  </button>
                </div>
              )}
            </div>
          )}

          {/* VIEW: REGISTER MULTI-STEP WIZARD */}
          {view === "register" && (
            <div className="space-y-6">
              
              {/* Header Step Counter */}
              <div className="flex items-center justify-between border-b border-zinc-900 pb-3">
                <div>
                  <span className="text-[10px] text-primary font-black uppercase tracking-wider">Registration Wizard</span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <h3 className="text-md font-extrabold text-white">Step {regStep} of 7</h3>
                    <span className="text-[9px] bg-primary/20 text-primary border border-primary/30 px-2 py-0.5 rounded-full font-bold">
                      Completion: {getProfileCompletion()}%
                    </span>
                  </div>
                </div>
                <button 
                  onClick={() => {
                    if (confirm("Are you sure you want to cancel registration?")) {
                      setView("login");
                    }
                  }}
                  className="text-xs text-zinc-500 hover:text-zinc-300"
                >
                  Cancel
                </button>
              </div>

              {/* Steps Indicator Progress line */}
              <StepIndicator 
                currentStep={regStep} 
                stepsCount={7} 
                stepNames={["Personal", "Verify", "Academic", "Profile", "Career", "Preferences", "Assessment"]} 
              />

              <div className="min-h-[280px]">
                {/* STEP 1: Personal Information */}
                {regStep === 1 && (
                  <div className="space-y-5">
                    
                    {/* Optional Photo Upload */}
                    <div className="flex flex-col sm:flex-row items-center gap-5 bg-zinc-950/20 p-4 rounded-3xl border border-zinc-900">
                      <div className="relative w-20 h-20 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center overflow-hidden shrink-0">
                        {regData.photo ? (
                          <img src={regData.photo} alt="Avatar Preview" className="w-full h-full object-cover" />
                        ) : (
                          <User className="w-8 h-8 text-zinc-600" />
                        )}
                      </div>
                      <div className="text-center sm:text-left space-y-1.5">
                        <h4 className="text-xs font-bold text-zinc-200">Upload Profile avatar (Optional)</h4>
                        <p className="text-[10px] text-zinc-500">Supports PNG, JPG up to 2MB. Image is processed locally.</p>
                        <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-zinc-800 bg-zinc-950/40 hover:border-zinc-700 transition-all text-[10px] font-bold text-zinc-300 cursor-pointer">
                          <Upload className="w-3.5 h-3.5" /> Upload File
                          <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
                        </label>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Name */}
                      <div>
                        <label className="text-[9px] text-zinc-500 font-extrabold uppercase tracking-widest">Full Name</label>
                        <input 
                          type="text" 
                          required
                          value={regData.name}
                          onChange={(e) => setRegData(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="Jane Doe"
                          className="w-full px-4 py-3 rounded-2xl glass-input text-xs text-white mt-1"
                        />
                      </div>

                      {/* Display Name / Nickname */}
                      <div>
                        <label className="text-[9px] text-zinc-500 font-extrabold uppercase tracking-widest">Display Name / Nickname</label>
                        <input 
                          type="text" 
                          required
                          value={regData.displayName}
                          onChange={(e) => setRegData(prev => ({ ...prev, displayName: e.target.value }))}
                          placeholder="e.g. Jane"
                          className="w-full px-4 py-3 rounded-2xl glass-input text-xs text-white mt-1"
                        />
                      </div>

                      {/* DOB */}
                      <div>
                        <label className="text-[9px] text-zinc-500 font-extrabold uppercase tracking-widest">Date of Birth</label>
                        <input 
                          type="date" 
                          required
                          value={regData.dob}
                          onChange={(e) => setRegData(prev => ({ ...prev, dob: e.target.value }))}
                          className="w-full px-4 py-3 rounded-2xl glass-input text-xs text-white mt-1 bg-zinc-950"
                        />
                      </div>

                      {/* Gender */}
                      <div>
                        <label className="text-[9px] text-zinc-500 font-extrabold uppercase tracking-widest">Gender</label>
                        <select
                          value={regData.gender}
                          onChange={(e) => setRegData(prev => ({ ...prev, gender: e.target.value }))}
                          className="w-full px-4 py-3 rounded-2xl glass-input text-xs text-white mt-1 bg-zinc-950"
                        >
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Non-binary">Non-binary</option>
                          <option value="Prefer not to say">Prefer not to say</option>
                        </select>
                      </div>

                      {/* Mobile */}
                      <div>
                        <label className="text-[9px] text-zinc-500 font-extrabold uppercase tracking-widest">Mobile Number</label>
                        <input 
                          type="text" 
                          required
                          maxLength={10}
                          value={regData.mobile}
                          onChange={(e) => setRegData(prev => ({ ...prev, mobile: e.target.value }))}
                          placeholder="10-digit mobile"
                          className="w-full px-4 py-3 rounded-2xl glass-input text-xs text-white mt-1"
                        />
                      </div>

                      {/* Preferred Language */}
                      <div>
                        <label className="text-[9px] text-zinc-500 font-extrabold uppercase tracking-widest">Preferred Language</label>
                        <select
                          value={regData.preferredLanguage}
                          onChange={(e) => setRegData(prev => ({ ...prev, preferredLanguage: e.target.value }))}
                          className="w-full px-4 py-3 rounded-2xl glass-input text-xs text-white mt-1 bg-zinc-950"
                        >
                          <option value="English">English</option>
                          <option value="Spanish">Spanish</option>
                          <option value="Hindi">Hindi</option>
                          <option value="French">French</option>
                          <option value="German">German</option>
                        </select>
                      </div>

                      {/* Bio */}
                      <div className="md:col-span-2">
                        <label className="text-[9px] text-zinc-500 font-extrabold uppercase tracking-widest">Short Bio (Optional)</label>
                        <textarea 
                          rows={2}
                          value={regData.bio}
                          onChange={(e) => setRegData(prev => ({ ...prev, bio: e.target.value }))}
                          placeholder="Tell us about yourself..."
                          className="w-full px-4 py-2.5 rounded-2xl glass-input text-xs text-white mt-1 resize-none font-sans"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Email */}
                      <div>
                        <label className="text-[9px] text-zinc-500 font-extrabold uppercase tracking-widest">Email Address</label>
                        <input 
                          type="email" 
                          required
                          value={regData.email}
                          onChange={(e) => setRegData(prev => ({ ...prev, email: e.target.value }))}
                          placeholder="e.g. user@gmail.com"
                          className="w-full px-4 py-3 rounded-2xl glass-input text-xs text-white mt-1"
                        />
                      </div>

                      {/* Password */}
                      <div>
                        <label className="text-[9px] text-zinc-500 font-extrabold uppercase tracking-widest">Password</label>
                        <input 
                          type="password" 
                          required
                          value={regData.password}
                          onChange={(e) => setRegData(prev => ({ ...prev, password: e.target.value }))}
                          placeholder="Choose strong password"
                          className="w-full px-4 py-3 rounded-2xl glass-input text-xs text-white mt-1"
                        />
                        {/* Strength Indicator */}
                        {regData.password && (() => {
                          const str = getPasswordStrength(regData.password);
                          return (
                            <div className="mt-2 space-y-1">
                              <div className="flex justify-between text-[8px] font-bold uppercase">
                                <span className="text-zinc-500">Security strength:</span>
                                <span className={str.score >= 3 ? "text-success" : "text-amber-500"}>{str.label}</span>
                              </div>
                              <div className="w-full h-1 bg-zinc-900 rounded-full overflow-hidden">
                                <div className={`h-full ${str.color} transition-all`} style={{ width: `${(str.score / 4) * 100}%` }} />
                              </div>
                            </div>
                          );
                        })()}
                      </div>

                      {/* Confirm Password */}
                      <div>
                        <label className="text-[9px] text-zinc-500 font-extrabold uppercase tracking-widest">Confirm Password</label>
                        <input 
                          type="password" 
                          required
                          value={regData.confirmPassword}
                          onChange={(e) => setRegData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                          placeholder="Confirm security password"
                          className="w-full px-4 py-3 rounded-2xl glass-input text-xs text-white mt-1"
                        />
                        {regData.password && regData.confirmPassword && regData.password !== regData.confirmPassword && (
                          <p className="text-[9px] text-error font-bold mt-1">Passwords do not match.</p>
                        )}
                      </div>
                    </div>

                  </div>
                )}

                {/* STEP 2: OTP Verification */}
                {regStep === 2 && (
                  <div className="space-y-6 max-w-md mx-auto">
                    <p className="text-xs text-zinc-400 leading-relaxed text-center">
                      Security policy requires verifying your communication lines. We pushed a verification token to <span className="text-white font-bold">{regData.email}</span>.
                    </p>

                    {/* Email Verification Box */}
                    <div className="space-y-3 p-5 rounded-3xl bg-zinc-950/40 border border-zinc-900">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-zinc-500 font-extrabold uppercase tracking-wider flex items-center gap-1">
                          <Mail className="w-3.5 h-3.5 text-primary" /> Email OTP (Required)
                        </span>
                        {otpVerifySuccess ? (
                          <span className="text-[10px] bg-success/20 text-success border border-success/30 px-2 py-0.5 rounded-full font-bold">VERIFIED</span>
                        ) : (
                          <span className="text-[10px] bg-amber-500/20 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded-full font-mono font-bold">
                            {regOtpTimer > 0 ? `${regOtpTimer}s left` : "Expired"}
                          </span>
                        )}
                      </div>

                      {/* Digit Input boxes */}
                      <div className="flex justify-between gap-2.5 pt-1">
                        {[...Array(6)].map((_, idx) => (
                          <input 
                            key={idx}
                            id={`email-otp-${idx}`}
                            type="text"
                            maxLength={1}
                            disabled={otpVerifySuccess}
                            value={regEmailOtp[idx]}
                            onChange={(e) => handleOtpInput(e.target.value, idx, true)}
                            className="w-10 h-12 text-center text-lg font-mono font-bold text-white bg-zinc-950 border border-zinc-850 rounded-xl focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none disabled:opacity-50"
                          />
                        ))}
                      </div>

                      {regOtpTimer === 0 && !otpVerifySuccess && (
                        <button 
                          onClick={() => {
                            setRegOtpSent(false);
                            setRegOtpTimer(60);
                          }}
                          className="w-full text-center text-[10px] text-secondary font-black uppercase hover:underline pt-1.5"
                        >
                          Resend Verification Code
                        </button>
                      )}
                    </div>

                    {/* Mobile Verification (Optional) */}
                    <div className="space-y-3 p-5 rounded-3xl bg-zinc-950/20 border border-zinc-900 opacity-60">
                      <span className="text-[10px] text-zinc-500 font-extrabold uppercase tracking-wider flex items-center gap-1">
                        <Smartphone className="w-3.5 h-3.5 text-zinc-400" /> Mobile OTP (Optional)
                      </span>
                      <div className="flex justify-between gap-2.5">
                        {[...Array(6)].map((_, idx) => (
                          <input 
                            key={idx}
                            id={`mobile-otp-${idx}`}
                            type="text"
                            maxLength={1}
                            value={regMobileOtp[idx]}
                            onChange={(e) => handleOtpInput(e.target.value, idx, false)}
                            className="w-10 h-12 text-center text-lg font-mono font-bold text-white bg-zinc-950 border border-zinc-850 rounded-xl focus:border-secondary focus:ring-1 focus:ring-secondary focus:outline-none"
                          />
                        ))}
                      </div>
                      <p className="text-[9px] text-zinc-650 leading-relaxed italic">You can skip the mobile OTP check and proceed with email validation.</p>
                    </div>

                    {!otpVerifySuccess && (
                      <button 
                        onClick={handleRegOtpSubmit}
                        className="w-full bg-primary hover:bg-primary/95 text-white font-bold text-xs uppercase py-3 rounded-2xl transition-all cursor-pointer text-center"
                      >
                        Verify and Proceed
                      </button>
                    )}
                  </div>
                )}

                {/* STEP 3: Academic Information */}
                {regStep === 3 && (
                  <div className="space-y-4">
                    <p className="text-xs text-zinc-400 leading-relaxed mb-4">
                      IRIS customizes research indices and mentor resources based on academic context.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Country */}
                      <div>
                        <label className="text-[9px] text-zinc-500 font-extrabold uppercase tracking-widest">Country</label>
                        <input 
                          type="text" 
                          required
                          value={regData.academicInfo.country}
                          onChange={(e) => setRegData(prev => ({ 
                            ...prev, 
                            academicInfo: { ...prev.academicInfo, country: e.target.value } 
                          }))}
                          placeholder="e.g. India"
                          className="w-full px-4 py-3 rounded-2xl glass-input text-xs text-white mt-1"
                        />
                      </div>

                      {/* State */}
                      <div>
                        <label className="text-[9px] text-zinc-500 font-extrabold uppercase tracking-widest">State / Region</label>
                        <input 
                          type="text" 
                          required
                          value={regData.academicInfo.state}
                          onChange={(e) => setRegData(prev => ({ 
                            ...prev, 
                            academicInfo: { ...prev.academicInfo, state: e.target.value } 
                          }))}
                          placeholder="e.g. Maharashtra"
                          className="w-full px-4 py-3 rounded-2xl glass-input text-xs text-white mt-1"
                        />
                      </div>

                      {/* School Name */}
                      <div className="md:col-span-2">
                        <label className="text-[9px] text-zinc-500 font-extrabold uppercase tracking-widest">School / College / University Name</label>
                        <input 
                          type="text" 
                          required
                          value={regData.academicInfo.schoolName}
                          onChange={(e) => setRegData(prev => ({ 
                            ...prev, 
                            academicInfo: { ...prev.academicInfo, schoolName: e.target.value } 
                          }))}
                          placeholder="e.g. Indian Institute of Technology"
                          className="w-full px-4 py-3 rounded-2xl glass-input text-xs text-white mt-1"
                        />
                      </div>

                      {/* Course */}
                      <div>
                        <label className="text-[9px] text-zinc-500 font-extrabold uppercase tracking-widest">Course / Program</label>
                        <input 
                          type="text" 
                          required
                          value={regData.academicInfo.course}
                          onChange={(e) => setRegData(prev => ({ 
                            ...prev, 
                            academicInfo: { ...prev.academicInfo, course: e.target.value } 
                          }))}
                          placeholder="e.g. B.Tech Computer Science"
                          className="w-full px-4 py-3 rounded-2xl glass-input text-xs text-white mt-1"
                        />
                      </div>

                      {/* Department */}
                      <div>
                        <label className="text-[9px] text-zinc-500 font-extrabold uppercase tracking-widest">Department / Branch</label>
                        <input 
                          type="text" 
                          required
                          value={regData.academicInfo.department}
                          onChange={(e) => setRegData(prev => ({ 
                            ...prev, 
                            academicInfo: { ...prev.academicInfo, department: e.target.value } 
                          }))}
                          placeholder="e.g. Engineering"
                          className="w-full px-4 py-3 rounded-2xl glass-input text-xs text-white mt-1"
                        />
                      </div>

                      {/* Year */}
                      <div>
                        <label className="text-[9px] text-zinc-500 font-extrabold uppercase tracking-widest">Year of Study</label>
                        <select
                          value={regData.academicInfo.yearOfStudy}
                          onChange={(e) => setRegData(prev => ({ 
                            ...prev, 
                            academicInfo: { ...prev.academicInfo, yearOfStudy: e.target.value } 
                          }))}
                          className="w-full px-4 py-3 rounded-2xl glass-input text-xs text-white mt-1 bg-zinc-950"
                        >
                          <option value="1st Year">1st Year</option>
                          <option value="2nd Year">2nd Year</option>
                          <option value="3rd Year">3rd Year</option>
                          <option value="4th Year">4th Year</option>
                          <option value="5th Year">5th Year</option>
                          <option value="Postgraduate / PhD">Postgraduate / PhD</option>
                        </select>
                      </div>

                      {/* Student ID */}
                      <div>
                        <label className="text-[9px] text-zinc-500 font-extrabold uppercase tracking-widest">Student ID / Roll Number (Optional)</label>
                        <input 
                          type="text" 
                          value={regData.academicInfo.studentId}
                          onChange={(e) => setRegData(prev => ({ 
                            ...prev, 
                            academicInfo: { ...prev.academicInfo, studentId: e.target.value } 
                          }))}
                          placeholder="e.g. 24CS10034"
                          className="w-full px-4 py-3 rounded-2xl glass-input text-xs text-white mt-1"
                        />
                      </div>

                      {/* Timezone */}
                      <div>
                        <label className="text-[9px] text-zinc-500 font-extrabold uppercase tracking-widest">Academic Time Zone</label>
                        <input 
                          type="text" 
                          required
                          value={regData.academicInfo.timezone}
                          onChange={(e) => setRegData(prev => ({ 
                            ...prev, 
                            academicInfo: { ...prev.academicInfo, timezone: e.target.value } 
                          }))}
                          placeholder="e.g. UTC, Asia/Kolkata"
                          className="w-full px-4 py-3 rounded-2xl glass-input text-xs text-white mt-1"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 4: Learning Profile */}
                {regStep === 4 && (
                  <div className="space-y-5">
                    
                    {/* Goal Card Selectors */}
                    <div>
                      <label className="text-[9px] text-zinc-500 font-extrabold uppercase tracking-widest block mb-2">Learning Goal</label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                        {[
                          "School Learning", 
                          "College Learning", 
                          "Competitive Exams", 
                          "Placement Preparation", 
                          "Skill Development", 
                          "Research", 
                          "Career Development"
                        ].map((goal) => {
                          const isSelected = regData.learningProfile.goal === goal;
                          return (
                            <button
                              key={goal}
                              type="button"
                              onClick={() => setGoal(goal)}
                              className={`p-3 rounded-xl border text-[10px] font-bold text-left transition-all ${
                                isSelected 
                                  ? "bg-primary/10 border-primary text-primary" 
                                  : "bg-zinc-950/40 border-zinc-900 text-zinc-400 hover:border-zinc-800"
                              }`}
                            >
                              {goal}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Preferred Subjects (Multi-select) */}
                    <div>
                      <label className="text-[9px] text-zinc-500 font-extrabold uppercase tracking-widest block mb-2">Preferred Subjects</label>
                      <div className="flex flex-wrap gap-2">
                        {["Mathematics", "Science", "Programming", "AI & ML", "Data Science", "Literature", "Business", "Languages"].map((subj) => {
                          const isSelected = regData.learningProfile.preferredSubjects.includes(subj);
                          return (
                            <button
                              key={subj}
                              type="button"
                              onClick={() => toggleSubject(subj)}
                              className={`px-3.5 py-1.5 rounded-full border text-[10px] font-bold transition-all ${
                                isSelected 
                                  ? "bg-secondary/15 border-secondary text-secondary" 
                                  : "bg-zinc-950/20 border-zinc-900 text-zinc-400 hover:border-zinc-800"
                              }`}
                            >
                              {subj} {isSelected && "✓"}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Skill Level */}
                      <div>
                        <label className="text-[9px] text-zinc-500 font-extrabold uppercase tracking-widest block mb-2">Current Skill Level</label>
                        <div className="flex gap-2">
                          {["Beginner", "Intermediate", "Advanced"].map((level) => {
                            const isSelected = regData.learningProfile.skillLevel === level;
                            return (
                              <button
                                key={level}
                                type="button"
                                onClick={() => setSkillLevel(level)}
                                className={`flex-1 py-2.5 rounded-xl border text-xs font-bold transition-all ${
                                  isSelected 
                                    ? "bg-primary/10 border-primary text-primary" 
                                    : "bg-zinc-950/20 border-zinc-900 text-zinc-400 hover:border-zinc-800"
                                }`}
                              >
                                {level}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Learning Style */}
                      <div>
                        <label className="text-[9px] text-zinc-500 font-extrabold uppercase tracking-widest block mb-2">Preferred Learning Style</label>
                        <select
                          value={regData.learningProfile.learningStyle}
                          onChange={(e) => setLearningStyle(e.target.value)}
                          className="w-full px-4 py-3 rounded-2xl glass-input text-xs text-white bg-zinc-950"
                        >
                          <option value="Reading">Reading</option>
                          <option value="Videos">Videos</option>
                          <option value="Practice Questions">Practice Questions</option>
                          <option value="Interactive Learning">Interactive Learning</option>
                          <option value="Audio Learning">Audio Learning</option>
                        </select>
                      </div>

                      {/* Study Time */}
                      <div>
                        <label className="text-[9px] text-zinc-500 font-extrabold uppercase tracking-widest block mb-2">Preferred Study Time</label>
                        <div className="flex gap-1.5 flex-wrap">
                          {["Morning", "Afternoon", "Evening", "Night"].map((time) => {
                            const isSelected = regData.learningProfile.preferredStudyTime === time;
                            return (
                              <button
                                key={time}
                                type="button"
                                onClick={() => setStudyTime(time)}
                                className={`px-4 py-2 rounded-xl border text-[10px] font-bold transition-all ${
                                  isSelected 
                                    ? "bg-secondary/15 border-secondary text-secondary" 
                                    : "bg-zinc-950/20 border-zinc-900 text-zinc-400 hover:border-zinc-800"
                                }`}
                              >
                                {time}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Duration */}
                      <div>
                        <label className="text-[9px] text-zinc-500 font-extrabold uppercase tracking-widest block mb-2">Daily Study Duration</label>
                        <select
                          value={regData.learningProfile.dailyStudyDuration}
                          onChange={(e) => setStudyDuration(e.target.value)}
                          className="w-full px-4 py-3 rounded-2xl glass-input text-xs text-white bg-zinc-950"
                        >
                          <option value="Less than 1 Hour">Less than 1 Hour</option>
                          <option value="1–2 Hours">1–2 Hours</option>
                          <option value="2–4 Hours">2–4 Hours</option>
                          <option value="More than 4 Hours">More than 4 Hours</option>
                        </select>
                      </div>

                      {/* Favorite Subject */}
                      <div>
                        <label className="text-[9px] text-zinc-500 font-extrabold uppercase tracking-widest block mb-2">Favorite Subject</label>
                        <input 
                          type="text" 
                          required
                          value={regData.learningProfile.favoriteSubject}
                          onChange={(e) => setRegData(prev => ({ 
                            ...prev, 
                            learningProfile: { ...prev.learningProfile, favoriteSubject: e.target.value } 
                          }))}
                          placeholder="e.g. Mathematics"
                          className="w-full px-4 py-3 rounded-2xl glass-input text-xs text-white"
                        />
                      </div>

                      {/* Weak Subject */}
                      <div>
                        <label className="text-[9px] text-zinc-500 font-extrabold uppercase tracking-widest block mb-2">Weak Subject</label>
                        <input 
                          type="text" 
                          required
                          value={regData.learningProfile.weakSubject}
                          onChange={(e) => setRegData(prev => ({ 
                            ...prev, 
                            learningProfile: { ...prev.learningProfile, weakSubject: e.target.value } 
                          }))}
                          placeholder="e.g. Organic Chemistry"
                          className="w-full px-4 py-3 rounded-2xl glass-input text-xs text-white"
                        />
                      </div>

                      {/* Weekly Learning Goal */}
                      <div>
                        <label className="text-[9px] text-zinc-500 font-extrabold uppercase tracking-widest block mb-2">Weekly Learning Goal</label>
                        <select
                          value={regData.learningProfile.weeklyLearningGoal}
                          onChange={(e) => setRegData(prev => ({ 
                            ...prev, 
                            learningProfile: { ...prev.learningProfile, weeklyLearningGoal: e.target.value } 
                          }))}
                          className="w-full px-4 py-3 rounded-2xl glass-input text-xs text-white bg-zinc-950"
                        >
                          <option value="5 Hours">5 Hours</option>
                          <option value="10 Hours">10 Hours</option>
                          <option value="15 Hours">15 Hours</option>
                          <option value="20 Hours">20 Hours</option>
                          <option value="30+ Hours">30+ Hours</option>
                        </select>
                      </div>
                    </div>

                  </div>
                )}

                {/* STEP 5: Career Preferences */}
                {regStep === 5 && (
                  <div className="space-y-4">
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Dream Career */}
                      <div>
                        <label className="text-[9px] text-zinc-500 font-extrabold uppercase tracking-widest">Dream Career / Destination Role</label>
                        <input 
                          type="text" 
                          required
                          value={regData.careerPreferences.dreamCareer}
                          onChange={(e) => setRegData(prev => ({ 
                            ...prev, 
                            careerPreferences: { ...prev.careerPreferences, dreamCareer: e.target.value } 
                          }))}
                          placeholder="e.g. Machine Learning Scientist"
                          className="w-full px-4 py-3 rounded-2xl glass-input text-xs text-white mt-1"
                        />
                      </div>

                      {/* Target Competitive Exams */}
                      <div>
                        <label className="text-[9px] text-zinc-500 font-extrabold uppercase tracking-widest">Target Competitive Exams (Optional)</label>
                        <input 
                          type="text" 
                          value={regData.careerPreferences.targetExams.join(", ")}
                          onChange={(e) => setRegData(prev => ({ 
                            ...prev, 
                            careerPreferences: { 
                              ...prev.careerPreferences, 
                              targetExams: e.target.value.split(",").map(t => t.trim()).filter(Boolean) 
                            } 
                          }))}
                          placeholder="e.g. JEE, UPSC, GATE"
                          className="w-full px-4 py-3 rounded-2xl glass-input text-xs text-white mt-1"
                        />
                      </div>
                    </div>

                    {/* Career Interests */}
                    <div>
                      <label className="text-[9px] text-zinc-500 font-extrabold uppercase tracking-widest">Career Interests & Domain Areas</label>
                      <textarea 
                        rows={2}
                        value={regData.careerPreferences.interests}
                        onChange={(e) => setRegData(prev => ({ 
                          ...prev, 
                          careerPreferences: { ...prev.careerPreferences, interests: e.target.value } 
                        }))}
                        placeholder="Explain fields you want to dive into..."
                        className="w-full px-4 py-3 rounded-2xl glass-input text-xs text-white mt-1 resize-none"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Short Term Goal */}
                      <div>
                        <label className="text-[9px] text-zinc-500 font-extrabold uppercase tracking-widest">Short-term Goal (Next 6 Months)</label>
                        <input 
                          type="text" 
                          required
                          value={regData.careerPreferences.shortTermGoal}
                          onChange={(e) => setRegData(prev => ({ 
                            ...prev, 
                            careerPreferences: { ...prev.careerPreferences, shortTermGoal: e.target.value } 
                          }))}
                          placeholder="e.g. Score >90% in Calculus assessments"
                          className="w-full px-4 py-3 rounded-2xl glass-input text-xs text-white mt-1"
                        />
                      </div>

                      {/* Long Term Goal */}
                      <div>
                        <label className="text-[9px] text-zinc-500 font-extrabold uppercase tracking-widest">Long-term Goal (Next 2-3 Years)</label>
                        <input 
                          type="text" 
                          required
                          value={regData.careerPreferences.longTermGoal}
                          onChange={(e) => setRegData(prev => ({ 
                            ...prev, 
                            careerPreferences: { ...prev.careerPreferences, longTermGoal: e.target.value } 
                          }))}
                          placeholder="e.g. Secure research fellowship"
                          className="w-full px-4 py-3 rounded-2xl glass-input text-xs text-white mt-1"
                        />
                      </div>
                    </div>

                  </div>
                )}

                {/* STEP 6: Personalization */}
                {regStep === 6 && (
                  <div className="space-y-6">
                    <p className="text-xs text-zinc-400 leading-relaxed">
                      Personalize theme options and system integrations instantly.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      
                      {/* Left: UI Preferences */}
                      <div className="space-y-4 bg-zinc-950/20 p-5 rounded-3xl border border-zinc-900">
                        <h4 className="text-[10px] text-zinc-500 font-extrabold uppercase tracking-wider">UI & System Preferences</h4>
                        
                        {/* Theme Toggler */}
                        <div className="flex justify-between items-center py-1 border-b border-zinc-900 pb-2.5">
                          <div>
                            <span className="text-xs font-bold text-zinc-200">System Visual Theme</span>
                            <p className="text-[9px] text-zinc-500">Toggle light or dark rendering mode</p>
                          </div>
                          <button
                            type="button"
                            onClick={toggleTheme}
                            className="px-3.5 py-1.5 rounded-xl bg-zinc-950 border border-zinc-800 text-[10px] font-bold text-primary hover:border-primary transition-all cursor-pointer"
                          >
                            {theme === "dark" ? "🌙 Dark Active" : "☀️ Light Active"}
                          </button>
                        </div>

                        {/* Font Size Selector */}
                        <div className="flex justify-between items-center py-1 border-b border-zinc-900 pb-2.5">
                          <div>
                            <span className="text-xs font-bold text-zinc-200">Font Size Selection</span>
                            <p className="text-[9px] text-zinc-500">Scale readable font size scaling</p>
                          </div>
                          <div className="flex gap-1 bg-zinc-950 p-1 rounded-xl border border-zinc-850">
                            {["normal", "large", "extra-large"].map((sz) => {
                              const isSel = regData.personalization.fontSize === sz;
                              return (
                                <button
                                  key={sz}
                                  type="button"
                                  onClick={() => setRegData(prev => ({
                                    ...prev,
                                    personalization: { ...prev.personalization, fontSize: sz }
                                  }))}
                                  className={`px-2 py-1 rounded text-[8px] font-black uppercase transition-all cursor-pointer ${
                                    isSel ? "bg-primary text-white" : "text-zinc-500 hover:text-zinc-350"
                                  }`}
                                >
                                  {sz === "extra-large" ? "XL" : sz}
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* High Contrast Toggler */}
                        <div className="flex justify-between items-center py-1 border-b border-zinc-900 pb-2.5">
                          <div>
                            <span className="text-xs font-bold text-zinc-200">High Contrast Mode</span>
                            <p className="text-[9px] text-zinc-500">Enable high-contrast visual display</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => setRegData(prev => ({
                              ...prev,
                              personalization: { ...prev.personalization, highContrast: !prev.personalization.highContrast }
                            }))}
                            className={`px-3 py-1.5 rounded-xl border text-[10px] font-bold transition-all cursor-pointer ${
                              regData.personalization.highContrast 
                                ? "bg-secondary/15 border-secondary text-secondary" 
                                : "bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700"
                            }`}
                          >
                            {regData.personalization.highContrast ? "👀 High Contrast ON" : "Contrast OFF"}
                          </button>
                        </div>

                        {/* Switch inputs */}
                        {[
                          { key: "voiceLearning", label: "🎙️ Enable Voice Learning", desc: "Interact with AI Mentors via audio speech synthesis" },
                          { key: "dailyReminders", label: "⏰ Daily Learning Reminders", desc: "Receive daily alerts to complete study tasks" },
                          { key: "weeklyProgress", label: "📈 Weekly Progress Reminder", desc: "Report study summaries at the end of the week" },
                          { key: "smartBreak", label: "☕ Smart Break Reminder", desc: "Alerts you to take short breaks during intense blocks" },
                          { key: "offlineNotes", label: "💾 Enable Offline Notes Vault", desc: "Save study summaries locally on device sandbox" },
                          { key: "voiceAssistance", label: "🗣️ Enable Voice Assistance", desc: "System voice alerts for accessibility" },
                          { key: "textToSpeech", label: "📢 Enable Text-to-Speech Support", desc: "Reads out screen prompts and details" }
                        ].map((item) => (
                          <label key={item.key} className="flex justify-between items-center cursor-pointer py-1">
                            <div>
                              <span className="text-xs font-bold text-zinc-200">{item.label}</span>
                              <p className="text-[9px] text-zinc-500">{item.desc}</p>
                            </div>
                            <input 
                              type="checkbox" 
                              checked={(regData.personalization as any)[item.key]}
                              onChange={(e) => setRegData(prev => ({
                                ...prev,
                                personalization: { ...prev.personalization, [item.key]: e.target.checked }
                              }))}
                              className="rounded border-zinc-800 bg-zinc-950 text-primary focus:ring-primary w-4 h-4 cursor-pointer"
                            />
                          </label>
                        ))}
                      </div>

                      {/* Right: Notifications & Mentor Avatar */}
                      <div className="space-y-4 bg-zinc-950/20 p-5 rounded-3xl border border-zinc-900">
                        <h4 className="text-[10px] text-zinc-500 font-extrabold uppercase tracking-wider">AI Avatar Settings</h4>
                        
                        <div>
                          <label className="text-[9px] text-zinc-500 font-extrabold uppercase tracking-widest block mb-2">Preferred AI Tutor Avatar</label>
                          <div className="grid grid-cols-2 gap-2">
                            {[
                              { id: "chronos", label: "🤖 Chronos", desc: "Analytical Model" },
                              { id: "aura", label: "✨ Aura", desc: "Supportive Coach" },
                              { id: "aegis", label: "🛡️ Aegis", desc: "Structured Mentor" },
                              { id: "vortex", label: "🌀 Vortex", desc: "Experimentalist" }
                            ].map((av) => {
                              const isSelected = regData.personalization.avatarId === av.id;
                              return (
                                <button
                                  key={av.id}
                                  type="button"
                                  onClick={() => setRegData(prev => ({
                                    ...prev,
                                    personalization: { ...prev.personalization, avatarId: av.id }
                                  }))}
                                  className={`p-2.5 rounded-xl border text-left transition-all ${
                                    isSelected 
                                      ? "bg-primary/10 border-primary text-primary" 
                                      : "bg-zinc-950 border-zinc-900 text-zinc-400 hover:border-zinc-800"
                                  }`}
                                >
                                  <div className="text-xs font-bold">{av.label}</div>
                                  <div className="text-[8px] text-zinc-500 mt-0.5">{av.desc}</div>
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        <div className="border-t border-zinc-900 pt-3.5 space-y-2.5">
                          <h5 className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest">Notification Channels</h5>
                          {[
                            { key: "emailNotifications", label: "📧 Email Notifications" },
                            { key: "pushNotifications", label: "🔔 Push Notifications" },
                            { key: "assignmentReminders", label: "📚 Assignment Reminders" },
                            { key: "revisionAlerts", label: "⚡ Revision Alerts" },
                            { key: "examCountdown", label: "⏰ Exam Countdown Alerts" },
                            { key: "achievementsNotifications", label: "🏆 Achievement Notifications" }
                          ].map((item) => (
                            <label key={item.key} className="flex justify-between items-center cursor-pointer">
                              <span className="text-xs text-zinc-300 font-medium">{item.label}</span>
                              <input 
                                type="checkbox" 
                                checked={(regData.personalization as any)[item.key]}
                                onChange={(e) => setRegData(prev => ({
                                  ...prev,
                                  personalization: { ...prev.personalization, [item.key]: e.target.checked }
                                }))}
                                className="rounded border-zinc-800 bg-zinc-950 text-secondary focus:ring-secondary w-3.5 h-3.5 cursor-pointer"
                              />
                            </label>
                          ))}
                        </div>
                      </div>

                    </div>
                  </div>
                )}

                {/* STEP 7: Initial Skill Assessment */}
                {regStep === 7 && (
                  <div className="space-y-6">
                    {!assessmentComplete ? (
                      <div className="space-y-4">
                        <div className="p-4 rounded-2xl bg-primary/10 border border-primary/20 text-xs text-primary font-semibold leading-relaxed">
                          ⚡ Adaptive Assessment Active: Questions are automatically generated based on preferred topics selected in Step 4. Correct solutions generate dynamic initial Learning Profile stats.
                        </div>

                        {/* Question View */}
                        <div className="p-6 rounded-3xl bg-zinc-950/40 border border-zinc-900 space-y-5">
                          <div className="flex justify-between items-center text-[10px] text-zinc-500 font-extrabold uppercase tracking-widest border-b border-zinc-900 pb-2.5">
                            <span>Subject: {currentQuestions[assessmentIndex].subject}</span>
                            <span>Question {assessmentIndex + 1} of {currentQuestions.length}</span>
                          </div>

                          <h4 className="text-sm font-bold text-white leading-relaxed">
                            {currentQuestions[assessmentIndex].question}
                          </h4>

                          {/* Options list */}
                          <div className="space-y-2">
                            {currentQuestions[assessmentIndex].options.map((option, oIdx) => {
                              const isSelected = selectedAssessmentOption === oIdx;
                              return (
                                <button
                                  key={oIdx}
                                  type="button"
                                  onClick={() => setSelectedAssessmentOption(oIdx)}
                                  className={`w-full p-3 rounded-xl border text-left text-xs font-semibold transition-all ${
                                    isSelected 
                                      ? "bg-primary/10 border-primary text-primary" 
                                      : "bg-zinc-950/20 border-zinc-900 text-zinc-400 hover:border-zinc-800"
                                  } cursor-pointer`}
                                >
                                  {option}
                                </button>
                              );
                            })}
                          </div>

                          <div className="flex justify-end pt-3">
                            <button
                              type="button"
                              onClick={handleAssessmentAnswerSubmit}
                              disabled={selectedAssessmentOption === null}
                              className="bg-primary hover:bg-primary/95 text-white font-bold text-xs uppercase px-5 py-2.5 rounded-xl disabled:opacity-50 transition-all cursor-pointer"
                            >
                              {assessmentIndex < currentQuestions.length - 1 ? "Next Question" : "Compile Learning Profile"}
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="max-w-md mx-auto text-center space-y-6 py-6">
                        <div className="w-16 h-16 rounded-full bg-success/15 border border-success flex items-center justify-center mx-auto shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                          <Award className="w-8 h-8 text-success animate-bounce" />
                        </div>
                        
                        <div className="space-y-2">
                          <h3 className="text-lg font-black text-white uppercase">Assessment Completed!</h3>
                          <p className="text-xs text-zinc-400 leading-relaxed">
                            We analyzed your answers. You scored <span className="text-success font-black">{assessmentScore}/{currentQuestions.length}</span>. Your baseline learning retention starts at <span className="text-primary font-bold">{60 + (assessmentScore * 8)}%</span>.
                          </p>
                        </div>

                        <div className="bg-zinc-950/40 border border-zinc-900 rounded-3xl p-5 text-left space-y-3.5">
                          <h4 className="text-[10px] text-zinc-500 font-extrabold uppercase tracking-widest text-center border-b border-zinc-900 pb-2">Generated Profile Baseline</h4>
                          <div className="flex justify-between items-center text-xs">
                            <span className="text-zinc-500">Learning Profile Score:</span>
                            <span className="text-primary font-bold">{70 + (assessmentScore * 5)}/100</span>
                          </div>
                          <div className="flex justify-between items-center text-xs">
                            <span className="text-zinc-500">Default Mentors Assigned:</span>
                            <span className="text-secondary font-bold">
                              {regData.learningProfile.preferredSubjects.slice(0, 3).join(", ") || "General Study Bots"}
                            </span>
                          </div>
                          <div className="flex justify-between items-center text-xs">
                            <span className="text-zinc-500">Recommended Study Mode:</span>
                            <span className="text-primary font-bold">Deep Concept Learning</span>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={handleRegistrationComplete}
                          className="w-full bg-gradient-to-r from-primary to-secondary text-white font-extrabold text-xs uppercase py-3.5 rounded-2xl shadow-xl hover:opacity-95 transition-all cursor-pointer text-center"
                        >
                          Generate Profile & Launch IRIS OS
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Step Navigation Actions footer */}
              {regStep < 7 && (
                <div className="flex justify-between border-t border-zinc-900 pt-5 mt-4">
                  <button 
                    disabled={regStep === 1}
                    onClick={() => setRegStep(prev => prev - 1)}
                    className="flex items-center gap-1 text-xs text-zinc-500 hover:text-zinc-300 disabled:opacity-30 cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" /> Previous Step
                  </button>
                  
                  {regStep !== 2 && (
                    <button 
                      onClick={() => {
                        let valid = true;
                        if (regStep === 1) valid = validateRegStep1();
                        
                        if (valid) {
                          setRegStep(prev => prev + 1);
                        }
                      }}
                      className="flex items-center gap-1 text-xs text-white bg-primary hover:bg-primary/95 font-bold px-4 py-2 rounded-xl transition-all cursor-pointer"
                    >
                      Next Step <ChevronRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              )}

            </div>
          )}

        </motion.div>
      </div>

    </div>
  );
}
