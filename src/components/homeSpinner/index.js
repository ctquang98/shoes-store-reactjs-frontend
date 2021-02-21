import React from 'react';
import { Spinner } from 'react-bootstrap';

const HomeSpinner = () => {
    return (
        <div>
            {onRenderSpinner()}
        </div>
    )
}

const onRenderSpinner = () => {
    const arrayTypes = [
        'primary',
        'secondary',
        'success',
        'danger',
        'warning',
        'info',
        'light',
        'dark',
    ]
    return arrayTypes.map((type, i) =>
        <Spinner key={i} animation="grow" variant={type} />
    )
}

export default HomeSpinner;