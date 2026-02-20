
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./PropertyDetails/AuthContext";
export default function VerifyEmail() {
    const{checkAuth}= useAuth()
    const navigate = useNavigate()
  const { token } = useParams();
  console.log(token)
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    const verify = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/auth/verify-email/${token}`,
          { method: "POST",
            credentials: "include"
           }
        );

        const data = await res.json();

        if (data.success) {
          setStatus("success");
          await checkAuth();
          navigate("/")
        } else {
          setStatus("error");
        }
      } catch {
        setStatus("error");
      }
    };

    verify();
  }, [token]);

  if (status === "loading") return <h2>Verifying...</h2>;
  if (status === "success") return <h2>✅ Email verified successfully</h2>;
  return <h2>❌ Invalid or expired link</h2>;
}
