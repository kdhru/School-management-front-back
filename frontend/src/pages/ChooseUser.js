import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Grid,
  Box,
  Container,
  CircularProgress,
  Backdrop,
  IconButton
} from '@mui/material';
import { AccountCircle, School, Group, DarkMode, LightMode } from '@mui/icons-material';
import styled from 'styled-components';
import { motion } from "framer-motion";
import { useDispatch, useSelector } from 'react-redux';
import Popup from '../components/Popup';

const ChooseUser = () => {

  const navigate = useNavigate();
  const { status, currentUser, currentRole } = useSelector(state => state.user);

  const [loader, setLoader] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );

  const toggleTheme = () => {
    const newTheme = !darkMode;
    setDarkMode(newTheme);
    localStorage.setItem("theme", newTheme ? "dark" : "light");
  };

  const navigateHandler = (user) => {
    navigate(`/${user}login`);
  };

  useEffect(() => {
    if (status === 'success' || currentUser !== null) {
      navigate(`/${currentRole}/dashboard`);
    }
    else if (status === 'error') {
      setLoader(false);
      setMessage("Network Error");
      setShowPopup(true);
    }
  }, [status, currentRole, navigate, currentUser]);

  return (
    <MainWrapper dark={darkMode}>

      {/* Theme Toggle */}
      <ThemeToggle onClick={toggleTheme}>
        {darkMode ? <LightMode /> : <DarkMode />}
      </ThemeToggle>

      <Container maxWidth="lg">
        <Grid container spacing={4} justifyContent="center">

          {["Admin", "Student", "Teacher"].map((role, index) => (
            <Grid item xs={12} sm={4} key={role}>
              <RoleCard
                as={motion.div}
                dark={darkMode}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                onClick={() => navigateHandler(role)}
              >
                <IconWrapper>
                  {role === "Admin" && <AccountCircle fontSize="large" />}
                  {role === "Student" && <School fontSize="large" />}
                  {role === "Teacher" && <Group fontSize="large" />}
                </IconWrapper>

                <h2>{role}</h2>
                <p>Login as {role} to continue</p>
              </RoleCard>
            </Grid>
          ))}

        </Grid>
      </Container>

      <Backdrop open={loader}>
        <CircularProgress />
      </Backdrop>

      <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
    </MainWrapper>
  );
};

export default ChooseUser;


/* ---------------- STYLES ---------------- */

const MainWrapper = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  transition: 0.5s ease;
  background: ${({ dark }) =>
    dark
      ? "linear-gradient(135deg, #141e30, #243b55)"
      : "linear-gradient(135deg, #f5f7fa, #c3cfe2)"};
`;

const RoleCard = styled.div`
  background: ${({ dark }) =>
    dark
      ? "rgba(255,255,255,0.08)"
      : "rgba(255,255,255,0.9)"};
  backdrop-filter: blur(20px);
  padding: 50px 30px;
  border-radius: 20px;
  text-align: center;
  cursor: pointer;
  transition: 0.3s;
  color: ${({ dark }) => (dark ? "white" : "#2c2143")};
  box-shadow: ${({ dark }) =>
    dark
      ? "0 10px 30px rgba(0,0,0,0.5)"
      : "0 10px 30px rgba(0,0,0,0.1)"};

  &:hover {
    transform: translateY(-12px);
  }

  h2 {
    margin: 15px 0 10px 0;
  }

  p {
    opacity: 0.8;
  }
`;

const IconWrapper = styled(Box)`
  margin-bottom: 15px;
`;

const ThemeToggle = styled(IconButton)`
  position: absolute !important;
  top: 20px;
  right: 20px;
  background: white !important;
  transition: 0.3s !important;

  &:hover {
    transform: rotate(180deg);
  }
`;
