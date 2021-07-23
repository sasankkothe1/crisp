/* eslint-disable react/prop-types */
import React, { useState, useEffect } from "react";

import { useForm } from "react-hook-form";
import {
    Button,
    styled,
    TextField,
    IconButton,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Checkbox,
} from "@material-ui/core";

import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import AddIcon from "@material-ui/icons/Add";
import DeleteIcon from "@material-ui/icons/Delete";
import { Form } from "react-bootstrap";
import RecipeService from "../../services/RecipeService";

import "./RecipeView.css";

export default function AddRecipeView({ recipeID }) {
    const { handleSubmit, register } = useForm();

    const [checked, setChecked] = useState([0]);
    const [charactersLeft, setCharactersLeft] = useState(500);
    const [uploadedImages, setUploadedImages] = useState([]);
    const [ingredientsList, setIngredientsList] = useState([]);
    const [instructionsList, setInstructionsList] = useState([]);
    const [recipe, setRecipe] = useState();

    useEffect(() => {
        if (recipeID) {
            RecipeService.recipeById(recipeID).then((res) => {
                setRecipe(res);
            });
        }
    }, [recipe]);

    const addIngredient = () => {
        setIngredientsList([{ ingredientName: "", ingredientQuantity: "" }]);
    };

    const addInstruction = () => {
        setInstructionsList([""]);
    };

    // handle input change
    const handleInputChange = (e, index) => {
        e.preventDefault();
        const { name, value } = e.target;
        const list = [...ingredientsList];
        list[index][name] = value;
        setIngredientsList(list);
    };

    const handleInputChangeInstruction = (e, index) => {
        e.preventDefault();
        const { value } = e.target;
        const list = [...instructionsList];
        list[index] = value;
        setInstructionsList(list);
    };

    // handle click event of the Remove button
    const handleRemoveClick = (e, index) => {
        e.preventDefault();
        const list = [...ingredientsList];
        list.splice(index, 1);
        setIngredientsList(list);
    };

    const handleRemoveInstruction = (e, index) => {
        e.preventDefault();
        const list = [...instructionsList];
        list.splice(index, 1);
        setInstructionsList(list);
    };

    // handle click event of the Add button
    const handleAddClick = () => {
        setIngredientsList([
            ...ingredientsList,
            { ingredientName: "", ingredientQuantity: "" },
        ]);
    };

    const handleAddIngredient = () => {
        setInstructionsList([...instructionsList, ""]);
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
            for (let i = 0; i < uploadedImages.length; i++) {
                formData.append("media", uploadedImages[i]["file"]);
            }
        }

        formData.append("ingredientsList", JSON.stringify(ingredientsList));
        if (instructionsList.length > 0) {
            for (let i = 0; i < instructionsList.length; i++) {
                formData.append("instructions", instructionsList[i]);
            }
        }

        formData.append("cuisine", data.cuisine);

        RecipeService.addRecipe(formData).then((res) => {
            console.log(res);
        });
    };

    const handleToggle = (value) => () => {
        const currentIndex = checked.indexOf(value);
        const newChecked = [...checked];

        if (currentIndex === -1) {
            newChecked.push(value);
        } else {
            newChecked.splice(currentIndex, 1);
        }

        setChecked(newChecked);
    };

    const renderIngredientsList = (ingredients) => {
        if (recipeID) {
            return (
                <List>
                    {ingredients.map((el) => {
                        const { ingredientName, ingredientQuantity } = el;
                        const labelId = `checkbox-list-label-${ingredientName}`;

                        return (
                            <ListItem
                                key={ingredientName}
                                role={undefined}
                                dense
                                button
                                onClick={handleToggle(ingredientName)}
                            >
                                <ListItemIcon>
                                    <Checkbox
                                        edge="start"
                                        checked={
                                            checked.indexOf(ingredientName) !==
                                            -1
                                        }
                                        tabIndex={-1}
                                        disableRipple
                                        inputProps={{
                                            "aria-labelledby": labelId,
                                        }}
                                    />
                                </ListItemIcon>
                                <ListItemText
                                    id={labelId}
                                    primary={`${ingredientName} : ${ingredientQuantity}`}
                                />
                            </ListItem>
                        );
                    })}
                </List>
            );
        }
    };

    const renderInstructionsList = (instructions) => {
        if (recipeID) {
            return (
                <List>
                    {instructions.map((el, i) => {
                        const labelId = `checkbox-list-label-${i}`;

                        return (
                            <ListItem
                                key={i}
                                role={undefined}
                                dense
                                button
                                onClick={handleToggle(i)}
                            >
                                <ListItemIcon>
                                    <Checkbox
                                        edge="start"
                                        checked={checked.indexOf(i) !== -1}
                                        tabIndex={-1}
                                        disableRipple
                                        inputProps={{
                                            "aria-labelledby": labelId,
                                        }}
                                    />
                                </ListItemIcon>
                                <ListItemText id={labelId} primary={`${el}`} />
                            </ListItem>
                        );
                    })}
                </List>
            );
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
                    value={recipe && recipe["title"]}
                    key={"recipe-title"}
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
                    disabled={recipe && true}
                />
                <TextField
                    value={recipe && recipe["description"]}
                    disabled={recipe && true}
                    key={"recipe-description"}
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
                        e.preventDefault();
                        let maxChars = 500;
                        let textLength = String(e.target.value).length;
                        setCharactersLeft(maxChars - textLength);
                    }}
                />
                <div className="event-container">
                    <div className="ingredients-details-container">
                        <label>Ingredients</label>
                        <div className="ingredients-list">
                            {recipe !== undefined ? (
                                renderIngredientsList(recipe["ingredientsList"])
                            ) : ingredientsList.length === 0 ? (
                                <Button
                                    variant="contained"
                                    onClick={addIngredient}
                                >
                                    Add Ingredients
                                </Button>
                            ) : (
                                ingredientsList.map((ingredient, i) => {
                                    return (
                                        <div key={i} className="ingredient-row">
                                            <TextField
                                                size={"small"}
                                                id="outlined-full-width"
                                                variant="outlined"
                                                name="ingredientName"
                                                className="ingredient-text-field"
                                                value={
                                                    ingredient["ingredientName"]
                                                }
                                                onChange={(e) =>
                                                    handleInputChange(e, i)
                                                }
                                            />
                                            <TextField
                                                size={"small"}
                                                id="outlined-full-width"
                                                variant="outlined"
                                                name="ingredientQuantity"
                                                className="ingredient-text-field"
                                                value={
                                                    ingredient[
                                                        "ingredientQuantity"
                                                    ]
                                                }
                                                onChange={(e) =>
                                                    handleInputChange(e, i)
                                                }
                                            />
                                            <div className="btn-box">
                                                <IconButton
                                                    key={i}
                                                    size={"small"}
                                                    aria-label="delete"
                                                    onClick={(e) =>
                                                        handleRemoveClick(e, i)
                                                    }
                                                >
                                                    <DeleteIcon />
                                                </IconButton>

                                                <IconButton
                                                    key={i}
                                                    disabled={
                                                        !(
                                                            ingredientsList.length -
                                                                1 ===
                                                            i
                                                        )
                                                    }
                                                    size={"small"}
                                                    aria-label="add"
                                                    onClick={handleAddClick}
                                                >
                                                    <AddIcon />
                                                </IconButton>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
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
                <div className="recipe-instructions-container">
                    <div className="ingredients-details-container">
                        <label>Instructions</label>
                        <div className="instructions-list">
                            {recipe !== undefined ? (
                                renderInstructionsList(recipe["instructions"])
                            ) : instructionsList.length === 0 ? (
                                <Button
                                    variant="contained"
                                    onClick={addInstruction}
                                >
                                    Add Instruction
                                </Button>
                            ) : (
                                instructionsList.map((instruction, i) => {
                                    return (
                                        <div
                                            key={i}
                                            className="instructions-row"
                                        >
                                            <TextField
                                                size={"small"}
                                                id="outlined-full-width"
                                                variant="outlined"
                                                name="ingredientQuantity"
                                                className="instructions-text-field"
                                                value={instruction}
                                                onChange={(e) =>
                                                    handleInputChangeInstruction(
                                                        e,
                                                        i
                                                    )
                                                }
                                            />
                                            <div className="btn-box">
                                                <IconButton
                                                    key={i}
                                                    size={"small"}
                                                    aria-label="delete"
                                                    onClick={(e) =>
                                                        handleRemoveInstruction(
                                                            e,
                                                            i
                                                        )
                                                    }
                                                >
                                                    <DeleteIcon />
                                                </IconButton>

                                                <IconButton
                                                    key={i}
                                                    disabled={
                                                        !(
                                                            instructionsList.length -
                                                                1 ===
                                                            i
                                                        )
                                                    }
                                                    size={"small"}
                                                    aria-label="add"
                                                    onClick={
                                                        handleAddIngredient
                                                    }
                                                >
                                                    <AddIcon />
                                                </IconButton>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>
                </div>

                <TextField
                    value={recipe && recipe["cuisine"]}
                    key={"recipe-cuisine"}
                    {...register("cuisine")}
                    id="outlined-full-width"
                    label="Cuisine"
                    style={{ margin: 8 }}
                    placeholder="Enter the cuisine"
                    fullWidth
                    margin="normal"
                    InputLabelProps={{
                        shrink: true,
                    }}
                    variant="outlined"
                    disabled={recipe && true}
                />
                {!recipe && (
                    <>
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
                    </>
                )}
            </form>
        </div>
    );
}
