import {
  Box, Typography, Paper, TextField, Button,
  Divider, Avatar, InputAdornment, IconButton,
} from "@mui/material";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import LockRoundedIcon from "@mui/icons-material/LockRounded";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import VisibilityOffRoundedIcon from "@mui/icons-material/VisibilityOffRounded";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import { useState } from "react";
import { useAuth } from "../PropertyDetails/AuthContext";
import { useNavigate } from "react-router-dom";

const RED      = "#c0392b";
const RED_DARK = "#a93226";
const RED_BG   = "#fdf1f0";
const GOLD     = "#b8963e";
const BORDER   = "rgba(0,0,0,0.07)";
const SURFACE  = "#ffffff";
const PAGE_BG  = "#f6f5f2";

function SectionCard({ icon, title, subtitle, children }) {
  return (
    <Paper elevation={0} sx={{
      borderRadius: "16px", border: `1px solid ${BORDER}`,
      bgcolor: SURFACE, overflow: "hidden", mb: 2.5,
    }}>
      {/* Card header */}
      <Box sx={{
        px: 3, py: 2.5, borderBottom: `1px solid ${BORDER}`,
        display: "flex", alignItems: "center", gap: 1.5,
      }}>
        <Box sx={{
          width: 36, height: 36, borderRadius: "9px",
          bgcolor: RED_BG, display: "flex", alignItems: "center",
          justifyContent: "center", color: RED,
        }}>
          {icon}
        </Box>
        <Box>
          <Typography sx={{ fontFamily: "'Georgia', serif", fontSize: 16, fontWeight: 400 }}>{title}</Typography>
          {subtitle && <Typography sx={{ fontSize: 12, color: "text.disabled", mt: 0.2 }}>{subtitle}</Typography>}
        </Box>
      </Box>
      <Box sx={{ p: 3 }}>{children}</Box>
    </Paper>
  );
}

function LuxField({ label, ...props }) {
  return (
    <Box sx={{ mb: 2.5 }}>
      <Typography sx={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "text.disabled", mb: 0.8 }}>
        {label}
      </Typography>
      <TextField
        fullWidth
        size="small"
        variant="outlined"
        {...props}
        sx={{
          "& .MuiOutlinedInput-root": {
            borderRadius: "9px", fontSize: 14, bgcolor: PAGE_BG,
            "& fieldset": { borderColor: BORDER },
            "&:hover fieldset": { borderColor: "rgba(0,0,0,0.18)" },
            "&.Mui-focused fieldset": { borderColor: RED, borderWidth: 1.5 },
            "&.Mui-disabled": { bgcolor: "rgba(0,0,0,0.02)" },
          },
          "& .MuiInputBase-input.Mui-disabled": { WebkitTextFillColor: "rgba(0,0,0,0.4)" },
          ...props.sx,
        }}
      />
    </Box>
  );
}

export default function Settings() {
  const { user, checkAuth } = useAuth();
  const navigate = useNavigate();
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew]         = useState(false);

  const handleDelete = async () => {
    const confirm = window.confirm("Are you sure you want to delete your account? This action cannot be undone.");
    if (confirm) {
      try {
        const result = await fetch("http://localhost:5000/api/deleteAccount", { method: "DELETE", credentials: "include" });
        const res = await result.json();
        if (res) { await checkAuth(); navigate("/"); }
      } catch (err) {
        console.log(err);
      }
    }
  };

  const initial = user?.name?.[0]?.toUpperCase() || "U";

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: PAGE_BG, py: 4, px: { xs: 2, sm: 3, md: 6 } }}>
      <Box sx={{ maxWidth: 640, mx: "auto" }}>

        {/* Page heading */}
        <Box sx={{ mb: 4, display: "flex", alignItems: "center", gap: 2 }}>
          <Avatar sx={{ width: 52, height: 52, bgcolor: RED, fontSize: 22, fontWeight: 700 }}>{initial}</Avatar>
          <Box>
            <Typography sx={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", color: GOLD, mb: 0.3 }}>
              Configuration
            </Typography>
            <Typography sx={{ fontFamily: "'Georgia', serif", fontSize: 24, fontWeight: 400 }}>
              Account <Box component="em" sx={{ fontStyle: "italic", color: RED }}>Settings</Box>
            </Typography>
          </Box>
        </Box>

        {/* ── Profile ── */}
        <SectionCard
          icon={<PersonRoundedIcon fontSize="small" />}
          title="Profile"
          subtitle="Update your display name and contact info"
        >
          <LuxField label="Full Name" defaultValue={user?.name} placeholder="Your full name" />
          <LuxField label="Email Address" defaultValue={user?.email} type="email" disabled />
          <Button
            startIcon={<SaveRoundedIcon sx={{ fontSize: 16 }} />}
            variant="contained"
            sx={{
              bgcolor: RED, borderRadius: "9px", textTransform: "none",
              fontWeight: 600, fontSize: 13, px: 3, py: 1.1,
              boxShadow: "none", "&:hover": { bgcolor: RED_DARK, boxShadow: "none" },
            }}
          >
            Save Changes
          </Button>
        </SectionCard>

        {/* ── Password ── */}
        <SectionCard
          icon={<LockRoundedIcon fontSize="small" />}
          title="Change Password"
          subtitle="Choose a strong, unique password"
        >
          <LuxField
            label="Current Password"
            type={showCurrent ? "text" : "password"}
            placeholder="••••••••"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton size="small" onClick={() => setShowCurrent((p) => !p)} edge="end">
                    {showCurrent ? <VisibilityOffRoundedIcon sx={{ fontSize: 18 }} /> : <VisibilityRoundedIcon sx={{ fontSize: 18 }} />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <LuxField
            label="New Password"
            type={showNew ? "text" : "password"}
            placeholder="••••••••"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton size="small" onClick={() => setShowNew((p) => !p)} edge="end">
                    {showNew ? <VisibilityOffRoundedIcon sx={{ fontSize: 18 }} /> : <VisibilityRoundedIcon sx={{ fontSize: 18 }} />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Button
            startIcon={<LockRoundedIcon sx={{ fontSize: 16 }} />}
            variant="contained"
            sx={{
              bgcolor: RED, borderRadius: "9px", textTransform: "none",
              fontWeight: 600, fontSize: 13, px: 3, py: 1.1,
              boxShadow: "none", "&:hover": { bgcolor: RED_DARK, boxShadow: "none" },
            }}
          >
            Update Password
          </Button>
        </SectionCard>

        {/* ── Danger zone ── */}
        <Paper elevation={0} sx={{
          borderRadius: "16px", border: "1px solid rgba(192,57,43,0.25)",
          bgcolor: SURFACE, overflow: "hidden",
        }}>
          <Box sx={{
            px: 3, py: 2.5, borderBottom: "1px solid rgba(192,57,43,0.15)",
            display: "flex", alignItems: "center", gap: 1.5,
            bgcolor: "rgba(253,241,240,0.5)",
          }}>
            <Box sx={{ width: 36, height: 36, borderRadius: "9px", bgcolor: RED_BG, display: "flex", alignItems: "center", justifyContent: "center", color: RED }}>
              <WarningAmberRoundedIcon fontSize="small" />
            </Box>
            <Box>
              <Typography sx={{ fontFamily: "'Georgia', serif", fontSize: 16, fontWeight: 400, color: RED }}>Danger Zone</Typography>
              <Typography sx={{ fontSize: 12, color: "text.disabled", mt: 0.2 }}>Irreversible and destructive actions</Typography>
            </Box>
          </Box>

          <Box sx={{ p: 3 }}>
            <Box sx={{
              p: 2.5, borderRadius: "10px",
              border: "1px solid rgba(192,57,43,0.15)",
              bgcolor: "rgba(253,241,240,0.4)",
              display: "flex", alignItems: "center", justifyContent: "space-between", gap: 2,
              flexWrap: "wrap",
            }}>
              <Box>
                <Typography sx={{ fontSize: 14, fontWeight: 600, color: "text.primary", mb: 0.3 }}>Delete your account</Typography>
                <Typography sx={{ fontSize: 12.5, color: "text.secondary" }}>
                  Once deleted, all your data, listings and bookings will be permanently removed.
                </Typography>
              </Box>
              <Button
                onClick={handleDelete}
                variant="contained"
                sx={{
                  bgcolor: RED, borderRadius: "9px", textTransform: "none",
                  fontWeight: 600, fontSize: 13, px: 2.5, py: 1,
                  boxShadow: "none", whiteSpace: "nowrap",
                  "&:hover": { bgcolor: RED_DARK, boxShadow: "none" },
                }}
              >
                Delete Account
              </Button>
            </Box>
          </Box>
        </Paper>

      </Box>
    </Box>
  );
}