import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import client from "../client.js";

const RECIPES_PER_PAGE = 2;

const Home = props => {
  const [recipes, setRecipes] = useState();
  const [skip, setSkip] = useState(0);
  const [isFetching, setIsFetching] = useState(false);

  useEffect(
    () => {
      const variables = {
        skip,
        first: RECIPES_PER_PAGE
      };
      const fetchData = async () => {
        try {
          const result = await client.request(query, variables);
          setRecipes(result);
          setIsFetching(false);
        } catch (error) {
          console.error(JSON.stringify(error, undefined, 2));
          setIsFetching(false);
        }
      };

      fetchData();
    },
    [skip]
  );

  return (
    <section>
      <ul className="Home-ul">
        {recipes &&
          recipes.recipes.map(recipe => (
            <li className="Home-li" key={`recipe-${recipe.id}`}>
              <Link to={`/recipes/${recipe.slug}`} className="Home-link">
                <img
                  alt={recipe.title}
                  className="Home-img"
                  src={recipe.coverImage.url}
                />
                <div>
                  <h3 className="Home-li-title">{recipe.title}</h3>
                  <p>
                    {recipe.abstract
                      .split(" ")
                      .slice(0, 10)
                      .join(" ")}
                    ...
                  </p>
                </div>
              </Link>
            </li>
          ))}
      </ul>
      {recipes && recipes.meta.count > RECIPES_PER_PAGE && (
        <button
          className="Home-button"
          disabled={isFetching}
          onClick={() => setSkip(skip + RECIPES_PER_PAGE)}
        >
          {isFetching ? "Loading..." : "Show More Recipes"}
        </button>
      )}
    </section>
  );
};

const query = `
  query recipes($first: IntType!, $skip: IntType!) {
    meta: _allRecipesMeta {
      count
    }
    recipes: allRecipes(orderBy: _createdAt_DESC, first: $first, skip: $skip) {
      id
      title
      slug
      abstract
      coverImage {
        url
      }
    }
  }
`;

export default Home;
