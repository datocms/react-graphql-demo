import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import client from "../client.js";
import qs from "qs";
import { Image } from "react-datocms"

const RECIPES_PER_PAGE = 2;

const Home = props => {
  const [recipes, setRecipes] = useState();
  const [isFetching, setIsFetching] = useState(false);
  const [skipping, setSkip] = useState(0);

  useEffect(
    () => {
      setIsFetching(true);
      const skip =
        parseInt(
          qs.parse(props.location.search, { ignoreQueryPrefix: true }).skip,
          10
        ) || 0;
      setSkip(skip);
      const variables = {
        skip,
        first: RECIPES_PER_PAGE
      };
      console.log(skip);
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
    [props.location.search]
  );

  return (
    <section>
      <ul className="Home-ul">
        {recipes &&
          recipes.recipes.map(recipe => (
            <li className="Home-li" key={`recipe-${recipe.id}`}>
              <Link to={`/recipes/${recipe.slug}`} className="Home-link">
                <Image
                  className="Home-img"
                  data={recipe.coverImage.responsiveImage}
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
      {isFetching && <p className="Home-li-title">...Loading</p>}
      {recipes && recipes.meta.count > RECIPES_PER_PAGE && (
        <Link
          className="Home-button"
          disabled={isFetching}
          to={`?skip=${skipping + RECIPES_PER_PAGE}`}
        >
          Show More Recipes
        </Link>
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
        responsiveImage(imgixParams: { fit: crop, w: 300, h: 180 }) {
          aspectRatio
          width
          sizes
          srcSet
          src
          webpSrcSet
          alt
          title
          base64
        }
      }
    }
  }
`;

export default Home;
