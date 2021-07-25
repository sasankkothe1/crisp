import React, { useState, useEffect } from "react";

import PropTypes from "prop-types";

import Rating from "@material-ui/lab/Rating";

import { isLoggedIn } from "../../services/utils";

const useRating = (entryID, getEntryUserRate) => {
    const [rating, setRating] = useState(0);

    if (!isLoggedIn()) {
        return [rating, setRating];
    }

    useEffect(async () => {
		console.log("getting rate...");
		const [success, newRating] = await getEntryUserRate(entryID);

       	if (success) {
            setRating(newRating);
        }
    }, []);

    return [rating, setRating];
};

const UserRating = ({ entryID, dataChanged, setDataChanged, rateEntry, getEntryUserRate }) => {
	const [rating, setRating] = useRating(entryID, getEntryUserRate);

	return (
		<Rating
			name="simple-controlled"
			value={rating}
			onChange={async (event, rate) => {
				if (rate !== rating) {
					console.log("applying rate...");
					const success =
						await rateEntry(
							entryID,
							rate
						);
					if (success) {
						setDataChanged(
							!dataChanged
						);
						setRating(rate);
					}
				}
			}}
			readOnly={!isLoggedIn()}
		/>
	);
};

UserRating.PropTypes = {
	entryID: PropTypes.string,
	dataChanged: PropTypes.bool,
	setDataChanged: PropTypes.func,
	rateEntry: PropTypes.func,
	getEntryUserRate: PropTypes.func
};

export default UserRating;

