/* eslint-disable react/prop-types */
import React, { useState, useEffect } from "react";

import { useForm } from "react-hook-form";

import "./PostView.css";

import {
    Button,
    styled,
    TextField,
    IconButton,
    Snackbar,
} from "@material-ui/core";
import MuiAlert from "@material-ui/lab/Alert";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import DeleteIcon from "@material-ui/icons/Delete";
import { Form } from "react-bootstrap";
import PostService from "../../services/PostService";
import EditIcon from "@material-ui/icons/Edit";

export default function PostView({ postID, editable }) {
    const { handleSubmit, register } = useForm();

    //TODO: setTitle, setDescription

    const [charactersLeft, setCharactersLeft] = useState(500);

    // uploadedImages: used while uploading the images while creating the post
    const [uploadedImages, setUploadedImages] = useState([]);
    const [successfullyUploaded, setSuccessfullyUploaded] = useState(false);
    const [response, setResponse] = useState();
    const [post, setPost] = useState();

    // userImages: these are the images that already user have. These are present in the post[media]
    const [userImages, setUserImages] = useState([]);

    //toBeDeletedImages: List of urls that contain the images that are to be deleted
    const [toBeDeleted, setToBeDeleted] = useState([]);
    useEffect(() => {
        if (postID) {
            PostService.postById(postID).then((res) => {
                setPost(res);
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
        setSuccessfullyUploaded(false);
    };

    const addPost = (data) => {
        const formData = new FormData();
        formData.append("title", data.title);
        formData.append("description", data.description);
        if (data.contentType === "Premium")
            formData.append("premiumStatus", true);
        else formData.append("premiumStatus", false);
        if (uploadedImages.length > 0) {
            for (let i = 0; i < uploadedImages.length; i++) {
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
        if (!editable) {
            PostService.addPost(formData).then((res) => {
                setResponse(res);
                if (res.status === 201) {
                    setSuccessfullyUploaded(true);
                }
                if (res.status / 100 === 4) {
                    setSuccessfullyUploaded(true);
                }
            });
        } else {
            PostService.updatePost(formData, postID).then((res) => {
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
                    defaultValue={editable && post && post["title"]}
                    key={"post-title"}
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
                    defaultValue={editable && post && post["description"]}
                    key={"post-description"}
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

                <div className="upload-container">
                    <div className="upload-button-container">
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
                    <div className="upload-preview-container">
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
                                      />
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
                    open={successfullyUploaded}
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
