import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
  Button,
  Box,
  Typography,
  TextField,
  CssBaseline,
  IconButton,
  InputAdornment,
  CircularProgress,
  Backdrop,
  Paper,
  Link
} from "@mui/material";

import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Visibility, VisibilityOff } from "@mui/icons-material";

import { loginUser } from "../redux/userRelated/userHandle";
import Popup from "../components/Popup";
import bgpic from "../assets/designlogin.jpg";



/* ================= THEME CONFIG ================= */

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
});



/* ================= COMPONENT ================= */

const LoginPage = ({ role }) => {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { status, currentUser, response, currentRole } =
    useSelector((state) => state.user);

  const [toggle, setToggle] = useState(false);
  const [guestLoader, setGuestLoader] = useState(false);
  const [loader, setLoader] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");

  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [rollNumberError, setRollNumberError] = useState(false);
  const [studentNameError, setStudentNameError] = useState(false);

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

    if (role === "Student") {
      const rollNum = event.target.rollNumber.value;
      const studentName = event.target.studentName.value;
      const password = event.target.password.value;

      if (!rollNum || !studentName || !password) {
        if (!rollNum) setRollNumberError(true);
        if (!studentName) setStudentNameError(true);
        if (!password) setPasswordError(true);
        return;
      }

      setLoader(true);
      dispatch(loginUser({ rollNum, studentName, password }, role));
    } else {
      const email = event.target.email.value;
      const password = event.target.password.value;

      if (!email || !password) {
        if (!email) setEmailError(true);
        if (!password) setPasswordError(true);
        return;
      }

      setLoader(true);
      dispatch(loginUser({ email, password }, role));
    }
  };

  const handleInputChange = (event) => {
    const { name } = event.target;
    if (name === "email") setEmailError(false);
    if (name === "password") setPasswordError(false);
    if (name === "rollNumber") setRollNumberError(false);
    if (name === "studentName") setStudentNameError(false);
  };

  const guestModeHandler = () => {
    const password = "zxc";

    if (role === "Admin") {
      dispatch(loginUser({ email: "yogendra@12", password }, role));
    } else if (role === "Student") {
      dispatch(loginUser(
        { rollNum: "1", studentName: "Dipesh Awasthi", password },
        role
      ));
    } else if (role === "Teacher") {
      dispatch(loginUser({ email: "tony@12", password }, role));
    }

    setGuestLoader(true);
  };

  /* ================= NAVIGATION EFFECT ================= */

  useEffect(() => {
    if (status === "success" || currentUser !== null) {
      if (currentRole === "Admin") navigate("/Admin/dashboard");
      else if (currentRole === "Student") navigate("/Student/dashboard");
      else if (currentRole === "Teacher") navigate("/Teacher/dashboard");
    } else if (status === "failed") {
      setMessage(response);
      setShowPopup(true);
      setLoader(false);
    } else if (status === "error") {
      setMessage("Network Error");
      setShowPopup(true);
      setLoader(false);
      setGuestLoader(false);
    }
  }, [status, currentRole, navigate, response, currentUser]);



  /* ================= UI ================= */

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
          transition: "0.4s ease"
        }}
      >

        {/* THEME TOGGLE */}
        <IconButton
          onClick={toggleTheme}
          sx={{
            position: "absolute",
            top: 20,
            right: 20,
            backgroundColor: mode === "light" ? "#fff" : "#1e293b",
            boxShadow: 3
          }}
        >
          {mode === "light" ? "🌙" : "☀️"}
        </IconButton>

        <Paper
          elevation={12}
          sx={{
            width: "900px",
            maxWidth: "95%",
            height: "550px",
            display: "flex",
            borderRadius: "20px",
            overflow: "hidden",
            backgroundColor: theme.palette.background.paper,
            color: theme.palette.text.primary,
            transition: "0.4s ease"
          }}
        >

          {/* LEFT SIDE FORM */}
          <Box
            sx={{
              width: { xs: "100%", md: "50%" },
              p: 6,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <Typography variant="h4" fontWeight={700} gutterBottom>
              Log In
            </Typography>

            <Typography variant="body2" color="text.secondary" mb={3}>
              Welcome back! Please enter your details
            </Typography>

            <Box component="form" onSubmit={handleSubmit}>
              {role === "Student" ? (
                <>
                  <TextField
                    fullWidth
                    margin="normal"
                    label="Roll Number"
                    name="rollNumber"
                    error={rollNumberError}
                    helperText={rollNumberError && "Required"}
                    onChange={handleInputChange}
                  />
                  <TextField
                    fullWidth
                    margin="normal"
                    label="Student Name"
                    name="studentName"
                    error={studentNameError}
                    helperText={studentNameError && "Required"}
                    onChange={handleInputChange}
                  />
                </>
              ) : (
                <TextField
                  fullWidth
                  margin="normal"
                  label="Email"
                  name="email"
                  error={emailError}
                  helperText={emailError && "Required"}
                  onChange={handleInputChange}
                />
              )}

              <TextField
                fullWidth
                margin="normal"
                label="Password"
                name="password"
                type={toggle ? "text" : "password"}
                error={passwordError}
                helperText={passwordError && "Required"}
                onChange={handleInputChange}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setToggle(!toggle)}>
                        {toggle ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{
                  mt: 3,
                  py: 1.2,
                  borderRadius: "8px",
                  background:
                    mode === "light"
                      ? "linear-gradient(90deg,#a855f7,#9333ea)"
                      : "linear-gradient(90deg,#7c3aed,#4c1d95)",
                }}
              >
                {loader ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Log In"
                )}
              </Button>

              <Button
                fullWidth
                variant="outlined"
                sx={{ mt: 2 }}
                onClick={guestModeHandler}
              >
                Login as Guest
              </Button>

              <Typography
                variant="body2"
                sx={{ textAlign: "center", mt: 3 }}
              >
                Don't have account?{" "}
                <Link href="/Adminregister">Sign up</Link>
              </Typography>
            </Box>
          </Box>

          {/* RIGHT SIDE IMAGE */}
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
              alt="login"
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

        <Backdrop open={guestLoader} sx={{ color: "#fff" }}>
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

export default LoginPage;