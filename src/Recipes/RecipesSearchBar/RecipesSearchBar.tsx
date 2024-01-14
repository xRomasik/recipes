import { MultiSelect } from "react-multi-select-component";
import { Option } from "../../App";
import { Box, Checkbox, FormControlLabel, Stack } from "@mui/material";
import { Ingredient } from "../../data/ingredients";
import { useEffect, useState } from "react";

export const RecipesSearchBar = (props: {
  ingredients: Ingredient[];
  selected: Option[];
  setSelected: (options: Option[]) => void;
}) => {
  const { ingredients, setSelected } = props;
  const [useFridgeAsFilter, setUseFridgeAsFilter] = useState<boolean>(true);

  useEffect(() => {
    if (useFridgeAsFilter) {
      setSelected(
        ingredients
          .filter((ing) => ing.isInFridge)
          .map((ing) => ({
            label: ing.name,
            value: ing.name,
          }))
      );
    }
  }, [useFridgeAsFilter, ingredients, setSelected]);

  return (
    <Stack
      direction="row"
      justifyContent="space-evenly"
      sx={{
        ".dropdown-content": {
          zIndex: "20",
        },
      }}
    >
      <FormControlLabel
        control={
          <Checkbox
            name="useFridgeAsFilter"
            checked={useFridgeAsFilter}
            onChange={(e) => {
              setUseFridgeAsFilter(e.target.checked);
              if (!e.target.checked) {
                setSelected([]);
              }
            }}
          />
        }
        label="Lednice"
      />
      <Box sx={{ width: "70%" }}>
        <MultiSelect
          hasSelectAll={false}
          labelledBy="label"
          value={useFridgeAsFilter ? [] : props.selected}
          onChange={(options: Option[]) => {
            props.setSelected(options);
            setUseFridgeAsFilter(false);
          }}
          options={props.ingredients.map((ing) => ({
            value: ing.name,
            label: ing.name,
          }))}
        />
      </Box>
    </Stack>
  );
};
