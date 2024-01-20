import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Avatar,
  Box,
  Menu,
  MenuItem,
  Tooltip,
  Button,
} from "@mui/material";
import { Sidebar } from "../sidebar/sidebar";
import { useState } from "react";
import { googleSignIn, userSignOut } from "../firebase/firebaseConfig";
import { User } from "firebase/auth";
import { getKeys } from "../helpers/object";
import { Ingredient } from "../data/ingredients";
import { RecipeWithDocId } from "../data/recipes";
import { FridgeSidebar } from "../sidebar/FridgeSidebar";

const settings = {
  logout: {
    label: "Logout",
    action: userSignOut,
  },
};

export const Header = (props: {
  ingredients: Ingredient[];
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  setIngredients: React.Dispatch<React.SetStateAction<Ingredient[]>>;
  setRecipes: React.Dispatch<React.SetStateAction<RecipeWithDocId[]>>;
}) => {
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <AppBar
      position="static"
      sx={{
        backgroundColor: "rgb(231 55 55 / 57%)",
      }}
    >
      <Toolbar variant="dense">
        <Sidebar
          ingredients={props.ingredients}
          setIngredients={props.setIngredients}
          setRecipes={props.setRecipes}
        />
        <FridgeSidebar
          ingredients={props.ingredients}
          setIngredients={props.setIngredients}
        />
        <Typography
          textAlign={"center"}
          variant="h6"
          component="div"
          sx={{ flexGrow: 1 }}
        >
          Recepty
        </Typography>
        {props.user ? (
          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: "45px" }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {getKeys(settings).map((settingKey) => (
                <MenuItem
                  key={settingKey}
                  onClick={() => {
                    settings[settingKey].action();
                    setAnchorElUser(null);
                  }}
                >
                  <Typography textAlign="center">
                    {settings[settingKey].label}
                  </Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        ) : (
          <Button
            color="inherit"
            variant="text"
            onClick={() => googleSignIn(props.setUser)}
          >
            <Typography variant="body2" textAlign="center">
              Login
            </Typography>
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
};
