import React from 'react';
import style from './style.module.css';

const Title = ({ title }) => {
    return (
        <div className={style.title}>
            {title ? title : null}
        </div>
    );
}

export default Title;