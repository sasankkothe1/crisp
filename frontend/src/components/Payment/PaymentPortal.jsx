import React from "react";
import PropTypes from "prop-types";
import { Typography } from "@material-ui/core";
import { Modal } from "react-bootstrap";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import PaymentForm from "./PaymentForm";

const PUBLIC_KEY =
    "pk_test_51JGMDdJlz82R0fgCAudIyBI7CLLkOGX7axURURDZb2QYIgyaLJWDwwfrHsdAjJGJKbr0NPVMEiO3ea9LZNOdrz0000gs422K2H";

const stripeTestPromise = loadStripe(PUBLIC_KEY);

const PaymentPortal = ({ orderType, orderObject, show, setShow }) => {
    const handleClose = () => setShow(false);

    return (
        <Modal size={"lg"} scrollable centered show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Typography>Payment Portal</Typography>
            </Modal.Header>
            <Modal.Body>
                <Elements stripe={stripeTestPromise}>
                    <PaymentForm
                        orderType={orderType}
                        orderObject={orderObject}
                    />
                </Elements>
            </Modal.Body>
        </Modal>
    );
};

PaymentPortal.propTypes = {
    orderType: PropTypes.String,
    orderObject: PropTypes.object,
    show: PropTypes.bool,
    setShow: PropTypes.func,
};

export default PaymentPortal;
