import React from 'react';

export default ({ className }) => {
    return (
        <svg viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M64 0C28.656 0 0 28.656 0 64s28.656 64 64 64 64-28.656 64-64S99.344 0 64 0zm0 120C33.125 120 8 94.875 8 64S33.125 8 64 8s56 25.125 56 56-25.125 56-56 56z"
                fill="#fff"
            />
            <path
                d="M96 56H72V32c0-4.414-3.586-8-8-8s-8 3.586-8 8v24H32c-4.414 0-8 3.586-8 8s3.586 8 8 8h24v24c0 4.414 3.586 8 8 8s8-3.586 8-8V72h24c4.414 0 8-3.586 8-8s-3.586-8-8-8z"
                fill="#fff"
            />
        </svg>
    );
};
