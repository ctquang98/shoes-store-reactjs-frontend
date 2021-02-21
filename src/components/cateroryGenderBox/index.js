import React from 'react';
import style from './style.module.css';
import { Link } from 'react-router-dom';
import men from '../../assets/p13.jpg';
import women from '../../assets/p15.jpg';
import unisex from '../../assets/p14.jpg';

const CategoryGenderBox = () => {
    return (
        <div className={style.container}>
            <div className={style.description}>
                <h2>Shoes Store: Hướng đến sự năng động, phong cách</h2>
            </div>
            <div className={style.boxes}>
                <Link to='/collections/NAM' className={style.link}>
                    <img src={men} alt="nam" />
                    <p>Bộ sưu tập giày nam</p>
                </Link>
                <Link to='/collections/NU' className={style.link}>
                    <img src={women} alt="nu" />
                    <p>Bộ sưu tập giày nữ</p>
                </Link>
                <Link to='/collections' className={style.link}>
                    <img src={unisex} alt="unisex" />
                    <p>Bộ sưu tập unisex</p>
                </Link>
            </div>
        </div>
    );
}

export default CategoryGenderBox;