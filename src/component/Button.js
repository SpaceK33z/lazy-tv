import React from 'react';
import styled from 'styled-components';
import { COLOR_WHITE, COLOR_PRIMARY } from '../styles';

const Button = styled.button`
    border: 0;
    display: block;
    cursor: pointer;
    flex: 1;
    margin-right: 20px;
    margin-bottom: 20px;
    padding: 10px 0;
    border-radius: 2px;
    font-size: 1.5em;
    border: 3px solid ${COLOR_WHITE};

    ${props => props.type === 'submit' ? `
        color: ${COLOR_PRIMARY};
        background: ${COLOR_WHITE};
    ` : `
        background: transparent;
        color: ${COLOR_WHITE};
    `}
`;

export default Button;
