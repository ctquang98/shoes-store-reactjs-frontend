import React from 'react';
import { Carousel } from 'react-bootstrap';
import { connect } from 'react-redux';
import style from './style.module.css';

class SlideShow extends React.Component {
    state = {
        index: 0
    }

    handleSelect = (selectedIndex, e) => {
        this.setState({ index: selectedIndex});
    };

    onRenderSlides = slides => {
        let result = null;

        if(Array.isArray(slides) && slides.length) {
            result = slides.map((slide, i) => (
                <Carousel.Item key={i}>
                    <img
                        className={style.imgSlide}
                        // src={require(`../../assets/slides/${slide.image}`)}
                        src={process.env.PUBLIC_URL + `/assets/images/slides/${slide.image}`}
                        alt="slide"
                    />
                </Carousel.Item>
            ));
        }
        return result;
    }

    render () {
        const { index } = this.state;
        const { slides } = this.props;
        return (
            <Carousel
                activeIndex={index}
                onSelect={this.handleSelect}
                interval={1500}
            >
                {this.onRenderSlides(slides)}
            </Carousel>
        );
    }
}

const mapStateToProps = state => ({
    slides: state.app.slides
})

export default connect(mapStateToProps, null)(SlideShow);