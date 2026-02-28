import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Button,
  Grid,
  Box,
  Typography,
  Checkbox,
  FormControlLabel,
  TextField,
  CssBaseline,
  IconButton,
  InputAdornment,
  CircularProgress,
  Backdrop
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { motion } from "framer-motion";
import styled from 'styled-components';
import bgpic from "../assets/designlogin.jpg";

import { loginUser } from '../redux/userRelated/userHandle';
import Popup from '../components/Popup';

const defaultTheme = createTheme();

const LoginPage = ({ role }) => {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { status, currentUser, response, currentRole } = useSelector(state => state.user);

  const [toggle, setToggle] = useState(false);
  const [guestLoader, setGuestLoader] = useState(false);
  const [loader, setLoader] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");

  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [rollNumberError, setRollNumberError] = useState(false);
  const [studentNameError, setStudentNameError] = useState(false);

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
    if (name === 'email') setEmailError(false);
    if (name === 'password') setPasswordError(false);
    if (name === 'rollNumber') setRollNumberError(false);
    if (name === 'studentName') setStudentNameError(false);
  };

  const guestModeHandler = () => {
    const password = "zxc";

    if (role === "Admin") {
      dispatch(loginUser({ email: "yogendra@12", password }, role));
    } else if (role === "Student") {
      dispatch(loginUser({ rollNum: "1", studentName: "Dipesh Awasthi", password }, role));
    } else if (role === "Teacher") {
      dispatch(loginUser({ email: "tony@12", password }, role));
    }

    setGuestLoader(true);
  };

  useEffect(() => {
    if (status === 'success' || currentUser !== null) {
      if (currentRole === 'Admin') navigate('/Admin/dashboard');
      else if (currentRole === 'Student') navigate('/Student/dashboard');
      else if (currentRole === 'Teacher') navigate('/Teacher/dashboard');
    }
    else if (status === 'failed') {
      setMessage(response);
      setShowPopup(true);
      setLoader(false);
    }
    else if (status === 'error') {
      setMessage("Network Error");
      setShowPopup(true);
      setLoader(false);
      setGuestLoader(false);
    }
  }, [status, currentRole, navigate, response, currentUser]);

  return (
    <ThemeProvider theme={defaultTheme}>
      <Grid container component="main" sx={{ height: '100vh' }}>
        <CssBaseline />

        {/* LEFT SIDE LOGIN PANEL */}
        <Grid
          item
          xs={12}
          sm={8}
          md={5}
          component={motion.div}
          initial={{ opacity: 0, x: -80 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          sx={{
            backdropFilter: "blur(20px)",
            background: "rgba(255,255,255,0.85)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 15px 40px rgba(0,0,0,0.2)"
          }}
        >
          <Box sx={{ width: "80%" }}>
            <Typography
              variant="h4"
              component={motion.h4}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              sx={{
                fontWeight: 700,
                mb: 1,
                background: "linear-gradient(90deg,#7f56da,#2c2143)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent"
              }}
            >
              {role} Login
            </Typography>

            <Typography sx={{ mb: 3, color: "#555" }}>
              Welcome back! Please enter your details
            </Typography>

            <Box component="form" onSubmit={handleSubmit}>

              {role === "Student" ? (
                <>
                  <StyledTextField
                    fullWidth
                    margin="normal"
                    label="Roll Number"
                    name="rollNumber"
                    error={rollNumberError}
                    helperText={rollNumberError && "Required"}
                    onChange={handleInputChange}
                  />
                  <StyledTextField
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
                <StyledTextField
                  fullWidth
                  margin="normal"
                  label="Email"
                  name="email"
                  error={emailError}
                  helperText={emailError && "Required"}
                  onChange={handleInputChange}
                />
              )}

              <StyledTextField
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
                  )
                }}
              />

              <FormControlLabel
                control={<Checkbox />}
                label="Remember me"
              />

              <GradientButton
                type="submit"
                fullWidth
              >
                {loader ? <CircularProgress size={24} color="inherit" /> : "Login"}
              </GradientButton>

              <OutlinedButton
                fullWidth
                onClick={guestModeHandler}
              >
                Login as Guest
              </OutlinedButton>

            </Box>
          </Box>
        </Grid>

        {/* RIGHT SIDE BACKGROUND */}
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            position: "relative",
            backgroundImage: `url(${bgpic})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            "&::before": {
              content: '""',
              position: "absolute",
              width: "100%",
              height: "100%",
              background: "linear-gradient(135deg, rgba(127,86,218,0.6), rgba(44,33,67,0.7))"
            }
          }}
        />

      </Grid>

      <Backdrop open={guestLoader} sx={{ color: '#fff' }}>
        <CircularProgress color="inherit" />
      </Backdrop>

      <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
    </ThemeProvider>
  );
};

export default LoginPage;


/* ---------------- Styled Components ---------------- */

const StyledTextField = styled(TextField)`
  & .MuiOutlinedInput-root {
    border-radius: 12px;
    transition: 0.3s;

    &:hover fieldset {
      border-color: #7f56da;
    }

    &.Mui-focused fieldset {
      border-color: #7f56da;
      box-shadow: 0 0 8px rgba(127,86,218,0.4);
    }
  }
`;

const GradientButton = styled(Button)`
  margin-top: 20px !important;
  padding: 10px !important;
  font-weight: 600 !important;
  border-radius: 12px !important;
  color: white !important;
  background: linear-gradient(135deg, #7f56da, #5a3fc0) !important;
  transition: 0.3s !important;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 20px rgba(127,86,218,0.4);
  }
`;

const OutlinedButton = styled(Button)`
  margin-top: 15px !important;
  border-radius: 12px !important;
  border: 2px solid #7f56da !important;
  color: #7f56da !important;
  transition: 0.3s !important;

  &:hover {
    background: #f3edff !important;
    transform: translateY(-2px);
  }
`;
