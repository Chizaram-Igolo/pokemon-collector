import React from "react";

const StarRating = ({
    rating,
    maxStars = 5,
}: {
    rating: number;
    maxStars?: number;
}) => {
    // Function to round the rating to the nearest 0.5
    const roundToHalf = (num: number) => Math.round(num * 2) / 2;

    // Round the passed rating
    const roundedRating = roundToHalf(rating);

    // Define a color gradient from red to green
    const gradient: { [key: string]: string } = {
        10: "#ff0000", // Red
        20: "#ff3300",
        30: "#ff6600",
        40: "#ff9900",
        50: "#ddaa00",
        60: "#eedd00",
        70: "#eeaa00",
        80: "#99cc00",
        90: "#55cc00",
        100: "#00cc00", // Green
    };

    // Calculate color based on the rating
    const colorIndex = Math.min(
        Math.floor((roundedRating / maxStars) * 100),
        100
    );
    const color = gradient[`${colorIndex}`] || gradient["100"]; // Use the color for the entire rating

    // Generate star elements based on the rounded rating
    const stars = [];
    for (let i = 1; i <= maxStars; i++) {
        if (i <= roundedRating) {
            // Full star
            stars.push(
                <span key={i} className="star full" style={{ color: color }}>
                    &#9733;
                </span>
            );
        } else {
            // Empty star
            stars.push(
                <span key={i} className="star empty text-gray-300">
                    &#9734;
                </span>
            );
        }
    }

    return <div className="star-rating flex">{stars}</div>;
};

export default StarRating;
