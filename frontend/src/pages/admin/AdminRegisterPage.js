import React, { useEffect, useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
  Box,
  Typography,
  Paper,
  Checkbox,
  FormControlLabel,
  TextField,
  CssBaseline,
  IconButton,
  InputAdornment,
  CircularProgress,
  Backdrop,
} from "@mui/material";

import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Visibility, VisibilityOff } from "@mui/icons-material";

import bgpic from "../../assets/designlogin.jpg";
import { registerUser } from "../../redux/userRelated/userHandle";
import Popup from "../../components/Popup";

/* ================= THEME CONFIG (SMALL SCALE) ================= */

const getDesignTokens = (mode) => ({
  palette: {
    mode,
    ...(mode === "light"
      ? {
          background: {
            default: "#f3e8ff",
            paper: "#ffffff",
          },
        }
      : {
          background: {
            default: "#0f172a",
            paper: "#1e293b",
          },
        }),
  },

  typography: {
    fontSize: 13,
    h4: {
      fontSize: "1.6rem",
      fontWeight: 600,
    },
    body2: {
      fontSize: "0.8rem",
    },
  },

  components: {
    MuiTextField: {
      defaultProps: {
        size: "small",
      },
    },
    MuiButton: {
      defaultProps: {
        size: "small",
      },
    },
  },
});

const AdminRegisterPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { status, currentUser, response, error, currentRole } =
    useSelector((state) => state.user);

  const [toggle, setToggle] = useState(false);
  const [loader, setLoader] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");

  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [adminNameError, setAdminNameError] = useState(false);
  const [schoolNameError, setSchoolNameError] = useState(false);

  const role = "Admin";

  /* ================= THEME STATE ================= */

  const [mode, setMode] = useState(
    localStorage.getItem("themeMode") || "light"
  );

  const theme = useMemo(() => createTheme(getDesignTokens(mode)), [mode]);

  const toggleTheme = () => {
    const newMode = mode === "light" ? "dark" : "light";
    setMode(newMode);
    localStorage.setItem("themeMode", newMode);
  };

  /* ================= FORM SUBMIT ================= */

  const handleSubmit = (event) => {
    event.preventDefault();

    const name = event.target.adminName.value;
    const schoolName = event.target.schoolName.value;
    const email = event.target.email.value;
    const password = event.target.password.value;

    if (!name || !schoolName || !email || !password) {
      if (!name) setAdminNameError(true);
      if (!schoolName) setSchoolNameError(true);
      if (!email) setEmailError(true);
      if (!password) setPasswordError(true);
      return;
    }

    const fields = { name, email, password, role, schoolName };
    setLoader(true);
    dispatch(registerUser(fields, role));
  };

  const handleInputChange = (event) => {
    const { name } = event.target;
    if (name === "email") setEmailError(false);
    if (name === "password") setPasswordError(false);
    if (name === "adminName") setAdminNameError(false);
    if (name === "schoolName") setSchoolNameError(false);
  };

  useEffect(() => {
    if (status === "success" || (currentUser && currentRole === "Admin")) {
      navigate("/Admin/dashboard");
    } else if (status === "failed") {
      setMessage(response);
      setShowPopup(true);
      setLoader(false);
    } else if (status === "error") {
      console.log(error);
    }
  }, [status, currentUser, currentRole, navigate, error, response]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background:
            mode === "light"
              ? "linear-gradient(135deg,#e9d5ff,#f3e8ff)"
              : "linear-gradient(135deg,#0f172a,#1e293b)",
          transition: "0.3s ease",
        }}
      >
        {/* THEME TOGGLE */}
        <IconButton
          onClick={toggleTheme}
          sx={{
            position: "absolute",
            top: 16,
            right: 16,
            backgroundColor: mode === "light" ? "#fff" : "#1e293b",
            boxShadow: 2,
            transform: "scale(0.9)",
          }}
        >
          {mode === "light" ? "🌙" : "☀️"}
        </IconButton>

        <Paper
          elevation={8}
          sx={{
            width: "780px",
            maxWidth: "92%",
            height: "500px",
            display: "flex",
            borderRadius: "16px",
            overflow: "hidden",
            backgroundColor: theme.palette.background.paper,
            transition: "0.3s ease",
          }}
        >
          {/* LEFT FORM */}
          <Box
            sx={{
              width: { xs: "100%", md: "50%" },
              p: 4,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <Typography variant="h4" gutterBottom>
              Admin Register
            </Typography>

            <Typography variant="body2" color="text.secondary" mb={2}>
              Create your school and manage students & faculty.
            </Typography>

            <Box component="form" onSubmit={handleSubmit}>
              <TextField
                fullWidth
                margin="dense"
                label="Your Name"
                name="adminName"
                error={adminNameError}
                helperText={adminNameError && "Name is required"}
                onChange={handleInputChange}
              />

              <TextField
                fullWidth
                margin="dense"
                label="School Name"
                name="schoolName"
                error={schoolNameError}
                helperText={schoolNameError && "School name is required"}
                onChange={handleInputChange}
              />

              <TextField
                fullWidth
                margin="dense"
                label="Email"
                name="email"
                error={emailError}
                helperText={emailError && "Email is required"}
                onChange={handleInputChange}
              />

              <TextField
                fullWidth
                margin="dense"
                label="Password"
                name="password"
                type={toggle ? "text" : "password"}
                error={passwordError}
                helperText={passwordError && "Password is required"}
                onChange={handleInputChange}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        size="small"
                        onClick={() => setToggle(!toggle)}
                      >
                        {toggle ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <FormControlLabel
                control={<Checkbox size="small" />}
                label="Remember me"
              />

              <Box mt={2}>
                <Box
                  component="button"
                  type="submit"
                  style={{
                    width: "100%",
                    padding: "8px",
                    borderRadius: "6px",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "0.9rem",
                    background:
                      mode === "light"
                        ? "linear-gradient(90deg,#a855f7,#9333ea)"
                        : "linear-gradient(90deg,#7c3aed,#4c1d95)",
                    color: "white",
                    fontWeight: 600,
                  }}
                >
                  {loader ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : (
                    "Register"
                  )}
                </Box>
              </Box>

              <Typography mt={2} fontSize="0.85rem">
                Already have an account?{" "}
                <Link to="/Adminlogin" style={{ color: "#7f56da" }}>
                  Log in
                </Link>
              </Typography>
            </Box>
          </Box>

          {/* RIGHT IMAGE */}
          <Box
            sx={{
              width: "50%",
              display: { xs: "none", md: "block" },
              background:
                mode === "light"
                  ? "linear-gradient(135deg,#c084fc,#9333ea)"
                  : "linear-gradient(135deg,#4c1d95,#1e1b4b)",
            }}
          >
            <Box
              component="img"
              src={bgpic}
              alt="register"
              sx={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                mixBlendMode: "multiply",
                opacity: 0.9,
              }}
            />
          </Box>
        </Paper>

        <Backdrop open={loader} sx={{ color: "#fff" }}>
          <CircularProgress color="inherit" />
        </Backdrop>

        <Popup
          message={message}
          setShowPopup={setShowPopup}
          showPopup={showPopup}
        />
      </Box>
    </ThemeProvider>
  );
};

export default AdminRegisterPage;