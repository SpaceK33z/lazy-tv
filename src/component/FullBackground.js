import styled, { keyframes } from 'styled-components';

const gradient = keyframes`
    0% { background-position: 0% 50%; }
    50%{ background-position: 100% 50%; }
    100%{ background-position: 0% 50%; }
`;

// TODO: add more colors! It'll be fun!
// Created these with https://www.gradient-animator.com/
const FullBackground = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 0;
    background: linear-gradient(230deg, #a24bcf, #4b79cf, #4bc5cf, #fbc8d4, #3f51b1);
    background-size: 1000% 1000%;
    animation: ${gradient} 30s ease infinite;
    transition: 350ms ease;
`;

export default FullBackground;
