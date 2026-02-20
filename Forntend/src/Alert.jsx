import Alert from "@mui/material/Alert";

export default function AppAlert({ message, severity  }) {
  if (!message) return null;

  return (
    <Alert variant="filled" severity={severity} sx={{ mb: 2 }}>
      {message}
    </Alert>
  );
}
