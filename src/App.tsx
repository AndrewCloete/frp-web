import { useEffect, useState } from "react";
import "./App.css";
import * as m from "./model";

async function getRecipes(): Promise<m.Recipe[]> {
  const url = "http://localhost:8090";
  const requestOptionsFetch = {
    method: "GET",
  };
  const response = await fetch(url + "/recipes", requestOptionsFetch);
  const tasks_data = (await response.json()) as m.Recipe[];
  return tasks_data;
}

function Ingredients(props: { r: m.Recipe }) {
  return (
    <div className="RecipeInTable">
      <table>
        <tbody>
          {props.r.ingredients.map((i) => {
            return (
              <tr key={i.name}>
                <td>{i.name}</td>
                <td>
                  {JSON.stringify(i.qty)
                    .replaceAll('"', "")
                    .replace("{", "")
                    .replace(":", " ")
                    .replace("}", "")}
                  {i.note ? `(${i.note})` : null}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function Instructions(props: { r: m.Recipe }) {
  return (
    <div className="RecipeInstructions">
      {props.r.instructions.split("\n").map((l) => {
        return <div key={l}>{l}</div>;
      })}
    </div>
  );
}

function Title(props: { r: m.Recipe }) {
  return (
    <div className="RecipeTitle">
      <div>
        <b>{props.r.name}</b>
      </div>
      <div>Serves {props.r.serves}</div>
    </div>
  );
}

function RecipeLine(props: { r: m.Recipe }) {
  let [open, setOpen] = useState<boolean>(false);
  function flip() {
    setOpen(!open);
  }
  return (
    <div className="RecipeLine">
      {open ? (
        <Recipe r={props.r} click={flip}></Recipe>
      ) : (
        <RecipeListItem r={props.r} click={flip}></RecipeListItem>
      )}
    </div>
  );
}

function Recipe(props: { r: m.Recipe; click: () => void }) {
  return (
    <div className="Recipe">
      <div onClick={props.click}>
        <Title r={props.r}></Title>
      </div>
      <Ingredients r={props.r}></Ingredients>
      <Instructions r={props.r}></Instructions>
    </div>
  );
}

function RecipeListItem(props: { r: m.Recipe; click: () => void }) {
  return (
    <div className="RecipeListItem">
      <div onClick={props.click}>
        <Title r={props.r}></Title>
      </div>
      <div className="RecipeListImageDiv">
        <img
          className="RecipeListImage"
          src={`img/${props.r.name}.jpg`}
          alt=""
        ></img>
      </div>
    </div>
  );
}

function Recipes(props: { recipes: m.Recipe[] }) {
  return (
    <div className="Recipes">
      {props.recipes.map((r) => {
        return <RecipeLine key={r.name} r={r}></RecipeLine>;
      })}
    </div>
  );
}

function App() {
  let [recipes, setRecipes] = useState<m.Recipe[]>([]);

  async function loadRecipes() {
    const r = await getRecipes();
    setRecipes(r);
  }

  useEffect(() => {
    loadRecipes();
    return;
  }, []);

  return (
    <div className="App">
      <Recipes recipes={recipes}></Recipes>
    </div>
  );
}

export default App;
