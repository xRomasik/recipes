import { Box, Chip, Stack } from "@mui/material";
import { Ingredient } from "../../data/ingredients";
import { updateIngredientsInFridgeBulk } from "../../firebase/firebaseConfig";
import { useDebounce } from "../../helpers/debounce";
import { useState } from "react";

export const Fridge = (props: {
  ingredients: Ingredient[];
  setIngredients: React.Dispatch<React.SetStateAction<Ingredient[]>>;
}) => {
  const [ingredientsToUpdate, setIngredientsToUpdate] = useState<Ingredient[]>(
    []
  );

  const sortIngredients = () => {
    return [...props.ingredients].sort((a, b) => {
      if (a.isInFridge && !b.isInFridge) {
        return -1;
      } else if (!a.isInFridge && b.isInFridge) {
        return 1;
      } else {
        return a.name.localeCompare(b.name);
      }
    });
  };

  const debouncedUpdateIngredients = useDebounce(
    async (ingredients: Ingredient[]) => {
      try {
        await updateIngredientsInFridgeBulk(ingredients, props.setIngredients);
      } finally {
        setIngredientsToUpdate([]);
      }
    },
    1200
  );

  const isIngredientInFridge = (ingredient: Ingredient): boolean => {
    if (ingredientsToUpdate.map((ing) => ing.id).includes(ingredient.id)) {
      if (ingredient.isInFridge) {
        return false;
      } else {
        return true;
      }
    } else if (ingredient.isInFridge) {
      return true;
    }

    return false;
  };

  return (
    <Stack direction="column">
      <Box sx={{ textAlign: "center", mt: -2, mb: -2 }}>
        <h2>Lednice</h2>
      </Box>
      <div style={{ marginLeft: "20px", marginTop: "20px" }}>
        {sortIngredients().map((ingredient) => {
          return (
            <Chip
              onClick={() => {
                const ingredientToAddIds = ingredientsToUpdate.map(
                  (ing) => ing.id
                );
                let latestIngredientsToUpdate: Ingredient[] = [];

                if (ingredientToAddIds.includes(ingredient.id)) {
                  latestIngredientsToUpdate = ingredientsToUpdate.filter(
                    (ing) => ing.id !== ingredient.id
                  );
                } else {
                  latestIngredientsToUpdate = [
                    ...ingredientsToUpdate,
                    ingredient,
                  ];
                }

                setIngredientsToUpdate(latestIngredientsToUpdate);
                debouncedUpdateIngredients(latestIngredientsToUpdate);
              }}
              key={ingredient.id}
              label={ingredient.name}
              color={"default"}
              sx={{
                mr: "5px",
                mt: "4px",
                color: "black",
                backgroundColor: isIngredientInFridge(ingredient)
                  ? "rgb(170, 235, 148)"
                  : "rgb(211, 47, 47 / 46%)",
              }}
            />
          );
        })}
      </div>
    </Stack>
  );
};
