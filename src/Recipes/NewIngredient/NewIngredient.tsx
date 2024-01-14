import { useState } from "react";
import { TextField, Button, Stack } from "@mui/material";
import { Ingredient } from "../../data/ingredients";
import { addIngredient } from "../../firebase/firebaseConfig";

export const NewIngredient = (props: {
  ingredients: Ingredient[];
  setIngredients: React.Dispatch<React.SetStateAction<Ingredient[]>>;
}) => {
  const [ingredient, setIngredient] = useState<string>("");

  return (
    <Stack direction="column" spacing={2} p={3}>
      <TextField
        label="Ingredience"
        name="ingredient"
        onChange={(e) => setIngredient(e.target.value)}
        value={ingredient}
      />

      <Button
        type="button"
        onClick={async () => {
          if (
            props.ingredients.find(
              (ing) =>
                ing.name.toLocaleLowerCase().trim() ===
                ingredient.toLocaleLowerCase().trim()
            )
          ) {
            alert("Zadaná ingredience již existuje");
            return;
          }

          await addIngredient(ingredient.toLowerCase(), props.setIngredients);
          setIngredient("");
        }}
        variant="contained"
        color="primary"
      >
        Přidat ingredienci
      </Button>
    </Stack>
  );
};
