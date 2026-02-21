import "./Signup.css";
import { useState } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";
import { useAuth } from "../PropertyDetails/AuthContext";
import "./Login.css"
import Navbar from "../Home/Navbar";  
export default function Login() {
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { user, setUser ,checkAuth } = useAuth()

  const [signupData, setSignupData] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
  });
  const handleRoleChange = (role) => {
    setSignupData((prev) => ({
      ...prev,
      role,
    }));
  };

  // Handle input change
  const handleSignupData = (e) => {
    const { name, value } = e.target;
    setSignupData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle signup
  const handleSignup = async (e) => {
    e.preventDefault();

    if (!signupData.name || !signupData.email || !signupData.password) {
      setError("All fields are required!");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(signupData),
      });

      const result = await response.json();
      console.log(result);
      console.log(result.user)
      if (result.success) {
        await checkAuth()
        navigate("/")
      } else {
        return setError(result.message)
      }



      // Reset form
      setSignupData({
        name: "",
        email: "",
        password: "",
        role: "user",
      });
    }
    catch (err) {
      console.error(err);
      setError("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
    <Navbar />
    <br />
    <br />
    <br />
    <Box
      component="form"
      onSubmit={handleSignup}
      sx={{
        width: 350,
        margin: "50px auto",
        padding: 4,
        boxShadow: 3,
        borderRadius: 2,
        backgroundColor: "background.paper",
      }}
      noValidate
    >
      <Typography variant="h5" textAlign="center" mb={2}>
        Log-In
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <TextField
        required
        label="Username"
        name="name"
        variant="standard"
        fullWidth
        value={signupData.name}
        onChange={handleSignupData}
      />

      <TextField
        required
        label="Email"
        name="email"
        type="email"
        variant="standard"
        fullWidth
        value={signupData.email}
        onChange={handleSignupData}
        sx={{ mt: 2 }}
      />

      <TextField
        required
        label="Password"
        name="password"
        type={showPassword ? "text" : "password"}
        variant="standard"
        fullWidth
        value={signupData.password}
        onChange={handleSignupData}
        sx={{ mt: 2 }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                onClick={() => setShowPassword((prev) => !prev)}
                edge="end"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
      {/* ROLE CHECKBOXES */}
      <FormLabel sx={{ mt: 3, display: "block" }}>Register as</FormLabel>

      <FormControlLabel
        control={
          <Checkbox
            checked={signupData.role === "user"}
            onChange={() => handleRoleChange("user")}
          />
        }
        label="User"
      />

      <FormControlLabel
        control={
          <Checkbox
            checked={signupData.role === "host"}
            onChange={() => handleRoleChange("host")}
          />
        }
        label="Host"
      />

      <Button
        type="submit"
        variant="contained"
        color="success"
        fullWidth
        sx={{ mt: 3 }}
        disabled={isSubmitting}
      >
        {isSubmitting ? "Logging...." : "Log-In"}
      </Button>
    </Box>
    </>
  );
}
