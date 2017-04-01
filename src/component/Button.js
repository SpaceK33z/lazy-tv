import React from 'react';
import styled from 'styled-components';

const Button = styled.button`
    border: 0;
    display: block;
    cursor: pointer;
    flex: 1;
    ${props => props.type === 'submit' ? `
        background: rgba(36, 242, 242, 1);
    ` : `
        background: #999;
    `}
`;

export default Button;
