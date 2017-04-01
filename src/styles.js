import { injectGlobal } from 'styled-components';

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
