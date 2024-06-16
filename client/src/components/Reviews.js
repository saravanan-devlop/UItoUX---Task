import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const Reviews = () => {
    const { productId } = useParams();
    const [reviews, setReviews] = useState([]);

    useEffect(() => {
        axios.get(`http://localhost:5000/reviews/${productId}`)
            .then(res => setReviews(res.data))
            .catch(err => console.error(err));
    }, [productId]);

    return (
        <div>
            <h1>Reviews</h1>
            <ul>
                {reviews.map(review => (
                    <li key={review.id}>
                        Rating: {review.rating}, Comment: {review.comment}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Reviews;
