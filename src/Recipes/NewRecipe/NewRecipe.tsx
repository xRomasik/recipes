import React, { useState } from "react";
import {
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Checkbox,
  FormControlLabel,
  SelectChangeEvent,
  Stack,
  Chip,
  Box,
} from "@mui/material";
import {
  Recipe,
  RecipeTypeTranslation,
  RecipeWithDocId,
} from "../../data/recipes";
import { RecipesSearchBar } from "../RecipesSearchBar/RecipesSearchBar";
import { Ingredient } from "../../data/ingredients";
import { addRecipe } from "../../firebase/firebaseConfig";
import { getKeys } from "../../helpers/object";

const defaultState: Recipe = {
  name: "",
  type: "main",
  ingredients: [],
  complexity: null,
  url: [],
  mealPrep: false,
};

export const NewRecipe = (props: {
  ingredients: Ingredient[];
  setRecipes: React.Dispatch<React.SetStateAction<RecipeWithDocId[]>>;
}) => {
  const [recipeData, setRecipeData] = useState<Recipe>(defaultState);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setRecipeData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setRecipeData((prevData) => ({
      ...prevData,
      [name]: checked,
    }));
  };

  const handleUrlChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { value } = e.target;
    setRecipeData((prevData) => ({
      ...prevData,
      url: [value],
    }));
  };

  const handleSelectChange = (event: SelectChangeEvent<string>) => {
    const { name, value } = event.target;
    setRecipeData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Basic form validation
    if (recipeData.url[0] && !recipeData.url[0]?.startsWith("https://")) {
      alert("URL adresa receptu musí začínat: https://");
    }

    if (
      recipeData.name &&
      recipeData.type &&
      recipeData.ingredients.length > 0
    ) {
      await addRecipe(recipeData, props.setRecipes);
      setRecipeData(defaultState);
      // You may also want to reset the form or provide some feedback to the user upon successful submission
    } else {
      // Handle form validation error
      alert("Je nutné vyplnit všechny povinné položky");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Stack direction="column" spacing={2} p={3}>
        <TextField
          label="Název receptu"
          name="name"
          value={recipeData.name}
          onChange={handleInputChange}
          required
        />
        <FormControl>
          <InputLabel>Typ</InputLabel>
          <Select
            name="type"
            value={recipeData.type}
            onChange={handleSelectChange}
            required
            label="Typ"
          >
            {getKeys(RecipeTypeTranslation).map((key) => (
              <MenuItem key={key} value={key}>
                {RecipeTypeTranslation[key]}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <RecipesSearchBar
          ingredients={props.ingredients}
          selected={recipeData.ingredients.map((ing) => {
            return {
              label: ing,
              value: ing,
            };
          })}
          setSelected={(selection) => {
            setRecipeData((prevData) => ({
              ...prevData,
              ingredients: selection.map((ingredient) => ingredient.label),
            }));
          }}
        />
        {recipeData.ingredients.length > 0 && (
          <Box>
            {recipeData.ingredients.map((ingredient) => {
              return (
                <Chip
                  key={ingredient}
                  label={ingredient}
                  color="success"
                  sx={{
                    mr: "5px",
                    mt: "4px",
                    color: "black",
                    backgroundColor: "rgb(170, 235, 148)",
                  }}
                />
              );
            })}
          </Box>
        )}
        <TextField
          label="Časová náročnost"
          name="complexity"
          type="number"
          value={recipeData.complexity || ""}
          onChange={handleInputChange}
        />

        <TextField
          label="Url odkaz"
          name="url"
          value={recipeData.url[0]}
          onChange={handleUrlChange}
        />

        <FormControlLabel
          control={
            <Checkbox
              name="mealPrep"
              checked={recipeData.mealPrep}
              onChange={handleCheckboxChange}
            />
          }
          label="Meal Prep"
        />

        <Button type="submit" variant="contained" color="primary">
          Vytvořit recept
        </Button>
      </Stack>
    </form>
  );
};
