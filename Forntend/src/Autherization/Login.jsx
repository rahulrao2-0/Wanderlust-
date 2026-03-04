import "./Signup.css";
import "./Login.css";

import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";

import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";

import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

import Navbar from "../Home/Navbar";
import { useAuth } from "../PropertyDetails/AuthContext";

export default function Login() {

  const navigate = useNavigate();
  const { checkAuth } = useAuth();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [loginData, setLoginData] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",   // ✅ default role
  });

  // Handle role change
  const handleRoleChange = (role) => {
    console.log("Selected Role:", role); // Debugging line
    setLoginData((prev) => ({
      ...prev,
      role,
    }));
  };

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle login
  const handleLogin = async (e) => {
    e.preventDefault();

    if (!loginData.name || !loginData.email || !loginData.password) {
      setError("All fields are required!");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch("https://wanderlust-cpfz.onrender.com/api/auth/login", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginData),
      });

      const result = await response.json();
      console.log(result);
      if(response.status === 401){
        setError("Invalid credentials. Please try again.");
        setIsSubmitting(false);
        return;
      }

      if (result.success) {
        await checkAuth();
        navigate("/", { replace: true });
      } else {
        setError(result.message);
      }

      // Reset form
      setLoginData({
        name: "",
        email: "",
        password: "",
        role: "user",
      });

    } catch (err) {
      console.error(err);
      setError("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />
      <br /><br /><br />

      <Box
        component="form"
        onSubmit={handleLogin}
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
          value={loginData.name}
          onChange={handleInputChange}
        />

        <TextField
          required
          label="Email"
          name="email"
          type="email"
          variant="standard"
          fullWidth
          value={loginData.email}
          onChange={handleInputChange}
          sx={{ mt: 2 }}
        />

        <TextField
          required
          label="Password"
          name="password"
          type={showPassword ? "text" : "password"}
          variant="standard"
          fullWidth
          value={loginData.password}
          onChange={handleInputChange}
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

        {/* ROLE SELECTION */}
        <FormLabel sx={{ mt: 3, display: "block" }}>
          Login as
        </FormLabel>

        <RadioGroup
          value={loginData.role}
          onChange={(e) => handleRoleChange(e.target.value)}
        >
          <FormControlLabel value="user" control={<Radio />} label="User" />
          <FormControlLabel value="host" control={<Radio />} label="Host" />
          <FormControlLabel value="admin" control={<Radio />} label="Admin" />
        </RadioGroup>

        <Button
          type="submit"
          variant="contained"
          color="success"
          fullWidth
          sx={{ mt: 3 }}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Logging..." : "Log-In"}
        </Button>

      </Box>
    </>
  );
}