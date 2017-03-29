import styled, { keyframes } from 'styled-components';

const gradient = keyframes`
    0% { background-position: 0% 50%; }
    50%{ background-position: 100% 50%; }
    100%{ background-position: 0% 50%; }
`;

// TODO: add more colors! It'll be fun!
// Created these with https://www.gradient-animator.com/
const HorizontalCenter = styled.div`
    display: flex;
    background: linear-gradient(230deg, #a24bcf, #4b79cf, #4bc5cf, #fbc8d4, #3f51b1);
    background-size: 1000% 1000%;
    animation: ${gradient} 30s ease infinite;
`;

export default HorizontalCenter;
