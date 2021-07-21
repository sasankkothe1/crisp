import React, { useState } from "react";

import { useForm } from "react-hook-form";

import "./PostView.css";

import { Button, styled, TextField, IconButton } from "@material-ui/core";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import DeleteIcon from "@material-ui/icons/Delete";
import { Form } from "react-bootstrap";
import PostService from "../../services/PostService";

export default function PostView() {
    const { handleSubmit, register } = useForm();

    const [charactersLeft, setCharactersLeft] = useState(500);
    const [uploadedImages, setUploadedImages] = useState([]);

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
        PostService.addPost(formData).then((res) => {
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
