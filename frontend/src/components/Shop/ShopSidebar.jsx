import React from "react";

import { makeStyles } from "@material-ui/core";

import TextField from "@material-ui/core/TextField";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";

import Button from "@material-ui/core/Button";

const useStyles = makeStyles(() => ({
    sidebar: {
        display: "flex",
        flexDirection: "column",
        width: "100%",
    },
    header: {
        fontSize: "large",
    },
    priceFilter: {
        width: "100%",
        align: "right",
        marginBottom: "5px",
        display: "flex",
        flexDirection: "column",
    },
    pricePair: {
        width: "100%",
        display: "flex",
        flexDirection: "column",
    },
    mealFilter: {
        width: "100%",
        align: "right",
        marginBottom: "5px",
        display: "flex",
        flexDirection: "column",
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

    const mealFilter = ["Breakfast", "Dinner", "Lunch", "Snacks"];

    return (
        <div className={classes.sidebar}>
            <div className={classes.priceFilter}>
                <h5 className={classes.header}>Price</h5>
                <div className={classes.pricePair}>
                    <TextField
                        type="number"
                        name="min"
                        placeholder="From"
                        min="0"
                        onBlur={(event) => {
                            let price = parseFloat(event.target.value);
                            if (!price) {
                                price = 0;
                            }
                            props.setMinPrice(price);
                        }}
                        InputProps={{
                            inputProps: {
                                max: 999999999,
                                min: 0,
                            },
                        }}
                    />

                    <TextField
                        type="number"
                        name="min"
                        placeholder="To"
                        max="999999999"
                        onBlur={(event) => {
                            let price = parseFloat(event.target.value);
                            if (!price) {
                                price = 999999999;
                            }
                            props.setMaxPrice(price);
                        }}
                        InputProps={{
                            inputProps: {
                                max: 999999999,
                                min: 0,
                            },
                        }}
                    />
                </div>
            </div>
            <div className={classes.mealFilter}>
                <h5 className={classes.header}>Meal</h5>
                <FormControl component="fieldset">
                    <RadioGroup value={props.meal}>
                        {mealFilter.map((filter, i) => (
                            <FormControlLabel
                                key={i}
                                value={filter}
                                control={<Radio onClick={handleMealClick} />}
                                label={filter}
                            />
                        ))}
                    </RadioGroup>
                </FormControl>
            </div>
            <Button variant="contained" color="primary" onClick={applyFilters}>
                Apply
            </Button>
        </div>
    );
}
