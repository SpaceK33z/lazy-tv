import React from 'react';
import styled from 'styled-components';

const ActionMenu = styled.div`
    width: 100%;
    height: 80px;
    display: flex;
    justify-content: ${props => props.compact ? 'flex-start' : 'space-between'};
    align-items: center;
    padding: 0 20px;
    position: relative;
`;

export default ActionMenu;

export const ActionMenuGroup = styled.div`
    display: flex;
`;
