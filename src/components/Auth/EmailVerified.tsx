import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";

export const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<"verifying" | "success" | "error">(
    "verifying"
  );

  useEffect(() => {
    const verifyEmail = async () => {
      const token = searchParams.get("token");
      if (!token) {
        setStatus("error");
        return;
      }

      try {
        interface VerifyEmailResponse {
          message: string;
        }
        const res = await axios.get<VerifyEmailResponse>(
          `${import.meta.env.VITE_API_URL}/auth/verify-email?token=${token}`
        );

        if (
          res.status === 200 &&
          (res.data.message === "Email verified successfully" ||
            res.data.message === "Already verified")
        ) {
          setStatus("success");
        } else {
          setStatus("error");
        }
      } catch (err: any) {
        console.error(err);
        // ✅ Handle "Already verified" from error response as well
        if (err.response?.data?.message === "Already verified") {
          setStatus("success");
          setTimeout(() => navigate("/login"), 3000);
        } else {
          setStatus("error");
        }
      }
    };

    verifyEmail();
  }, [searchParams, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen w-screen bg-gradient-to-br from-blue-200 via-white to-blue-100">
      <div
        className="xs:w-[95%] xs:max-w-[360px] xxs:max-w-[400px] sm:max-w-[450px] md:max-w-[550px]
       xs:p-6 md:py-16 text-center bg-white shadow-xl rounded-2xl border border-gray-100"
      >
        {status === "verifying" && (
          <>
            <h2 className="text-xl font-semibold text-gray-800">
              Verifying your email...
            </h2>
            <p className="mt-2 text-gray-500">
              Please wait while we confirm your email.
            </p>
          </>
        )}

        {status === "success" && (
          <>
            <div className="flex justify-center mb-4">
              <FaCheckCircle className="xs:text-6xl xxs:text-7xl md:text-8xl text-blue-500 " />
            </div>
            <h2 className="text-xl font-semibold text-gray-800">Verified!</h2>
            <p className="mt-2 text-gray-600">
              You have successfully verified your account.
            </p>
            <button
              className="mt-6 xs:px-6 md:px-8 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors"
              onClick={() => navigate("/login")}
            >
              Ok
            </button>
          </>
        )}

        {status === "error" && (
          <>
            <div className="flex justify-center mb-4">
              <FaTimesCircle className="xs:text-6xl xxs:text-7xl md:text-8xl text-red-600 " />
            </div>
            <h2 className="text-xl font-semibold text-red-600">
              Verification Failed
            </h2>
            <p className="mt-2 text-gray-600">
              The verification link is invalid or expired. Please request a new
              one.
            </p>
            <button
              className="mt-6 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              onClick={() => navigate("/register")}
            >
              Request New Link
            </button>
          </>
        )}
      </div>
    </div>
  );
};
