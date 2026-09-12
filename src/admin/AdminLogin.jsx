import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  ArrowLeft,
  CheckCircle2,
  ShieldCheck,
} from "lucide-react";

function AdminLogin() {
  const navigate = useNavigate();

  // =========================================================
  // LOGIN STATE
  // =========================================================

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  // =========================================================
  // FORGOT PASSWORD STATE
  // =========================================================

  const [showForgotPassword, setShowForgotPassword] =
    useState(false);

  // 1 = Email
  // 2 = OTP
  // 3 = New Password
  const [resetStep, setResetStep] = useState(1);

  const [resetEmail, setResetEmail] = useState("");
  const [otp, setOtp] = useState("");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [showNewPassword, setShowNewPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [resetError, setResetError] = useState("");
  const [resetSuccess, setResetSuccess] =
    useState(false);

  // =========================================================
  // LOGIN
  // =========================================================

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        "https://aims-academy-backend-production-a580.up.railway.app/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email.trim().toLowerCase(),
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Invalid email or password."
        );
      }

      // Save authentication session
      localStorage.setItem(
        "adminToken",
        data.token
      );

      localStorage.setItem(
        "adminLoggedIn",
        "true"
      );

      localStorage.setItem(
        "adminInfo",
        JSON.stringify(data.admin)
      );

      navigate("/admin/dashboard");
    } catch (err) {
      setError(
        err.message ||
          "Unable to connect to the server."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // SEND OTP
  // =========================================================

  const handleSendOTP = async (e) => {
    e.preventDefault();

    setResetError("");

    const enteredResetEmail =
      resetEmail.trim().toLowerCase();

    if (!enteredResetEmail) {
      setResetError(
        "Please enter your admin email address."
      );
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "https://aims-academy-backend-production-a580.up.railway.app/api/auth/forgot-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: enteredResetEmail,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Unable to send verification code."
        );
      }

      // Move to OTP screen
      setResetStep(2);
      setResetError("");
      setOtp("");
    } catch (err) {
      setResetError(
        err.message ||
          "Unable to connect to the server."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // VERIFY OTP
  // =========================================================

  const handleVerifyOTP = async (e) => {
    e.preventDefault();

    setResetError("");

    const enteredOTP = otp.trim();

    if (!enteredOTP) {
      setResetError(
        "Please enter the verification code."
      );
      return;
    }

    if (!/^\d{6}$/.test(enteredOTP)) {
      setResetError(
        "Please enter the 6-digit verification code."
      );
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "https://aims-academy-backend-production-a580.up.railway.app/api/auth/verify-otp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: resetEmail.trim().toLowerCase(),
            otp: enteredOTP,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Invalid verification code."
        );
      }

      // Move to new password screen
      setResetStep(3);
      setResetError("");
    } catch (err) {
      setResetError(
        err.message ||
          "Unable to verify the OTP."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // RESET PASSWORD
  // =========================================================

  const handleResetPassword = async (e) => {
    e.preventDefault();

    setResetError("");

    if (newPassword.length < 6) {
      setResetError(
        "Password must be at least 6 characters long."
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      setResetError(
        "New password and confirm password do not match."
      );
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "https://aims-academy-backend-production-a580.up.railway.app/api/auth/reset-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: resetEmail.trim().toLowerCase(),
            newPassword,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Unable to reset the password."
        );
      }

      setResetSuccess(true);
      setResetError("");

      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setResetError(
        err.message ||
          "Unable to connect to the server."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // RESEND OTP
  // =========================================================

  const handleResendOTP = async () => {
    setResetError("");
    setLoading(true);

    try {
        const response = await fetch("/api/auth/login", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
          });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Unable to resend verification code."
        );
      }

      setOtp("");

      setResetError("");

      alert(
        "A new verification code has been sent to your email."
      );
    } catch (err) {
      setResetError(
        err.message ||
          "Unable to resend verification code."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // BACK TO LOGIN
  // =========================================================

  const handleBackToLogin = () => {
    setShowForgotPassword(false);

    setResetStep(1);

    setResetEmail("");
    setOtp("");

    setNewPassword("");
    setConfirmPassword("");

    setResetError("");
    setResetSuccess(false);

    setError("");

    setShowNewPassword(false);
    setShowConfirmPassword(false);
  };

  // =========================================================
  // BACK TO EMAIL
  // =========================================================

  const handleBackToEmail = () => {
    setResetStep(1);
    setOtp("");
    setResetError("");
  };

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <div style={styles.page}>
      <div style={styles.card}>

        {/* =================================================
            LOGIN PAGE
        ================================================= */}

        {!showForgotPassword && (
          <>
            <div style={styles.header}>
              <div style={styles.logoCircle}>
                <Lock
                  size={30}
                  color="#ffffff"
                />
              </div>

              <h1 style={styles.title}>
                AIMS Academy
              </h1>

              <p style={styles.subtitle}>
                Admin Portal
              </p>

              <div style={styles.divider}></div>

              <p style={styles.welcome}>
                Welcome back! Please login to continue.
              </p>
            </div>

            {error && (
              <div style={styles.error}>
                {error}
              </div>
            )}

            <form onSubmit={handleLogin}>

              {/* Email */}

              <div style={styles.field}>
                <label style={styles.label}>
                  Email Address
                </label>

                <div style={styles.inputWrapper}>
                  <Mail
                    size={19}
                    color="#198754"
                    style={styles.inputIcon}
                  />

                  <input
                    type="email"
                    value={email}
                    onChange={(e) =>
                      setEmail(e.target.value)
                    }
                    placeholder="Enter your email"
                    required
                    style={styles.input}
                  />
                </div>
              </div>

              {/* Password */}

              <div style={styles.field}>
                <label style={styles.label}>
                  Password
                </label>

                <div style={styles.inputWrapper}>
                  <Lock
                    size={19}
                    color="#198754"
                    style={styles.inputIcon}
                  />

                  <input
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    value={password}
                    onChange={(e) =>
                      setPassword(e.target.value)
                    }
                    placeholder="Enter your password"
                    required
                    style={styles.passwordInput}
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(
                        !showPassword
                      )
                    }
                    style={styles.eyeButton}
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOff
                        size={19}
                        color="#6b7280"
                      />
                    ) : (
                      <Eye
                        size={19}
                        color="#6b7280"
                      />
                    )}
                  </button>
                </div>
              </div>

              {/* Forgot Password */}

              <div style={styles.forgotRow}>
                <button
                  type="button"
                  onClick={() => {
                    setShowForgotPassword(true);
                    setResetStep(1);
                    setError("");
                    setResetError("");
                  }}
                  style={styles.forgotButton}
                >
                  Forgot Password?
                </button>
              </div>

              {/* Login */}

              <button
                type="submit"
                disabled={loading}
                style={{
                  ...styles.loginButton,
                  opacity: loading ? 0.7 : 1,
                  cursor: loading
                    ? "not-allowed"
                    : "pointer",
                }}
              >
                {loading
                  ? "Logging in..."
                  : "Login to Admin Portal"}
              </button>
            </form>

            {/* Back To Website */}

            <button
              onClick={() => navigate("/")}
              style={styles.backButton}
            >
              ← Back to Website
            </button>
          </>
        )}

        {/* =================================================
            FORGOT PASSWORD
        ================================================= */}

        {showForgotPassword &&
          !resetSuccess && (
            <>
              {/* =================================================
                  STEP 1 - EMAIL
              ================================================= */}

              {resetStep === 1 && (
                <>
                  <div style={styles.forgotInfo}>
                    <div style={styles.forgotIcon}>
                      <Lock
                        size={24}
                        color="#198754"
                      />
                    </div>

                    <h2 style={styles.forgotTitle}>
                      Reset Password
                    </h2>

                    <p
                      style={
                        styles.forgotDescription
                      }
                    >
                      Enter your AIMS Academy admin
                      email address. We'll send you a
                      verification code.
                    </p>
                  </div>

                  {resetError && (
                    <div style={styles.error}>
                      {resetError}
                    </div>
                  )}

                  <form onSubmit={handleSendOTP}>

                    <div style={styles.field}>
                      <label style={styles.label}>
                        Admin Email Address
                      </label>

                      <div
                        style={
                          styles.inputWrapper
                        }
                      >
                        <Mail
                          size={19}
                          color="#198754"
                          style={styles.inputIcon}
                        />

                        <input
                          type="email"
                          value={resetEmail}
                          onChange={(e) =>
                            setResetEmail(
                              e.target.value
                            )
                          }
                          placeholder="aimsacademy06@gmail.com"
                          required
                          style={styles.input}
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      style={{
                        ...styles.loginButton,
                        opacity: loading
                          ? 0.7
                          : 1,
                        cursor: loading
                          ? "not-allowed"
                          : "pointer",
                      }}
                    >
                      {loading
                        ? "Sending Code..."
                        : "Send Verification Code"}
                    </button>
                  </form>

                  <button
                    onClick={handleBackToLogin}
                    style={styles.backToLogin}
                  >
                    <ArrowLeft size={16} />
                    Back to Login
                  </button>
                </>
              )}

              {/* =================================================
                  STEP 2 - OTP
              ================================================= */}

              {resetStep === 2 && (
                <>
                  <div style={styles.forgotInfo}>
                    <div style={styles.forgotIcon}>
                      <ShieldCheck
                        size={27}
                        color="#198754"
                      />
                    </div>

                    <h2 style={styles.forgotTitle}>
                      Verify OTP
                    </h2>

                    <p
                      style={
                        styles.forgotDescription
                      }
                    >
                      We've sent a 6-digit verification
                      code to:
                    </p>

                    <p
                      style={styles.emailDisplay}
                    >
                      {resetEmail}
                    </p>
                  </div>

                  {resetError && (
                    <div style={styles.error}>
                      {resetError}
                    </div>
                  )}

                  <form onSubmit={handleVerifyOTP}>

                    <div style={styles.field}>
                      <label style={styles.label}>
                        Verification Code
                      </label>

                      <input
                        type="text"
                        inputMode="numeric"
                        maxLength={6}
                        value={otp}
                        onChange={(e) =>
                          setOtp(
                            e.target.value.replace(
                              /\D/g,
                              ""
                            )
                          )
                        }
                        placeholder="Enter 6-digit OTP"
                        autoComplete="one-time-code"
                        required
                        style={styles.otpInput}
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      style={{
                        ...styles.loginButton,
                        opacity: loading
                          ? 0.7
                          : 1,
                        cursor: loading
                          ? "not-allowed"
                          : "pointer",
                      }}
                    >
                      {loading
                        ? "Verifying..."
                        : "Verify OTP"}
                    </button>
                  </form>

                  <div style={styles.otpActions}>
                    <button
                      type="button"
                      onClick={handleResendOTP}
                      disabled={loading}
                      style={
                        styles.resendButton
                      }
                    >
                      Didn't receive the code?
                      <strong>
                        Resend OTP
                      </strong>
                    </button>

                    <button
                      type="button"
                      onClick={
                        handleBackToEmail
                      }
                      style={
                        styles.backToLogin
                      }
                    >
                      <ArrowLeft size={16} />
                      Change Email
                    </button>
                  </div>
                </>
              )}

              {/* =================================================
                  STEP 3 - NEW PASSWORD
              ================================================= */}

              {resetStep === 3 && (
                <>
                  <div style={styles.forgotInfo}>
                    <div style={styles.forgotIcon}>
                      <Lock
                        size={24}
                        color="#198754"
                      />
                    </div>

                    <h2 style={styles.forgotTitle}>
                      Create New Password
                    </h2>

                    <p
                      style={
                        styles.forgotDescription
                      }
                    >
                      Your email has been verified.
                      Create a new password for your
                      admin account.
                    </p>
                  </div>

                  {resetError && (
                    <div style={styles.error}>
                      {resetError}
                    </div>
                  )}

                  <form
                    onSubmit={
                      handleResetPassword
                    }
                  >

                    {/* New Password */}

                    <div style={styles.field}>
                      <label style={styles.label}>
                        New Password
                      </label>

                      <div
                        style={
                          styles.inputWrapper
                        }
                      >
                        <Lock
                          size={19}
                          color="#198754"
                          style={styles.inputIcon}
                        />

                        <input
                          type={
                            showNewPassword
                              ? "text"
                              : "password"
                          }
                          value={newPassword}
                          onChange={(e) =>
                            setNewPassword(
                              e.target.value
                            )
                          }
                          placeholder="Enter new password"
                          required
                          minLength={6}
                          style={
                            styles.passwordInput
                          }
                        />

                        <button
                          type="button"
                          onClick={() =>
                            setShowNewPassword(
                              !showNewPassword
                            )
                          }
                          style={
                            styles.eyeButton
                          }
                          aria-label={
                            showNewPassword
                              ? "Hide new password"
                              : "Show new password"
                          }
                        >
                          {showNewPassword ? (
                            <EyeOff
                              size={19}
                              color="#6b7280"
                            />
                          ) : (
                            <Eye
                              size={19}
                              color="#6b7280"
                            />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Confirm Password */}

                    <div style={styles.field}>
                      <label style={styles.label}>
                        Confirm New Password
                      </label>

                      <div
                        style={
                          styles.inputWrapper
                        }
                      >
                        <Lock
                          size={19}
                          color="#198754"
                          style={styles.inputIcon}
                        />

                        <input
                          type={
                            showConfirmPassword
                              ? "text"
                              : "password"
                          }
                          value={confirmPassword}
                          onChange={(e) =>
                            setConfirmPassword(
                              e.target.value
                            )
                          }
                          placeholder="Confirm new password"
                          required
                          minLength={6}
                          style={
                            styles.passwordInput
                          }
                        />

                        <button
                          type="button"
                          onClick={() =>
                            setShowConfirmPassword(
                              !showConfirmPassword
                            )
                          }
                          style={
                            styles.eyeButton
                          }
                          aria-label={
                            showConfirmPassword
                              ? "Hide password"
                              : "Show password"
                          }
                        >
                          {showConfirmPassword ? (
                            <EyeOff
                              size={19}
                              color="#6b7280"
                            />
                          ) : (
                            <Eye
                              size={19}
                              color="#6b7280"
                            />
                          )}
                        </button>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      style={{
                        ...styles.loginButton,
                        opacity: loading
                          ? 0.7
                          : 1,
                        cursor: loading
                          ? "not-allowed"
                          : "pointer",
                      }}
                    >
                      {loading
                        ? "Changing Password..."
                        : "Set New Password"}
                    </button>
                  </form>

                  <button
                    onClick={handleBackToLogin}
                    style={styles.backToLogin}
                  >
                    <ArrowLeft size={16} />
                    Back to Login
                  </button>
                </>
              )}
            </>
          )}

        {/* =================================================
            SUCCESS
        ================================================= */}

        {showForgotPassword &&
          resetSuccess && (
            <div style={styles.successContainer}>
              <div style={styles.successIcon}>
                <CheckCircle2
                  size={42}
                  color="#198754"
                />
              </div>

              <h2 style={styles.successTitle}>
                Password Changed Successfully
              </h2>

              <p
                style={
                  styles.successDescription
                }
              >
                Your AIMS Academy Admin Portal
                password has been successfully
                changed.
              </p>

              <p style={styles.successNote}>
                You can now login using your new
                password.
              </p>

              <button
                onClick={handleBackToLogin}
                style={styles.loginButton}
              >
                Back to Login
              </button>
            </div>
          )}
      </div>
    </div>
  );
}

// =========================================================
// STYLES
// =========================================================

const styles = {
  page: {
    minHeight: "100vh",
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "30px 20px",
    boxSizing: "border-box",
    background:
      "linear-gradient(135deg, #f4f8f5 0%, #e8f1eb 100%)",
    fontFamily:
      "Arial, Helvetica, sans-serif",
  },

  card: {
    width: "100%",
    maxWidth: "430px",
    backgroundColor: "#ffffff",
    borderRadius: "18px",
    padding: "40px",
    boxSizing: "border-box",
    boxShadow:
      "0 15px 45px rgba(25, 80, 50, 0.12)",
    border: "1px solid #dce8df",
  },

  header: {
    textAlign: "center",
    marginBottom: "30px",
  },

  logoCircle: {
    width: "64px",
    height: "64px",
    margin: "0 auto 18px",
    borderRadius: "50%",
    background:
      "linear-gradient(135deg, #198754, #146c43)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow:
      "0 8px 20px rgba(25, 135, 84, 0.25)",
  },

  title: {
    margin: "0",
    fontSize: "30px",
    fontWeight: "700",
    color: "#1f2937",
  },

  subtitle: {
    margin: "7px 0 0",
    fontSize: "17px",
    fontWeight: "600",
    color: "#198754",
  },

  divider: {
    width: "55px",
    height: "3px",
    backgroundColor: "#198754",
    borderRadius: "5px",
    margin: "18px auto 15px",
  },

  welcome: {
    margin: "0",
    fontSize: "14px",
    color: "#6b7280",
    lineHeight: "1.5",
  },

  error: {
    backgroundColor: "#fef2f2",
    color: "#dc2626",
    border: "1px solid #fecaca",
    borderRadius: "8px",
    padding: "12px 14px",
    marginBottom: "20px",
    fontSize: "14px",
    lineHeight: "1.5",
  },

  field: {
    marginBottom: "20px",
  },

  label: {
    display: "block",
    marginBottom: "8px",
    fontSize: "14px",
    fontWeight: "600",
    color: "#374151",
  },

  inputWrapper: {
    position: "relative",
    width: "100%",
  },

  inputIcon: {
    position: "absolute",
    left: "14px",
    top: "50%",
    transform: "translateY(-50%)",
    pointerEvents: "none",
  },

  input: {
    width: "100%",
    height: "48px",
    boxSizing: "border-box",
    padding: "0 14px 0 44px",
    border: "1px solid #d1d5db",
    borderRadius: "9px",
    outline: "none",
    fontSize: "14px",
    color: "#1f2937",
    backgroundColor: "#ffffff",
  },

  passwordInput: {
    width: "100%",
    height: "48px",
    boxSizing: "border-box",
    padding: "0 45px 0 44px",
    border: "1px solid #d1d5db",
    borderRadius: "9px",
    outline: "none",
    fontSize: "14px",
    color: "#1f2937",
    backgroundColor: "#ffffff",
  },

  otpInput: {
    width: "100%",
    height: "58px",
    boxSizing: "border-box",
    padding: "0 15px",
    border: "1px solid #d1d5db",
    borderRadius: "9px",
    outline: "none",
    fontSize: "26px",
    fontWeight: "700",
    letterSpacing: "8px",
    textAlign: "center",
    color: "#1f2937",
    backgroundColor: "#ffffff",
  },

  eyeButton: {
    position: "absolute",
    right: "13px",
    top: "50%",
    transform: "translateY(-50%)",
    border: "none",
    background: "transparent",
    cursor: "pointer",
    padding: "4px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  forgotRow: {
    display: "flex",
    justifyContent: "flex-end",
    marginTop: "-7px",
    marginBottom: "18px",
  },

  forgotButton: {
    border: "none",
    background: "transparent",
    color: "#198754",
    fontSize: "13px",
    fontWeight: "600",
    cursor: "pointer",
    padding: "4px 0",
  },

  forgotInfo: {
    textAlign: "center",
    marginBottom: "25px",
  },

  forgotIcon: {
    width: "54px",
    height: "54px",
    margin: "0 auto 14px",
    borderRadius: "50%",
    backgroundColor: "#e9f7ef",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  forgotTitle: {
    margin: "0 0 8px",
    fontSize: "22px",
    fontWeight: "700",
    color: "#1f2937",
  },

  forgotDescription: {
    margin: "0 auto",
    maxWidth: "340px",
    fontSize: "13px",
    lineHeight: "1.6",
    color: "#6b7280",
  },

  emailDisplay: {
    margin: "8px 0 0",
    fontSize: "14px",
    fontWeight: "700",
    color: "#198754",
    wordBreak: "break-word",
  },

  loginButton: {
    width: "100%",
    height: "49px",
    marginTop: "5px",
    border: "none",
    borderRadius: "9px",
    background:
      "linear-gradient(135deg, #198754, #146c43)",
    color: "#ffffff",
    fontSize: "15px",
    fontWeight: "600",
    boxShadow:
      "0 6px 15px rgba(25, 135, 84, 0.25)",
  },

  backButton: {
    width: "100%",
    marginTop: "22px",
    border: "none",
    background: "transparent",
    color: "#198754",
    fontSize: "14px",
    cursor: "pointer",
    padding: "8px",
  },

  backToLogin: {
    width: "100%",
    marginTop: "18px",
    border: "none",
    background: "transparent",
    color: "#198754",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    padding: "8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "6px",
  },

  otpActions: {
    marginTop: "16px",
    textAlign: "center",
  },

  resendButton: {
    border: "none",
    background: "transparent",
    color: "#6b7280",
    fontSize: "13px",
    cursor: "pointer",
    padding: "5px",
    display: "inline-flex",
    alignItems: "center",
    gap: "5px",
    flexWrap: "wrap",
    justifyContent: "center",
  },

  successContainer: {
    textAlign: "center",
    padding: "15px 0 5px",
  },

  successIcon: {
    width: "72px",
    height: "72px",
    margin: "0 auto 20px",
    borderRadius: "50%",
    backgroundColor: "#e9f7ef",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  successTitle: {
    margin: "0 0 10px",
    fontSize: "22px",
    fontWeight: "700",
    color: "#1f2937",
  },

  successDescription: {
    margin: "0 auto 10px",
    maxWidth: "330px",
    fontSize: "14px",
    lineHeight: "1.6",
    color: "#6b7280",
  },

  successNote: {
    margin: "0 0 25px",
    fontSize: "13px",
    color: "#198754",
    fontWeight: "600",
  },
};

export default AdminLogin;