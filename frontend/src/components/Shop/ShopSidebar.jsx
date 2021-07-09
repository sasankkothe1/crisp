import React, { useState } from "react";

import { makeStyles } from "@material-ui/core";

import Input from "@material-ui/core/Input";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';

import Button from "@material-ui/core/Button";


const useStyles = makeStyles(() => ({
	sidebar: {
		display: "flex",
		flexDirection: "column",
		flexFrow: 3,
		width: 1,
	},
	header: {
		fontSize: "small"
	}
}));


export default function ShopSidebar() {
	const classes = useStyles();

    const [minValue, setMinValue] = useState(0);
    const [maxValue, setMaxValue] = useState(999999999);

	const [meal, setMeal] = React.useState("");

	const applyFilters = () => {
		alert(`minValue = ${minValue}, maxValue = ${maxValue}, meal = ${meal}`);
	};

    return (
        <div className={classes.sidebar}>
			<h5 className={classes.header}>Price</h5>
			<div>
				<Input
					type="number"
					name="min"
					placeholder="From"
					onBlur={(event) =>
						setMinValue(parseInt(event.target.value) || 0)
					}
				/>
				<span> ... </span>
				<Input
					type="number"
					name="min"
					placeholder="To"
					onBlur={(event) =>
						setMaxValue(parseInt(event.target.value) || 999999999)
					}
				/>
			</div>
			<h5 className={classes.header}>Meal</h5>
			<FormControl component="fieldset">
				<RadioGroup value={meal} onChange={ (event) => setMeal(event.target.value || "{empty}") }>
					<FormControlLabel value="breakfast" control={<Radio />} label="Breakfast" />
					<FormControlLabel value="dinner" control={<Radio />} label="Dinner" />
				</RadioGroup>
			</FormControl>
			<Button variant="contained" color="primary" onClick={applyFilters}>
				Apply
			</Button>
        </div>
    );
}
