import React, { useState } from "react";
import PropTypes from "prop-types";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import axios from "axios";
import { getToken, getBackendURL, isTokenValid } from "../../services/utils";

import "./PaymentForm.css";

const CARD_OPTIONS = {
    iconStyle: "solid",
    style: {
        base: {
            iconColor: "#c4f0ff",
            color: "#fff",
            fontWeight: 500,
            fontFamily: "Roboto, Open Sans, Segoe UI, sans-serif",
            fontSize: "16px",
            fontSmoothing: "antialiased",
            ":-webkit-autofill": { color: "#fce883" },
            "::placeholder": { color: "#87bbfd" },
        },
        invalid: {
            iconColor: "#ffc7ee",
            color: "#ffc7ee",
        },
    },
};

const PaymentForm = ({ orderType, orderObject, onSuccess }) => {
    const [success, setSuccess] = useState(false);
    const stripe = useStripe();
    const elements = useElements();

    let orderDescription;
    let paymentSubtitle;
    let paymentAmount;
    const orderDetails = {
        type: orderType,
    };

    if (orderType === "Subscription") {
        orderDescription = `Subscription to user: ${orderObject.username}`;
        paymentSubtitle = `You're about to subcribe to ${orderObject.username} for 5€`;
        paymentAmount = 500;
        orderDetails.subscription = orderObject._id;
    } else if (orderType === "RecipeCollection") {
        orderDescription = `Purchase of recipe collection with id: ${orderObject._id}`;
        paymentSubtitle = `You're about to purchase ${orderObject.title} for ${orderObject.price}€`;
        paymentAmount = orderObject.price * 100;
        orderDetails.recipeCollection = orderObject._id;
    } else {
        console.log("Invalid Order");
    }

    orderDetails.description = orderDescription;
    orderDetails.totalAmount = paymentAmount;

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { error, paymentMethod } = await stripe.createPaymentMethod({
            type: "card",
            card: elements.getElement(CardElement),
        });

        if (!error) {
            try {
                const { id } = paymentMethod;

                if (isTokenValid()) {
                    const headers = { Authorization: `Bearer ${getToken()}` };
                    const response = await axios.post(
                        `${getBackendURL()}/orders/`,
                        {
                            paymentDetails: {
                                amount: paymentAmount,
                                currency: "EUR",
                                description: orderDescription,
                                payment_method: id,
                                confirm: true,
                            },
                            orderDetails: orderDetails,
                        },
                        { headers }
                    );

                    if (response.data.success) {
                        console.log("Successful Payment");
                        setSuccess(true);
                        onSuccess(response.data);
                    }
                } else {
                    return new Error("Session expired, please login again");
                }
            } catch (error) {
                console.log("Error", error);
            }
        } else {
            console.log(error.message);
        }
    };

    return (
        <div className="Container">
            {!success ? (
                <>
                    <h4 className="stripeText">{paymentSubtitle}</h4>
                    <form onSubmit={handleSubmit}>
                        <fieldset className="FormGroup">
                            <div className="FormRow">
                                <CardElement options={CARD_OPTIONS} />
                            </div>
                        </fieldset>
                        <button className="stripeButton">Pay</button>
                    </form>
                </>
            ) : (
                <div>
                    <h2 className="stripeText">
                        You just bought a sweet spatula
                    </h2>
                </div>
            )}
        </div>
    );
};

PaymentForm.propTypes = {
    orderType: PropTypes.String,
    orderObject: PropTypes.object,
    onSuccess: PropTypes.func,
};

export default PaymentForm;
