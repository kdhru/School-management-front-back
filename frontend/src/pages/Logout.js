import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { authLogout } from '../redux/userRelated/userSlice';
import styled from 'styled-components';
import { motion } from "framer-motion";

const Logout = () => {

  const currentUser = useSelector(state => state.user.currentUser);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(authLogout());
    navigate('/');
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <MainContainer>
      <LogoutCard
        as={motion.div}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <UserName>{currentUser?.name}</UserName>
        <LogoutMessage>
          Are you sure you want to log out?
        </LogoutMessage>

        <ButtonGroup>
          <LogoutButton onClick={handleLogout}>
            Log Out
          </LogoutButton>

          <CancelButton onClick={handleCancel}>
            Cancel
          </CancelButton>
        </ButtonGroup>
      </LogoutCard>
    </MainContainer>
  );
};

export default Logout;


/* ---------------- STYLES ---------------- */

const MainContainer = styled.div`
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #7f56da, #2c2143);
`;

const LogoutCard = styled.div`
  background: rgba(255,255,255,0.1);
  backdrop-filter: blur(20px);
  padding: 40px;
  border-radius: 20px;
  text-align: center;
  width: 350px;
  box-shadow: 0 15px 40px rgba(0,0,0,0.3);
  color: white;
`;

const UserName = styled.h2`
  margin-bottom: 15px;
`;

const LogoutMessage = styled.p`
  margin-bottom: 30px;
  opacity: 0.8;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 15px;
  justify-content: center;
`;

const BaseButton = styled.button`
  padding: 10px 20px;
  border-radius: 10px;
  border: none;
  font-weight: 600;
  cursor: pointer;
  transition: 0.3s;

  &:hover {
    transform: translateY(-3px);
  }
`;

const LogoutButton = styled(BaseButton)`
  background: linear-gradient(135deg, #ff4b4b, #d90429);
  color: white;

  &:hover {
    box-shadow: 0 10px 20px rgba(255,0,0,0.4);
  }
`;

const CancelButton = styled(BaseButton)`
  background: white;
  color: #2c2143;

  &:hover {
    box-shadow: 0 10px 20px rgba(255,255,255,0.4);
  }
`;
