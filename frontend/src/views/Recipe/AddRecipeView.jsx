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
    Snackbar,
} from "@material-ui/core";
import MuiAlert from "@material-ui/lab/Alert";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import AddIcon from "@material-ui/icons/Add";
import DeleteIcon from "@material-ui/icons/Delete";
import { Form } from "react-bootstrap";
import RecipeService from "../../services/RecipeService";
import EditIcon from "@material-ui/icons/Edit";

import "./RecipeView.css";

export default function AddRecipeView({ recipeID, editable }) {
    const { handleSubmit, register } = useForm();

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [cuisine, setCuisine] = useState("");

    const [checked, setChecked] = useState([0]);
    const [charactersLeft, setCharactersLeft] = useState(500);
    const [uploadedImages, setUploadedImages] = useState([]);
    const [ingredientsList, setIngredientsList] = useState([]);
    const [instructionsList, setInstructionsList] = useState([]);
    const [recipe, setRecipe] = useState();
    const [succesfullyUploaded, setSuccesfullyUploaded] = useState(false);
    const [response, setResponse] = useState();
    // userImages: these are the images that already user have. These are present in the post[media]
    const [userImages, setUserImages] = useState([]);

    //toBeDeletedImages: List of urls that contain the images that are to be deleted
    const [toBeDeleted, setToBeDeleted] = useState([]);

    useEffect(() => {
        if (recipeID) {
            RecipeService.recipeById(recipeID).then((res) => {
                setRecipe(res);
                setTitle(res["title"]);
                setDescription(res["description"]);
                setCuisine(res["cuisine"]);
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
                res["ingredientsList"].map((el) => {
                    setIngredientsList((oldIngredients) => [
                        ...oldIngredients,
                        {
                            ingredientName: el["ingredientName"],
                            ingredientQuantity: el["ingredientQuantity"],
                        },
                    ]);
                });
                res["instructions"].map((el) => {
                    setInstructionsList((oldInstructions) => [
                        ...oldInstructions,
                        el,
                    ]);
                });
            });
        }
    }, []);

    const addIngredient = () => {
        setIngredientsList([{ ingredientName: "", ingredientQuantity: "" }]);
    };

    const addInstruction = () => {
        setInstructionsList([""]);
    };

    const handleTitle = (e) => {
        setTitle(e.target.value);
    };

    const handleDescription = (e) => {
        setDescription(e.target.value);
    };

    const handleCuisine = (e) => {
        setCuisine(e.target.value);
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

        formData.append("ingredientsList", JSON.stringify(ingredientsList));
        if (instructionsList.length > 0) {
            for (let i = 0; i < instructionsList.length; i++) {
                formData.append("instructions", instructionsList[i]);
            }
        }

        formData.append("cuisine", data.cuisine);

        if (!editable) {
            RecipeService.addRecipe(formData).then((res) => {
                setResponse(res);
                if (res.status === 201) {
                    setSuccesfullyUploaded(true);
                }
                if (res.status / 100 === 4) {
                    setSuccesfullyUploaded(true);
                }
            });
        } else {
            RecipeService.updateRecipe(formData, recipeID).then((res) => {
                if (res.status === 200) alert("Edit Success");
                else alert(res.status, res.message);
            });
        }
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
        if (recipeID && !editable) {
            return (
                <List>
                    {ingredients.map((el, i) => {
                        const { ingredientName, ingredientQuantity } = el;
                        const labelId = `checkbox-list-label-${ingredientName}`;

                        return (
                            <ListItem
                                key={i}
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
                                    key={i}
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
        if (recipeID && !editable) {
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
                    {...register("title")}
                    value={title}
                    onChange={handleTitle}
                    key={"recipe-title"}
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
                    {...register("description")}
                    value={description}
                    onChange={handleDescription}
                    disabled={!editable && false}
                    key={"recipe-description"}
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
                            {recipe !== undefined && !editable ? (
                                renderIngredientsList(recipe["ingredientsList"])
                            ) : ingredientsList.length === 0 ? (
                                <Button
                                    variant="contained"
                                    onClick={addIngredient}
                                >
                                    Add Ingredients
                                </Button>
                            ) : (
                                ingredientsList &&
                                ingredientsList.map((ingredient, i) => {
                                    let keyIndex = i;
                                    return (
                                        <div key={i} className="ingredient-row">
                                            <TextField
                                                key={++keyIndex}
                                                size={"small"}
                                                id="outlined-full-width"
                                                variant="outlined"
                                                name="ingredientName"
                                                placeholder={"Ingredient Name"}
                                                className="ingredient-text-field"
                                                value={
                                                    ingredient["ingredientName"]
                                                }
                                                onChange={(e) =>
                                                    handleInputChange(e, i)
                                                }
                                            />
                                            <TextField
                                                key={++keyIndex}
                                                size={"small"}
                                                id="outlined-full-width"
                                                variant="outlined"
                                                name="ingredientQuantity"
                                                className="ingredient-text-field"
                                                placeholder={"Quantity"}
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
                                                    key={++keyIndex}
                                                    size={"small"}
                                                    aria-label="delete"
                                                    onClick={(e) =>
                                                        handleRemoveClick(e, i)
                                                    }
                                                >
                                                    <DeleteIcon />
                                                </IconButton>

                                                <IconButton
                                                    key={++keyIndex}
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
                <div className="recipe-instructions-container">
                    <div className="ingredients-details-container">
                        <label>Instructions</label>
                        <div className="instructions-list">
                            {recipe !== undefined && !editable ? (
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
                                    let keyIndex = i;
                                    return (
                                        <div
                                            key={++keyIndex}
                                            className="instructions-row"
                                        >
                                            <TextField
                                                key={++keyIndex}
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
                                                    key={++keyIndex}
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
                                                    key={++keyIndex}
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
                    {...register("cuisine")}
                    value={cuisine}
                    onChange={handleCuisine}
                    key={"recipe-cuisine"}
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
                    disabled={!editable && true}
                />
                {recipe && editable && (
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
                                color={editable ? "default" : "primary"}
                                startIcon={editable && <EditIcon />}
                            >
                                {editable ? "Edit" : "Submit"}
                            </Button>
                        </div>
                    </>
                )}
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
