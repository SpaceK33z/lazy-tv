import React from 'react';
import styled from 'styled-components';

const ButtonIcon = styled.button`
    background: transparent;
    width: ${props => props.width || '50px'};
    height: ${props => props.height || '50px'};
    border: 0;
    display: block;
    padding: 0;
    outline: 0;
    cursor: pointer;
`;

export default ButtonIcon;
