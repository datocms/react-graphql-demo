import React, { useEffect, useState } from "react";
import client from "../client.js";
import Markdown from "react-markdown";

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
            <h1>{recipe.title}</h1>
            <div className="Recipe-placeholder">
              <img alt={recipe.title} src={recipe.coverImage.url} />
            </div>
            <Markdown source={recipe.abstract} escapeHtml={false} />
            {recipe.content.map(block => {
              if (block.__typename === "TextImageBlockRecord") {
                return (
                  <div key={block.id}>
                    <img alt={block.image.alt} src={block.image.url} />
                    <Markdown source={block.text} escapeHtml={false} />
                  </div>
                );
              } else if (block.__typename === "TextBlockRecord") {
                return (
                  <div key={block.id}>
                    <p>{block.text}</p>
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
