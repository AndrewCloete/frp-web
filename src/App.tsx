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
function RecipeLine(props: { r: m.Recipe }) {
  let [open, setOpen] = useState<boolean>(false);
  return (
    <div onClick={() => setOpen(!open)}>
      {open ? (
        <Recipe r={props.r}></Recipe>
      ) : (
        <RecipeListItem r={props.r}></RecipeListItem>
      )}
    </div>
  );
}

function Recipe(props: { r: m.Recipe }) {
  return (
    <div className="Recipe">
      <div className="RecipeTitle">
        <div>{props.r.name}</div>
        <div>Serves {props.r.serves}</div>
      </div>
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
      <div className="RecipeInstructions">
        {props.r.instructions.split("\n").map((l) => {
          return <div key={l}>{l}</div>;
        })}
      </div>
    </div>
  );
}

function RecipeListItem(props: { r: m.Recipe }) {
  return <div className="RecipeListItem">{props.r.name}</div>;
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
