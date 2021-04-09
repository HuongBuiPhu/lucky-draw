import React from 'react';
import { useLoading, ThreeDots } from '@agney/react-loading';

function LoadingAnim() {
    const { containerProps, indicatorEl } = useLoading({
        loading: true,
        indicator: <ThreeDots width="50" />,
        loaderProps: {
            style: { margin: '0 auto', color: "#ffffff" }
        }
    });

    return (
        < section {...containerProps}>
            {indicatorEl}
        </section >
    )
}

export default LoadingAnim
