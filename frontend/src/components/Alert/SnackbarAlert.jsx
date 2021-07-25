import React from "react";
import PropTypes from "prop-types";

import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";

const SnackbarAlert = ({ open, onClose, success, onSuccess, onError }) => {
	const Alert = (props) => {
        return <MuiAlert elevation={6} variant="filled" {...props} />;
    };

	const handleClose = (event, reason) => {
		if (reason === "clickaway") {
			return;
		}
		onClose(event);	
	};

	return (
		<Snackbar
			open={open}
			autoHideDuration={6000}
			onClose={handleClose}
		>
			{ success ? (<Alert onClose={handleClose} severity="success">
				{ onSuccess() }
			</Alert>) : (
			<Alert onClose={handleClose} severity="error">
				{ onError() }
			</Alert> 
			)}
		</Snackbar>
	);
};

SnackbarAlert.propTypes = {
	open: PropTypes.bool,
	success: PropTypes.bool,
	onSuccess: PropTypes.func,
	onError: PropTypes.func,
	onClose: PropTypes.func
};

export default SnackbarAlert;