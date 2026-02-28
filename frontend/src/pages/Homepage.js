import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Grid, Button } from '@mui/material';
import styled from 'styled-components';
import { motion } from "framer-motion";
import Students from "../assets/students.svg";
import { LightPurpleButton } from '../components/buttonStyles';

const Homepage = () => {
  return (
    <MainWrapper>
      <Container>
        <Grid container alignItems="center">

          <Grid item xs={12} md={6}>
            <ImageWrapper
              as={motion.img}
              src={Students}
              alt="students"
              initial={{ opacity: 0, x: -60 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <ContentCard
              as={motion.div}
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Title>
                School Management System
              </Title>

              <Description>
                Streamline school management, class organization,
                track attendance, assess performance and manage
                everything efficiently.
              </Description>

              <ButtonGroup>
                <StyledLink to="/choose">
                  <LightPurpleButton fullWidth>
                    Login
                  </LightPurpleButton>
                </StyledLink>

                <StyledLink to="/chooseasguest">
                  <GuestButton fullWidth>
                    Login as Guest
                  </GuestButton>
                </StyledLink>
              </ButtonGroup>
            </ContentCard>
          </Grid>

        </Grid>
      </Container>
    </MainWrapper>
  );
};

export default Homepage;


/* ---------------- STYLES ---------------- */

const MainWrapper = styled.div`
  height: 100vh;
  display: flex;
  align-items: center;
  background: linear-gradient(135deg, #f3edff, #e0d4ff);
`;

const ImageWrapper = styled.img`
  width: 100%;
`;

const ContentCard = styled.div`
  padding: 40px;
`;

const Title = styled.h1`
  font-size: 3rem;
  font-weight: 800;
  background: linear-gradient(90deg,#7f56da,#2c2143);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const Description = styled.p`
  margin: 25px 0;
  color: #444;
`;

const ButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const GuestButton = styled(Button)`
  border-radius: 12px !important;
  border: 2px solid #7f56da !important;
  color: #7f56da !important;

  &:hover {
    background: #f3edff !important;
    transform: translateY(-3px);
  }
`;

const StyledLink = styled(Link)`
  text-decoration: none;
`;
