import { Box, Chip, Stack } from "@mui/material";
import { Ingredient } from "../../data/ingredients";
import { updateIngredient } from "../../firebase/firebaseConfig";

export const Fridge = (props: {
  ingredients: Ingredient[];
  setIngredients: React.Dispatch<React.SetStateAction<Ingredient[]>>;
}) => {
  // const debouncedUpdateIngredient = useDebounce(() => updateIngredient, 1000)

  const sortedIngredients = [...props.ingredients].sort((a, b) => {
    if (a.isInFridge && !b.isInFridge) {
      return -1;
    } else if (!a.isInFridge && b.isInFridge) {
      return 1;
    } else {
      return a.name.localeCompare(b.name);
    }
  });

  return (
    <Stack direction="column">
      <Box sx={{ textAlign: "center", mt: -2, mb: -2 }}>
        <h2>Lednice</h2>
      </Box>
      <div style={{ marginLeft: "20px", marginTop: "20px" }}>
        {sortedIngredients.map((ingredient) => (
          <Chip
            onClick={() =>
              updateIngredient(
                ingredient,
                !ingredient.isInFridge,
                props.setIngredients
              )
            }
            key={ingredient.id}
            label={ingredient.name}
            color={"default"}
            sx={{
              mr: "5px",
              mt: "4px",
              color: "black",
              backgroundColor: ingredient.isInFridge
                ? "rgb(170, 235, 148)"
                : "rgb(211, 47, 47 / 46%)",
            }}
          />
        ))}
      </div>
    </Stack>
  );
};
