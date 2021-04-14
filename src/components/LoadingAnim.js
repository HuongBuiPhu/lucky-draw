import React from 'react';
import { useLoading, ThreeDots, BallTriangle } from '@agney/react-loading';

function LoadingAnim() {
    const { containerProps, indicatorEl } = useLoading({
        loading: true,
        indicator: <BallTriangle width="100" />,
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
