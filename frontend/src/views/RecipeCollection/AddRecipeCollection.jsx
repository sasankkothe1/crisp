import React, { useState } from "react";

import { useForm } from "react-hook-form";

import { Button, styled, TextField, IconButton } from "@material-ui/core";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import DeleteIcon from "@material-ui/icons/Delete";

import MenuItem from "@material-ui/core/MenuItem";

import "../Post/PostView.css";

import RecipeCollectionService from "../../services/RecipeCollectionService";

import SnackbarAlert from "../../components/Alert/SnackbarAlert";
import TagCloud from "../../components/Shop/TagCloud";

export default function AddRecipeCollectionView() {
    const { handleSubmit, register } = useForm();

    const [tags, setTags] = useState([]);

    const [charactersLeft, setCharactersLeft] = useState(500);
    const [uploadedMedia, setUploadedMedia] = useState([]);
    const [uploadedPdfFile, setUploadedPdfFile] = useState("");

    const handleMediaOnChange = (e) => {
        e.preventDefault();
        [...e.target.files].forEach((file) => {
            let name = file["name"];
            let reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onloadend = () => {
                setUploadedMedia((oldImages) => [
                    ...oldImages,
                    { file, name, preview: reader.result },
                ]);
            };
        });
    };

    const handlePdfFileOnChange = (e) => {
        e.preventDefault();
        [...e.target.files].forEach((file) => {
            let name = file["name"];
            let reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onloadend = () => {
                setUploadedPdfFile({ file, name, preview: reader.result });
            };
        });
    };

    const removeMedia = (e, name) => {
        e.preventDefault();
        const newArray = uploadedMedia.filter((image) => {
            return image["name"] != name;
        });
        setUploadedMedia(newArray);
    };

    const removePdfFile = (e) => {
        e.preventDefault();
        setUploadedPdfFile("");
    };

    const [uploadAttempt, setUploadAttempt] = useState(false);
    const [response, setResponse] = useState();

    const addRecipeCollection = (data) => {
        const formData = new FormData();
        formData.append("title", data.title);
        formData.append("description", data.description);
        formData.append("price", data.price);
        uploadedMedia.forEach((file) => formData.append("media", file["file"]));
        formData.append("pdfFile", uploadedPdfFile["file"]);
        tags.forEach((tag) => formData.append("tags", tag));

        if (data.meal !== "Any") {
            formData.append("meal", data.meal);
        }

        RecipeCollectionService.addRecipeCollection(formData)
            .then((res) => {
                setUploadAttempt(true);
                if (res.status === 201) {
                    setResponse({
                        status: 201,
                        message: `Success! Created new RC with id = ${res.data.id}`,
                    });
                } else {
                    setResponse({
                        status: 502,
                        message: "Failed to create new recipe collection :(",
                    });
                }
            })
            .catch((err) => console.log(err));
    };

    const Input = styled("input")({
        display: "none",
    });

    const mealTypes = ["Any", "Breakfast", "Dinner", "Snacks", "Lunch"];

    return (
        <div className="post-form-container">
            <form
                encType="multipart/form-data"
                onSubmit={handleSubmit(addRecipeCollection)}
            >
                <button
                    type="submit"
                    disabled
                    style={{ display: "none" }}
                    aria-hidden="true"
                ></button>

                <TextField
                    key={"rc-title"}
                    {...register("title")}
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
                    key={"rc-description"}
                    {...register("description")}
                    multiline
                    rows={4}
                    maxLength="8"
                    inputProps={{
                        maxLength: "500",
                    }}
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

                <TextField
                    key={"rc-price"}
                    {...register("price")}
                    type="number"
                    label="Price"
                    style={{ margin: 8 }}
                    placeholder="Enter the price"
                    fullWidth
                    margin="normal"
                    InputLabelProps={{
                        shrink: true,
                    }}
                    InputProps={{
                        inputProps: {
                            max: 1000,
                            min: 1,
                        },
                    }}
                    variant="outlined"
                />

                <div className="upload-container">
                    <div className="upload-button-container">
                        <label htmlFor="contained-button-media">
                            <Input
                                id="contained-button-media"
                                multiple
                                type="file"
                                onChange={handleMediaOnChange}
                            />
                            <Button
                                variant="contained"
                                component="span"
                                startIcon={<CloudUploadIcon />}
                            >
                                Upload Media
                            </Button>
                        </label>
                    </div>
                    <div className="upload-preview-container">
                        {uploadedMedia.length ? (
                            uploadedMedia.map((item) => (
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
                                                removeMedia(e, item["name"])
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

                <div className="upload-container">
                    <div className="upload-button-container">
                        <label htmlFor="contained-button-pdf">
                            <Input
                                id="contained-button-pdf"
                                type="file"
                                accept=".pdf"
                                onChange={handlePdfFileOnChange}
                            />
                            <Button
                                variant="contained"
                                component="span"
                                startIcon={<CloudUploadIcon />}
                            >
                                Upload Pdf
                            </Button>
                        </label>
                    </div>
                    <div className="upload-preview-container">
                        {uploadedPdfFile ? (
                            <div
                                className="pdf-preview-container"
                                key={uploadedPdfFile["name"]}
                                style={{
                                    border: "1px solid gray",
                                }}
                            >
                                <iframe
                                    className="preview"
                                    src={uploadedPdfFile.preview}
                                ></iframe>
                                <div className="remove-image-button">
                                    <IconButton
                                        onClick={(e) => removePdfFile(e)}
                                        aria-label="delete"
                                    >
                                        <DeleteIcon fontSize="large" />
                                    </IconButton>
                                </div>
                            </div>
                        ) : (
                            <h4 className="no-media">No file</h4>
                        )}
                    </div>
                </div>

                <TagCloud
                    key={"post-tags"}
                    other={register("tags")}
                    label="Tags"
                    placeholder="Enter tag..."
                    tags={tags}
                    setTags={setTags}
                    handleNewTag={(tag) => {
                        const currentTagTrimmed = tag.trim();
                        if (!currentTagTrimmed) {
                            return false;
                        }
                        if (tags.indexOf(currentTagTrimmed) !== -1) {
                            return false;
                        }
                        setTags([...tags, currentTagTrimmed]);
                        return true;
                    }}
                />

                <TextField
                    key={"rc-meal"}
                    {...register("meal")}
                    label="Meal"
                    style={{ margin: 8 }}
                    placeholder="Enter the title"
                    fullWidth
                    select
                    margin="normal"
                    InputLabelProps={{
                        shrink: true,
                    }}
                    variant="outlined"
                >
                    {mealTypes.map((meal) => (
                        <MenuItem key={meal} value={meal}>
                            {meal}
                        </MenuItem>
                    ))}
                </TextField>

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
            {response && (
                <SnackbarAlert
                    open={uploadAttempt}
                    success={response.status == 201}
                    onClose={() => {
                        setResponse(null);
                        setUploadAttempt(false);
                    }}
                    onSuccess={() => response.message}
                    onError={() => response.message}
                />
            )}
        </div>
    );
}
