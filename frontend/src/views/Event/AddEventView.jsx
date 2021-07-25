import React, { useState, useEffect } from "react";

import { useForm } from "react-hook-form";
import {
    Button,
    styled,
    TextField,
    IconButton,
    Grid,
    Snackbar,
} from "@material-ui/core";
import MuiAlert from "@material-ui/lab/Alert";
import MomentUtils from "@date-io/moment";
import {
    MuiPickersUtilsProvider,
    DatePicker,
    TimePicker,
} from "@material-ui/pickers";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import { Form } from "react-bootstrap";

import "./EventView.css";
import moment from "moment";
import EventService from "../../services/EventService";

export default function AddEventView({ eventID, editable }) {
    const { handleSubmit, register } = useForm();

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [location, setLocation] = useState("");
    const [charactersLeft, setCharactersLeft] = useState(500);
    const [uploadedImages, setUploadedImages] = useState([]);
    const [eventDate, setEventDate] = useState(new moment());
    const [startTime, setStartTime] = useState(new moment());
    const [endTime, setEndTime] = useState(new moment());
    const [succesfullyUploaded, setSuccesfullyUploaded] = useState(false);
    const [response, setResponse] = useState();

    // userImages: these are the images that already user have. These are present in the post[media]
    const [userImages, setUserImages] = useState([]);

    //toBeDeletedImages: List of urls that contain the images that are to be deleted
    const [toBeDeleted, setToBeDeleted] = useState([]);

    useEffect(() => {
        if (eventID) {
            EventService.eventById(eventID).then((res) => {
                setTitle(res["title"]);
                setDescription(res["description"]);
                setEventDate(res["eventDate"]);
                setStartTime(res["startTime"]);
                setEndTime(res["endTime"]);
                setLocation(res["eventLocation"]);
                if (res["media"]) {
                    res["media"].map((url) => {
                        const name_arr = url.split("/");
                        const nameOfTheFile = name_arr[name_arr.length - 1];
                        setUserImages((oldUserImages) => [
                            ...oldUserImages,
                            { name: nameOfTheFile, preview: url },
                        ]);
                    });
                }
            });
        }
    }, []);

    const handleEventDate = (date) => {
        setEventDate(date);
    };
    const handleStartTime = (date) => {
        setStartTime(date);
    };
    const handleEndTime = (date) => {
        setEndTime(date);
    };

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

    const handleTitle = (e) => {
        setTitle(e.target.value);
    };

    const handleDescription = (e) => {
        setDescription(e.target.value);
    };

    const handleLocation = (e) => {
        setLocation(e.target.value);
    };

    const removeImage = (e, name) => {
        e.preventDefault();
        const newArray = uploadedImages.filter((image) => {
            return image["name"] != name;
        });
        setUploadedImages(newArray);
    };

    const removeUserImages = (e, name) => {
        e.preventDefault();
        const newArray = userImages.filter((image) => {
            return image["name"] != name;
        });
        const name_arr = name.split("/");
        const nameOfTheFile = name_arr[name_arr.length - 1];
        setUserImages(newArray);
        setToBeDeleted((prevArray) => [...prevArray, nameOfTheFile]);
    };

    const Alert = (props) => {
        return <MuiAlert elevation={6} variant="filled" {...props} />;
    };

    const handleClose = (event, reason) => {
        if (reason === "clickaway") {
            return;
        }
        setResponse(null);
        setSuccesfullyUploaded(false);
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
        if (editable) {
            if (userImages.length > 0) {
                formData.append("userImages", JSON.stringify(userImages));
            }
            if (toBeDeleted.length > 0) {
                for (let i = 0; i < toBeDeleted.length; i++)
                    formData.append("toBeDeleted", toBeDeleted[i]);
            }
        }
        formData.append("eventLocation", data.eventLocation);
        formData.append("eventDate", eventDate.toISOString());
        formData.append("startTime", startTime.toISOString());
        formData.append("endTime", endTime.toISOString());

        if (!editable) {
            EventService.addEvent(formData).then((res) => {
                setResponse(res);
                if (res.status === 201) {
                    setSuccesfullyUploaded(true);
                }
                if (res.status / 100 === 4) {
                    setSuccesfullyUploaded(true);
                }
            });
        } else {
            EventService.updateEvent(formData, eventID).then((res) => {
                if (res.status === 200) alert("Edit Success");
                else alert(res.status);
            });
        }
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
                    {...register("title")}
                    key={"event-title"}
                    value={title}
                    id="outlined-full-width"
                    label="Title"
                    onChange={handleTitle}
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
                    {...register("description")}
                    key={"event-description"}
                    value={description}
                    onChange={handleDescription}
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
                                value={location}
                                onChange={handleLocation}
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
                        {uploadedImages.length
                            ? uploadedImages.map((item) => (
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
                            : !userImages && (
                                  <h4 className="no-media">No media</h4>
                              )}
                        {userImages.length &&
                            userImages.map((item) => (
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
                                    />
                                    <div className="remove-image-button">
                                        <IconButton
                                            onClick={(e) =>
                                                removeUserImages(
                                                    e,
                                                    item["name"]
                                                )
                                            }
                                            aria-label="delete"
                                        >
                                            <DeleteIcon fontSize="large" />
                                        </IconButton>
                                    </div>
                                </div>
                            ))}
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
                        color={editable ? "default" : "primary"}
                        startIcon={editable && <EditIcon />}
                    >
                        {editable ? "Edit" : "Submit"}
                    </Button>
                </div>
            </form>
            {response && (
                <Snackbar
                    open={succesfullyUploaded}
                    autoHideDuration={6000}
                    onClose={handleClose}
                >
                    {response.status === 200 ||
                    response.status === 201 ||
                    response.status === 202 ? (
                        <Alert onClose={handleClose} severity="success">
                            {response.message}
                        </Alert>
                    ) : (
                        <Alert onClose={handleClose} severity="error">
                            {response.message}
                        </Alert>
                    )}
                </Snackbar>
            )}
        </div>
    );
}
