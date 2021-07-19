import React, { useState } from "react";

import { makeStyles } from "@material-ui/core";

import Input from "@material-ui/core/Input";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";

import Button from "@material-ui/core/Button";

const useStyles = makeStyles(() => ({
    sidebar: {
        width: "30%",
        flexGrow: 1,
    },
    header: {
        fontSize: "small",
    },
}));

export default function ShopSidebar(props) {
    const classes = useStyles();

    const applyFilters = () => {
        props.setButtonClicked(!props.buttonClicked);
    };

    const handleMealClick = (event) => {
        console.log(event.target.value);
        if (event.target.value == props.meal) {
            props.setMeal("");
        } else {
            props.setMeal(event.target.value);
        }
    };

    const mealFilter = [
        {
            value: "breakfast",
            caption: "Breakfast",
        },
        {
            value: "dinner",
            caption: "Dinner",
        },
        {
            value: "lunch",
            caption: "Lunch",
        },
        {
            value: "snacks",
            caption: "Snacks",
        },
    ];

    return (
        <div className={classes.sidebar}>
            <h5 className={classes.header}>Price</h5>
            <div>
                <Input
                    type="number"
                    name="min"
                    placeholder="From"
                    onBlur={(event) => {
                        let price = parseFloat(event.target.value);
                        if (!price || price < 0) {
                            price = 0;
                        }
                        props.setMinPrice(price);
                    }}
                />
                <span> ... </span>
                <Input
                    type="number"
                    name="min"
                    placeholder="To"
                    onBlur={(event) => {
                        let price = parseFloat(event.target.value);
                        if (!price || price < 0) {
                            price = 0;
                        }
                        props.setMaxPrice(price);
                    }}
                />
            </div>
            <h5 className={classes.header}>Meal</h5>
            <FormControl component="fieldset">
                <RadioGroup value={props.meal}>
                    {mealFilter.map((filter, i) => (
                        <FormControlLabel
                            key={i}
                            value={filter["value"]}
                            control={<Radio onClick={handleMealClick} />}
                            label={filter["caption"]}
                        />
                    ))}
                </RadioGroup>
            </FormControl>
            <Button variant="contained" color="primary" onClick={applyFilters}>
                Apply
            </Button>
        </div>
    );
}
