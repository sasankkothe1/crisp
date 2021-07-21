import React, { useState } from "react";

import { useForm } from "react-hook-form";
import { Button, styled, TextField, IconButton, Grid } from "@material-ui/core";
import MomentUtils from "@date-io/moment";
import {
    MuiPickersUtilsProvider,
    DatePicker,
    TimePicker,
} from "@material-ui/pickers";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import DeleteIcon from "@material-ui/icons/Delete";
import { Form } from "react-bootstrap";

import "./EventView.css";
import moment from "moment";
import EventService from "../../services/EventService";

export default function AddEventView() {
    const { handleSubmit, register } = useForm();

    const [charactersLeft, setCharactersLeft] = useState(500);
    const [uploadedImages, setUploadedImages] = useState([]);
    const [eventDate, setEventDate] = useState(new moment());
    const [startTime, setStartTime] = useState(new moment());
    const [endTime, setEndTime] = useState(new moment());

    const handleEventDate = (date) => setEventDate(date);
    const handleStartTime = (date) => setStartTime(date);
    const handleEndTime = (date) => setEndTime(date);

    const handleFileOnChange = (e) => {
        e.preventDefault();
        for (var i = 0; i < e.target.files.length; i++) {
            let file = e.target.files[i];
            let name = file["name"];
            let reader = new FileReader();
            reader.readAsDataURL(e.target.files[i]);
            reader.onloadend = () => {
                setUploadedImages((oldImages) => [
                    ...oldImages,
                    { file, name, preview: reader.result },
                ]);
            };
        }
    };

    const removeImage = (e, name) => {
        e.preventDefault();
        console.log(name);
        const newArray = uploadedImages.filter((image) => {
            return image["name"] != name;
        });
        console.log(newArray);
        setUploadedImages(newArray);
    };

    const addPost = (data) => {
        // convert the date of the startTime to the event Date (as the startTime and end time contain today's day)
        startTime.date(eventDate.date());
        startTime.month(eventDate.month());
        startTime.year(eventDate.year());
        // convert the date of the endTime to the event Date (as the startTime and end time contain today's day)
        endTime.date(eventDate.date());
        endTime.month(eventDate.month());
        endTime.year(eventDate.year());
        const formData = new FormData();
        formData.append("title", data.title);
        formData.append("description", data.description);
        if (data.contentType === "Premium")
            formData.append("premiumStatus", true);
        else formData.append("premiumStatus", false);
        if (uploadedImages.length > 0) {
            for (var i = 0; i < uploadedImages.length; i++) {
                formData.append("media", uploadedImages[i]["file"]);
            }
        }
        formData.append("eventLocation", data.eventLocation);
        formData.append("eventDate", eventDate.toISOString());
        formData.append("startTime", startTime.toISOString());
        formData.append("endTime", endTime.toISOString());
        EventService.addEvent(formData).then((res) => {
            console.log(res);
        });
    };

    const Input = styled("input")({
        display: "none",
    });
    return (
        <div className="post-form-container">
            <form
                encType="multipart/form-data"
                onSubmit={handleSubmit(addPost)}
            >
                <TextField
                    key={"event-title"}
                    {...register("title")}
                    id="outlined-full-width"
                    label="Title"
                    style={{ margin: 8 }}
                    placeholder="Enter the title"
                    fullWidth
                    margin="normal"
                    InputLabelProps={{
                        shrink: true,
                    }}
                    variant="outlined"
                />

                <TextField
                    key={"event-description"}
                    {...register("description")}
                    multiline
                    rows={4}
                    maxLength="8"
                    inputProps={{
                        maxLength: "500",
                    }}
                    id="outlined-full-width"
                    label="Description"
                    style={{ margin: 8 }}
                    placeholder="Enter the description"
                    fullWidth
                    margin="normal"
                    InputLabelProps={{
                        shrink: true,
                    }}
                    variant="outlined"
                    helperText={`${charactersLeft} characters left`}
                    onInput={(e) => {
                        let maxChars = 500;
                        let textLength = String(e.target.value).length;
                        setCharactersLeft(maxChars - textLength);
                    }}
                />

                <div className="event-container">
                    <div className="event-details-container">
                        <label>Event Details</label>
                        <div className="event-date-container">
                            <MuiPickersUtilsProvider utils={MomentUtils}>
                                <DatePicker
                                    {...register("startDate")}
                                    className="event-date"
                                    variant="inline"
                                    format="DD/MM/YYYY"
                                    margin="normal"
                                    id="date-picker-inline"
                                    label="Event is on"
                                    value={eventDate}
                                    onChange={handleEventDate}
                                    emptyLabel="Event Date"
                                    KeyboardButtonProps={{
                                        "aria-label": "change date",
                                    }}
                                />
                            </MuiPickersUtilsProvider>
                        </div>
                        <div className="event-time-container">
                            <MuiPickersUtilsProvider utils={MomentUtils}>
                                <Grid container justifyContent="space-around">
                                    <TimePicker
                                        {...register("startTime")}
                                        margin="normal"
                                        id="time-picker"
                                        label="From"
                                        value={startTime}
                                        onChange={handleStartTime}
                                        KeyboardButtonProps={{
                                            "aria-label": "change time",
                                        }}
                                    />
                                    <TimePicker
                                        {...register("endTime")}
                                        margin="normal"
                                        id="time-picker"
                                        label="To"
                                        value={endTime}
                                        onChange={handleEndTime}
                                        KeyboardButtonProps={{
                                            "aria-label": "change time",
                                        }}
                                    />
                                </Grid>
                            </MuiPickersUtilsProvider>
                        </div>
                        <div className="event-location">
                            <TextField
                                {...register("eventLocation")}
                                id="outlined-full-width"
                                label="location"
                                style={{ margin: 8 }}
                                placeholder="Enter the location (please provide the online link)"
                                fullWidth
                                margin="normal"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                variant="outlined"
                            />
                        </div>
                    </div>
                    <div className="upload-preview-container">
                        <div className="button-in-media-container">
                            <label htmlFor="contained-button-file">
                                <Input
                                    id="contained-button-file"
                                    multiple
                                    type="file"
                                    onChange={handleFileOnChange}
                                />
                                <Button
                                    variant="contained"
                                    component="span"
                                    startIcon={<CloudUploadIcon />}
                                >
                                    Upload
                                </Button>
                            </label>
                        </div>
                        {uploadedImages.length ? (
                            uploadedImages.map((item) => (
                                <div
                                    className="image-preview-container"
                                    key={item["name"]}
                                    style={{
                                        border: "1px solid gray",
                                    }}
                                >
                                    <img
                                        className="preview"
                                        src={[item["preview"]]}
                                    />{" "}
                                    <div className="remove-image-button">
                                        <IconButton
                                            onClick={(e) =>
                                                removeImage(e, item["name"])
                                            }
                                            aria-label="delete"
                                        >
                                            <DeleteIcon fontSize="large" />
                                        </IconButton>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <h4 className="no-media">No media</h4>
                        )}
                    </div>
                </div>

                <Form.Group controlId="typeOfSolution">
                    <Form.Control
                        className="premium-dropdown"
                        {...register("contentType")}
                        as="select"
                    >
                        <option>Not Premium</option>
                        <option>Premium</option>
                    </Form.Control>
                </Form.Group>
                <div className="submit-button-container">
                    <Button
                        className="submit-button"
                        type="submit"
                        variant="contained"
                        color="primary"
                    >
                        Submit
                    </Button>
                </div>
            </form>
        </div>
    );
}
