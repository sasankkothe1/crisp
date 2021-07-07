import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";

import { TextField } from "@material-ui/core";
export default function PostView() {
    const { control, handleSubmit } = useForm();
    const [charactersLeft, setCharactersLeft] = useState(500);

    const addPost = (data) => {
        console.log(data);
    };

    return (
        <form onSubmit={handleSubmit(addPost)}>
            <Controller
                name="title"
                control={control}
                defaultValue=""
                render={({ field }) => (
                    <TextField
                        {...field}
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
                )}
            />
            <Controller
                name="description"
                control={control}
                defaultValue=""
                render={({ field }) => (
                    <TextField
                        {...field}
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
                )}
            />
            <Controller
                name="media"
                control={control}
                render={({ field }) => <div {...field}></div>}
            />
            <input type="submit" />
        </form>
    );
}
