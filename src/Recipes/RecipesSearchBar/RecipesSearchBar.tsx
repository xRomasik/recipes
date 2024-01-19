import { MultiSelect } from "react-multi-select-component";
import { Option } from "../../App";
import { Box, Stack } from "@mui/material";
import { Ingredient } from "../../data/ingredients";

export const RecipesSearchBar = (props: {
  ingredients: Ingredient[];
  selected: Option[];
  setSelected: (options: Option[]) => void;
}) => {
  const { ingredients, setSelected } = props;

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
      <Box sx={{ width: "100%" }}>
        <MultiSelect
          className="RecipesSearchBar"
          overrideStrings={{
            noOptions: "Žádné ingredience",
            search: "Hledat",
            selectAll: "Vybrat vše",
            selectSomeItems: "Vyberte...",
            create: "Vytvořit",
          }}
          hasSelectAll={false}
          labelledBy="label"
          value={props.selected}
          onChange={setSelected}
          options={ingredients.map((ing) => ({
            value: ing.name,
            label: ing.name,
          }))}
        />
      </Box>
    </Stack>
  );
};
