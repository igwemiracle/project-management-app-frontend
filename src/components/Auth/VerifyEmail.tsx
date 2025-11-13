import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";

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
          `${import.meta.env.VITE_API_URL}/verify-email?token=${token}`
        );

        if (
          res.status === 200 &&
          (res.data.message === "Email verified successfully" ||
            res.data.message === "Already verified")
        ) {
          setStatus("success");

          // ⏳ Delay redirect to login
          setTimeout(() => navigate("/login"), 3000);
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
    <div className="flex items-center justify-center min-h-screen p-4 bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="w-full max-w-md p-8 text-center bg-white shadow-lg rounded-2xl">
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
            <h2 className="text-xl font-semibold text-green-600">
              Email Verified!
            </h2>
            <p className="mt-2 text-gray-600">
              Your email has been successfully verified. Redirecting to login...
            </p>
          </>
        )}

        {status === "error" && (
          <>
            <h2 className="text-xl font-semibold text-red-600">
              Verification Failed
            </h2>
            <p className="mt-2 text-gray-600">
              The verification link is invalid or expired. Please request a new
              one.
            </p>
          </>
        )}
      </div>
    </div>
  );
};
