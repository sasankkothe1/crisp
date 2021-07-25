import React, { useState } from "react";
//import PropTypes from "prop-types";

import {
	makeStyles,
} from "@material-ui/core";
import Chip from "@material-ui/core/Chip";
import TextField from "@material-ui/core/TextField";

const useStyles = makeStyles((theme) => ({
    chip: {
        margin: theme.spacing(0.5, 0.25),
    },
}));

const TagCloud = ({ key, label, placeholder, tags, setTags, handleNewTag, ...other}) => {
	const classes = useStyles();

	const [tag, setTag] = useState("");

	const addTag = (event) => {
		if (event.key !== "Enter") {
			return;
		}
		if (handleNewTag(tag)) {
			setTag("");
		}
	};

	const removeTag = (item) => () => {
        setTags(tags.filter((tag) => tag !== item));
    };

	return (
		<TextField
			key={key}
			{...other}
			label={label}
			style={{ margin: 8 }}
			placeholder={placeholder}
			fullWidth
			margin="normal"
			InputLabelProps={{
				shrink: true,
			}}
			value={tag}
			InputProps={{
				startAdornment: tags.map((item) => (
					<Chip
						key={item}
						tabIndex={-1}
						label={item}
						className={classes.chip}
						onDelete={removeTag(item)}
					/>
				)),
				onKeyDown: (event) => addTag(event),
				onChange: (event) => setTag(event.target.value)
			}}
			variant="outlined"
		/>
	)
};

export default TagCloud;