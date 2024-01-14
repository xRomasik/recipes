// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  QuerySnapshot,
  collection,
  doc,
  addDoc,
  setDoc,
  getDocs,
  getFirestore,
  deleteDoc,
  query,
  where,
  writeBatch,
} from "firebase/firestore/lite";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  User,
  signOut,
  browserLocalPersistence,
} from "firebase/auth";
import { Ingredient, IngredientDocument } from "../data/ingredients";
import { Recipe, RecipeDocument, RecipeWithDocId } from "../data/recipes";

// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCU40CAwOaF2BRUTsvPJbssKA2miUSFtB4",
  authDomain: "recipes-22b90.firebaseapp.com",
  projectId: "recipes-22b90",
  storageBucket: "recipes-22b90.appspot.com",
  messagingSenderId: "1016793890016",
  appId: "1:1016793890016:web:8bb77c2dd64bbd9d57a485",
  measurementId: "G-VYNKH195TC",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const db = getFirestore(app);

// Get a list of Ingredients from your database
export async function getUserIngredients() {
  if (!auth.currentUser?.uid) {
    return [];
  }

  const ingredientsQuery = query(
    collection(db, "ingredients"),
    where("userId", "==", auth.currentUser?.uid)
  );

  const ingredientsSnapshot = (await getDocs(
    ingredientsQuery
  )) as QuerySnapshot<IngredientDocument>;

  const ingredients: Ingredient[] = ingredientsSnapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      name: data["name"],
      isInFridge: data["isInFridge"],
    };
  });

  return ingredients;
}

const provider = new GoogleAuthProvider();

const auth = getAuth();
auth.setPersistence(browserLocalPersistence);

export const googleSignIn = (
  setUser: React.Dispatch<React.SetStateAction<User | null>>
) =>
  signInWithPopup(auth, provider)
    .then((result) => {
      // This gives you a Google Access Token. You can use it to access the Google API.
      // const credential = GoogleAuthProvider.credentialFromResult(result);
      // const token = credential?.accessToken;
      // The signed-in user info.
      const user = result.user;
      // IdP data available using getAdditionalUserInfo(result)
      // ...¨
      setUser(user);
    })
    .catch(() => {
      // // Handle Errors here.
      // const errorCode = error.code;
      // const errorMessage = error.message;
      // // The email of the user's account used.
      // const email = error.customData.email;
      // // The AuthCredential type that was used.
      // const credential = GoogleAuthProvider.credentialFromError(error);
      // ...
    });

export const userSignOut = () => {
  signOut(auth);
};

export const insertIngredients = async (ingredients: Ingredient[]) => {
  const batch = writeBatch(db);

  ingredients.forEach((ingredient) => {
    const ingredientRef = doc(collection(db, "ingredients"));

    batch.set(ingredientRef, {
      name: ingredient.name,
      userId: auth.currentUser?.uid,
    });
  });

  await batch.commit();
};

//TODO
export const insertRecipes = async (recipes: Recipe[]) => {
  const batch = writeBatch(db);

  recipes.forEach((recipe) => {
    const recipeRef = doc(collection(db, "recipes"));

    batch.set(recipeRef, {
      ...recipe,
      userId: auth.currentUser?.uid,
    });
  });

  await batch.commit();
};

export async function getUserRecipes() {
  if (!auth.currentUser?.uid) {
    return [];
  }

  const recipesQuery = query(
    collection(db, "recipes"),
    where("userId", "==", auth.currentUser?.uid)
  );

  const recipesSnapshot = (await getDocs(
    recipesQuery
  )) as QuerySnapshot<RecipeDocument>;

  const recipes: RecipeWithDocId[] = recipesSnapshot.docs.map((doc) => ({
    ...doc.data(),
    docId: doc.id,
  }));

  return recipes;
}

export async function addRecipe(
  recipe: Recipe,
  callback: (recipes: RecipeWithDocId[]) => void
) {
  await addDoc(collection(db, "recipes"), {
    ...recipe,
    userId: auth.currentUser?.uid,
  });

  callback(await getUserRecipes());
}

export async function addIngredient(
  ingredient: string,
  callback: (ingredients: Ingredient[]) => void
) {
  await addDoc(collection(db, "ingredients"), {
    name: ingredient,
    userId: auth.currentUser?.uid,
  });

  callback(await getUserIngredients());
}

export async function updateIngredient(
  ingredient: Ingredient,
  isInFridge: boolean,
  callback: (ingredients: Ingredient[]) => void
) {
  if (!ingredient.id) {
    console.error("ID not provided");
    return;
  }

  await setDoc(doc(db, "ingredients", ingredient.id), {
    name: ingredient.name,
    isInFridge: isInFridge,
    userId: auth.currentUser?.uid,
  });

  callback(await getUserIngredients());
}

export async function deleteRecipe(
  recipeId: string,
  callback: (recipes: RecipeWithDocId[]) => void
) {
  await deleteDoc(doc(db, "recipes", recipeId));
  callback(await getUserRecipes());
}

//TODO Fridge
