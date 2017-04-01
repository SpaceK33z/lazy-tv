import { injectGlobal, css } from 'styled-components';

export const DEFAULT_FONT = css`
    font-family: -apple-system, system-ui, "Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif;
`;

export const COLOR_WHITE = 'rgba(255, 255, 255, .9)';
export const COLOR_PRIMARY = 'rgba(36, 242, 242, 1)';

export default injectGlobal`
    html {
      box-sizing: border-box;
    }
    *, *:before, *:after {
      box-sizing: inherit;
    }
    body, #root {
        width: 100%;
        height: 100vh;
        display: flex;
        flex-wrap: wrap;
        margin: 0;
    }
`;
