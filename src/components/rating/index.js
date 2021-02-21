import React from 'react';
import StarRatings from 'react-star-ratings';

class Rating extends React.Component {
    state = {
        rating: 0,
        avgRating: 0,
        disabled: true
    }

    changeRating = (rating, name) => {
        this.setState({ rating });
        this.props.handleSubmitRating(rating);
    }

    componentDidUpdate(prevProps) {
        if(this.props.avgRating !== prevProps.avgRating) {
            this.setState({ avgRating: this.props.avgRating });
        }
    }

    componentDidMount() {
        this.setState({
            avgRating: this.props.avgRating,
            disabled: this.props.disabledRating
        });
    }

    render() {
        const { rating, avgRating, disabled } = this.state;
        return (
            <StarRatings
                rating={avgRating ? avgRating : rating}
                numberOfStars={5}
                starRatedColor="#f7de00"
                starHoverColor="f7de00"
                starDimension={disabled ? "30px" : "40px"}
                starSpacing={disabled ? "3px" : "7px"}
                changeRating={disabled ? null : this.changeRating}
            />
        );
    }
}

export default Rating;