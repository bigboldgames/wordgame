import React, { useEffect, useState } from "react";
import axios from "axios";
import googleImg from "../assets/google.svg";

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isGoogleLoaded, setIsGoogleLoaded] = useState(false);

  useEffect(() => {
    /* global google */
    const loadGoogle = () => {
      try {
        if (window.google && window.google.accounts && window.google.accounts.id) {
          console.log("Initializing Google OAuth...");
          google.accounts.id.initialize({
            client_id: "1072196551899-javrqui2d3pi35tc5luum8nelefhj9bs.apps.googleusercontent.com",
            callback: handleGoogleResponse,
            auto_select: false,
            cancel_on_tap_outside: true,
            use_fedcm_for_prompt: false, // Disable FedCM to avoid AbortError
            ux_mode: 'popup', // Use popup mode instead of redirect
          });
          setIsGoogleLoaded(true);
          console.log("✅ Google OAuth initialized successfully");
        } else {
          console.error("❌ Google OAuth not available");
          setError("Google authentication not available. Please refresh the page.");
        }
      } catch (err) {
        console.error("❌ Error initializing Google OAuth:", err);
        setError("Failed to initialize Google authentication: " + err.message);
      }
    };

    // Check if Google is already loaded
    if (window.google && window.google.accounts && window.google.accounts.id) {
      console.log("Google already loaded, initializing...");
      loadGoogle();
    } else {
      console.log("Loading Google script...");
      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      script.onload = () => {
        console.log("✅ Google script loaded successfully");
        // Wait a bit for Google to be fully available
        setTimeout(() => {
          loadGoogle();
        }, 500); // Increased timeout
      };
      script.onerror = (error) => {
        console.error("❌ Failed to load Google script:", error);
        setError("Failed to load Google authentication. Please check your internet connection and try again.");
      };
      document.head.appendChild(script);
    }
  }, []);

  const handleGoogleResponse = async (response) => {
    console.log("🔐 Google response received:", response);
    setIsLoading(true);
    setError("");
    
    try {
      if (!response || !response.credential) {
        throw new Error("No credential received from Google");
      }

      const token = response.credential;
      console.log("🔑 Token received, decoding...");
      
      // Decode JWT token
      const parts = token.split(".");
      if (parts.length !== 3) {
        throw new Error("Invalid JWT token format");
      }
      
      const payload = JSON.parse(atob(parts[1]));
      console.log("👤 Decoded payload:", payload);

      const userData = {
        name: payload.name || "Unknown User",
        email: payload.email || "",
        provider: "google",
        avatar: payload.picture || "",
      };

      console.log("✅ User data extracted:", userData);

      // Save to localStorage
      localStorage.setItem("googleUser", JSON.stringify(userData));
      console.log("💾 User data saved to localStorage");

      // Try to save to backend (optional)
      try {
        const res = await axios.post("http://localhost:5000/api/users", userData);
        console.log("✅ Saved to database:", res.data);
        alert(`Welcome ${userData.name}! Your data has been saved.`);
      } catch (err) {
        console.warn("⚠️ Backend save failed (this is okay):", err.message);
        // Still show success even if backend fails
        alert(`Welcome ${userData.name}! Your data has been saved locally.`);
      }
    } catch (err) {
      console.error("❌ Error processing Google response:", err);
      setError(`Authentication failed: ${err.message}. Please try again.`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    console.log("🚀 Google login button clicked");
    console.log("isGoogleLoaded:", isGoogleLoaded);
    console.log("window.google:", !!window.google);
    console.log("window.google.accounts:", !!window.google?.accounts);
    console.log("window.google.accounts.id:", !!window.google?.accounts?.id);

    if (!isGoogleLoaded) {
      setError("Google authentication is still loading. Please wait a moment and try again.");
      return;
    }

    // Clear any previous errors
    setError("");

    try {
      /* global google */
      if (window.google && window.google.accounts && window.google.accounts.id) {
        console.log("🔐 Triggering Google OAuth...");
        
        // Try the simple prompt method first (most reliable)
        try {
          google.accounts.id.prompt((notification) => {
            console.log("📢 Google OAuth notification:", notification);
            if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
              console.log("⚠️ Google OAuth prompt was not displayed or skipped");
              setError("Google sign-in popup was blocked or skipped. Please try again and allow popups for this site.");
            }
          });
        } catch (promptError) {
          console.warn("⚠️ Prompt method failed, trying renderButton:", promptError);
          
          // Fallback to renderButton method
          const buttonDiv = document.getElementById('google-signin-button');
          if (buttonDiv) {
            buttonDiv.innerHTML = '';
            buttonDiv.className = 'block'; // Show the div
            google.accounts.id.renderButton(buttonDiv, {
              theme: 'outline',
              size: 'large',
              width: '100%',
              text: 'continue_with',
              shape: 'rectangular',
              logo_alignment: 'left',
              callback: handleGoogleResponse
            });
          } else {
            throw new Error("No button container found for Google OAuth");
          }
        }
      } else {
        console.error("❌ Google OAuth not available");
        setError("Google authentication not available. Please refresh the page.");
      }
    } catch (err) {
      console.error("❌ Error triggering Google login:", err);
      setError("Failed to start Google authentication: " + err.message);
    }
  };

  return (
    <div className="login-page min-h-screen flex items-center justify-center px-4 py-8 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900"></div>
      
      {/* Floating elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-blue-200 dark:bg-blue-800 rounded-full opacity-20 animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-purple-200 dark:bg-purple-800 rounded-full opacity-20 animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-indigo-200 dark:bg-indigo-800 rounded-full opacity-30 animate-pulse delay-500"></div>
      
      <div className="w-full max-w-[480px] relative z-10">
        <div className="backdrop-blur-sm bg-white/80 dark:bg-gray-900/80 rounded-3xl border border-white/20 dark:border-gray-700/50 shadow-2xl p-8 sm:p-10">
          {/* Logo/Icon area */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-4 shadow-lg">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
              Welcome Back
            </h2>
            <p className="mt-3 text-gray-600 dark:text-gray-400 text-lg">
              Sign in to save your progress and sync across devices
            </p>
          </div>

          <div className="space-y-6">
            {/* Error Message */}
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-red-700 dark:text-red-300 text-sm font-medium">{error}</p>
                </div>
              </div>
            )}

            {/* Google Sign In Button */}
            <div className="space-y-3">
              {/* Custom Button */}
              <button
                onClick={handleGoogleLogin}
                disabled={isLoading || !isGoogleLoaded}
                className={`group relative w-full flex items-center justify-center gap-4 px-6 py-4 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-2xl text-gray-700 dark:text-gray-300 font-semibold text-lg transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-500/20 ${
                  isLoading || !isGoogleLoaded
                    ? 'opacity-50 cursor-not-allowed'
                    : 'hover:border-blue-500 hover:shadow-xl hover:-translate-y-1'
                }`}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                {isLoading ? (
                  <>
                    <div className="w-6 h-6 border-2 border-gray-300 dark:border-gray-600 border-t-blue-500 rounded-full animate-spin"></div>
                    <span className="relative z-10">Signing in...</span>
                  </>
                ) : (
                  <>
                    <img src={googleImg} className="w-6 h-6 relative z-10" alt="google" />
                    <span className="relative z-10">
                      {!isGoogleLoaded ? 'Loading...' : 'Continue with Google'}
                    </span>
                    <div className="absolute right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </>
                )}
              </button>

              {/* Google's Official Button (Hidden by default, shown on error) */}
              <div id="google-signin-button" className="hidden"></div>
            </div>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400 font-medium">
                  Secure & Private
                </span>
              </div>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
              <div className="flex flex-col items-center p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mb-2">
                  <svg className="w-4 h-4 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Auto Save</span>
              </div>
              <div className="flex flex-col items-center p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mb-2">
                  <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
                  </svg>
                </div>
                <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Cloud Sync</span>
              </div>
              <div className="flex flex-col items-center p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mb-2">
                  <svg className="w-4 h-4 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Secure</span>
              </div>
            </div>

            {/* Terms */}
            <p className="text-xs text-center text-gray-500 dark:text-gray-400 leading-relaxed">
              By continuing, you agree to our{" "}
              <a href="#" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">Terms of Service</a>
              {" "}and{" "}
              <a href="#" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">Privacy Policy</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
