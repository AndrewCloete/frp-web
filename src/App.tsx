import { useEffect, useState } from "react";
import "./App.css";
import * as m from "./model";
import * as _ from "lodash/fp";

async function getItems<T>(collection: string): Promise<T[]> {
  const url = "http://localhost:8090";
  const requestOptionsFetch = {
    method: "GET",
  };
  const response = await fetch(url + "/" + collection, requestOptionsFetch);
  const tasks_data = (await response.json()) as T[];
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

function Groceries(props: { groceries: m.Grocery[] }) {
  console.log(props.groceries);
  const groups = _.groupBy((t: m.Grocery) => t.sec)(props.groceries);
  const [filterSelected, setFilterSelected] = useState<boolean>(false);

  return (
    <div className="Groceries">
      <div>
        Filter selected
        <input
          type="checkbox"
          checked={filterSelected && true}
          readOnly
          onClick={() => {
            setFilterSelected(!filterSelected);
          }}
        ></input>
      </div>
      {Object.entries(groups).map((entry) => {
        let section = entry[0];
        let groceries = entry[1];
        return (
          <div className="GrocerySection" key={section}>
            <div>
              <b>{section}</b>
            </div>
            <table>
              <tbody>
                {groceries
                  .filter((g) => (filterSelected ? !g.selected : true))
                  .map((g) => {
                    return (
                      <tr key={g.name}>
                        <td>
                          <input
                            type="checkbox"
                            checked={g.selected && true}
                            readOnly
                            onClick={() => {
                              g.selected = !g.selected;
                              console.log(props.groceries);
                            }}
                          ></input>
                        </td>
                        <td className="GroceryTableName">{g.name}</td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        );
      })}
    </div>
  );
}

function DropdownSelector(props: {
  options: string[];
  set: (selected: string) => void;
}) {
  const [selectedOption, setSelectedOption] = useState<string>("");

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    let val = event.target.value;
    props.set(val);
    setSelectedOption(val);
  };
  return (
    <div>
      <select id="dropdown" value={selectedOption} onChange={handleChange}>
        {props.options.map((option, index) => (
          <option key={index} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

const tabs = ["Recipes", "Groceries"] as const;
export type Tab = (typeof tabs)[number];

function App() {
  let [tab, setTab] = useState<Tab>("Recipes");
  let [recipes, setRecipes] = useState<m.Recipe[]>([]);
  let [groceries, setGroceries] = useState<m.Grocery[]>([]);

  async function load() {
    const r = await getItems<m.Recipe>("recipes");
    const g = await getItems<m.Grocery>("groceries");
    setRecipes(r);
    setGroceries(g);
  }
  useEffect(() => {
    load();
    return;
  }, []);

  const renderContent = () => {
    switch (tab) {
      case "Recipes":
        return <Recipes recipes={recipes}></Recipes>;
      case "Groceries":
        return <Groceries groceries={groceries}></Groceries>;
    }
  };

  return (
    <div className="App">
      <DropdownSelector
        options={tabs.map((t) => t)}
        set={(s) => setTab(s as Tab)}
      ></DropdownSelector>
      {renderContent()}
    </div>
  );
}

export default App;
