import React, { useEffect, useState } from "react";
import client from "../client.js";
import Markdown from "react-markdown";
import Imgix from "react-imgix";

const Recipe = props => {
  const [recipe, setRecipe] = useState();
  const [isFetching, setIsFetching] = useState(false);

  useEffect(
    () => {
      const fetchData = async () => {
        try {
          const variables = {
            slug: props.match.params.slug
          };
          const result = await client.request(query, variables);
          setRecipe(result.recipe);
          setIsFetching(false);
        } catch (error) {
          console.error(JSON.stringify(error, undefined, 2));
          setIsFetching(false);
        }
      };

      fetchData();
    },
    [props.match.params.slug]
  );

  return (
    <section>
      {isFetching ? (
        <h2>Loading recipe...</h2>
      ) : (
        recipe && (
          <article>
            <h1 className="Recipe-title">{recipe.title}</h1>
            <Markdown
              source={recipe.abstract}
              escapeHtml={false}
              className="Recipe-abstract"
            />
            <Imgix
              alt={recipe.title}
              src={recipe.coverImage.url}
              sizes="100vw"
              className="Recipe-cover"
            />
            <div className="Recipe-box">
              <h5 className="Recipe-box-title">Ingredients</h5>
              <Markdown source={recipe.ingredients} escapeHtml={false} />
            </div>
            {recipe.content.map((block, i) => {
              if (block.__typename === "TextImageBlockRecord") {
                return (
                  <div key={block.id} className="Recipe-flag">
                    <div className="Recipe-flag-number">{i + 1}</div>
                    <Imgix
                      alt={block.image.alt}
                      src={block.image.url}
                      sizes="50vw"
                      className="Recipe-flag-image"
                    />
                    <Markdown
                      source={block.text}
                      className="Recipe-flag-text"
                    />
                  </div>
                );
              } else if (block.__typename === "TextBlockRecord") {
                return (
                  <div key={block.id} className="Recipe-flag">
                    <div className="Recipe-flag-number">{i + 1}</div>
                    <Markdown
                      source={block.text}
                      className="Recipe-flag-text"
                    />
                  </div>
                );
              }
              return <div key={block.id} />;
            })}
          </article>
        )
      )}
    </section>
  );
};

const query = `
  query singleRecipe($slug: String!) {
    recipe: recipe(filter: { slug: { eq: $slug } }) {
      id
      slug
      title
      abstract
      ingredients
      coverImage {
        url
      }
      content {
        ... on TextImageBlockRecord {
          id
          __typename
          image {
            url
            alt
          }
          text
        }
        ... on TextBlockRecord {
          id
          __typename
          text
        }
      }
    }
  }
`;

export default Recipe;
