import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  TextField,
  Button,
  Typography,
  Grid,
  Paper,
  Container,
  InputAdornment,
  Divider,
  Avatar
} from "@mui/material";
import {
  Person,
  Phone,
  Email,
  Public,
  LocationCity,
  Home,
  CloudUpload
} from "@mui/icons-material";
import Alert from '@mui/material/Alert';
import AppAlert from "./Alert";
import { useAuth } from "./PropertyDetails/AuthContext";

export default function Host() {
    const navigate = useNavigate();
    const[error,setError] = useState(null)
    const[success,setSuccess]=useState(null)
    const{checkAuth} = useAuth()
  const [formData, setFormData] = useState({
    name: "",
    contactNo: "",
    email: "",
    country: "",
    state: "",
    address: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    console.log("Host Data:", formData);
    try{
        const result = await fetch("http://localhost:5000/api/host",{
            method:"POST",
            credentials:"include",
             headers: { "Content-Type": "application/json" },
             body: JSON.stringify(formData),
          })
           const data = await result.json();
           console.log(data);
           if(result.status===401){
            alert("please login to become a host")
            navigate("/login");
            return;
           }
           if(result.status===400){
            alert(data.error)
            navigate("/");
           }
           if(data.success){
            alert("Host Created Succesfully")
            await checkAuth();
            navigate("/")
           }
    }catch(err){

    }
  };

  return (
    <>
    <AppAlert message={error} severity ="error"/>
      {/* form UI */}
    
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        py: 4,
      }}
    >
      <Container maxWidth="md">
        <Paper
          elevation={24}
          sx={{
            borderRadius: 4,
            overflow: "hidden",
            backgroundColor: "#ffffff",
          }}
        >
          {/* Header Section */}
          <Box
            sx={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              p: 4,
              textAlign: "center",
              color: "white",
            }}
          >
            <Avatar
              sx={{
                width: 80,
                height: 80,
                margin: "0 auto",
                mb: 2,
                backgroundColor: "rgba(255,255,255,0.2)",
                backdropFilter: "blur(10px)",
              }}
            >
              <Person sx={{ fontSize: 40 }} />
            </Avatar>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              Become a Host
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.9 }}>
              Share your space with travelers from around the world
            </Typography>
          </Box>

          {/* Form Section */}
          <Box component="form" onSubmit={handleSubmit} sx={{ p: 4 }}>
            <Typography
              variant="h6"
              fontWeight="600"
              mb={3}
              color="text.primary"
            >
              Personal Information
            </Typography>

            <Grid container spacing={3}>
              {/* Full Name */}
              <Grid item xs={12}>
                <TextField
                  label="Full Name"
                  name="name"
                  fullWidth
                  required
                  value={formData.name}
                  onChange={handleChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person sx={{ color: "#667eea" }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "&:hover fieldset": {
                        borderColor: "#667eea",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#667eea",
                      },
                    },
                    "& .MuiInputLabel-root.Mui-focused": {
                      color: "#667eea",
                    },
                  }}
                />
              </Grid>

              {/* Contact Number */}
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Contact Number"
                  name="contactNo"
                  type="tel"
                  fullWidth
                  required
                  value={formData.contactNo}
                  onChange={handleChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Phone sx={{ color: "#667eea" }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "&:hover fieldset": {
                        borderColor: "#667eea",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#667eea",
                      },
                    },
                    "& .MuiInputLabel-root.Mui-focused": {
                      color: "#667eea",
                    },
                  }}
                />
              </Grid>

              {/* Email */}
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Email Address"
                  name="email"
                  type="email"
                  fullWidth
                  required
                  value={formData.email}
                  onChange={handleChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email sx={{ color: "#667eea" }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "&:hover fieldset": {
                        borderColor: "#667eea",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#667eea",
                      },
                    },
                    "& .MuiInputLabel-root.Mui-focused": {
                      color: "#667eea",
                    },
                  }}
                />
              </Grid>
            </Grid>

            <Divider sx={{ my: 4 }} />

            <Typography
              variant="h6"
              fontWeight="600"
              mb={3}
              color="text.primary"
            >
              Location Details
            </Typography>

            <Grid container spacing={3}>
              {/* Country */}
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Country"
                  name="country"
                  fullWidth
                  required
                  value={formData.country}
                  onChange={handleChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Public sx={{ color: "#667eea" }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "&:hover fieldset": {
                        borderColor: "#667eea",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#667eea",
                      },
                    },
                    "& .MuiInputLabel-root.Mui-focused": {
                      color: "#667eea",
                    },
                  }}
                />
              </Grid>

              {/* State */}
              <Grid item xs={12} sm={6}>
                <TextField
                  label="State"
                  name="state"
                  fullWidth
                  required
                  value={formData.state}
                  onChange={handleChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LocationCity sx={{ color: "#667eea" }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "&:hover fieldset": {
                        borderColor: "#667eea",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#667eea",
                      },
                    },
                    "& .MuiInputLabel-root.Mui-focused": {
                      color: "#667eea",
                    },
                  }}
                />
              </Grid>

              {/* Address */}
              <Grid item xs={12}>
                <TextField
                  label="Full Address"
                  name="address"
                  fullWidth
                  multiline
                  rows={4}
                  required
                  value={formData.address}
                  onChange={handleChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start" sx={{ alignSelf: "flex-start", mt: 2 }}>
                        <Home sx={{ color: "#667eea" }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "&:hover fieldset": {
                        borderColor: "#667eea",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#667eea",
                      },
                    },
                    "& .MuiInputLabel-root.Mui-focused": {
                      color: "#667eea",
                    },
                  }}
                />
              </Grid>
            </Grid>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              startIcon={<CloudUpload />}
              sx={{
                mt: 4,
                py: 1.5,
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                fontSize: "1rem",
                fontWeight: "bold",
                textTransform: "none",
                borderRadius: 2,
                boxShadow: "0 4px 15px rgba(102, 126, 234, 0.4)",
                transition: "all 0.3s ease",
                "&:hover": {
                  background: "linear-gradient(135deg, #764ba2 0%, #667eea 100%)",
                  boxShadow: "0 6px 20px rgba(102, 126, 234, 0.6)",
                  transform: "translateY(-2px)",
                },
              }}
            >
              Save Host Details
            </Button>

            <Typography
              variant="body2"
              color="text.secondary"
              align="center"
              sx={{ mt: 3 }}
            >
              By submitting, you agree to our Terms of Service and Privacy Policy
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
    </>
  );
}