import React, { useEffect, useState } from "react";
import client from "../client.js";
import Markdown from "react-markdown";
import { Image } from "react-datocms"
import { Link } from "react-router-dom";

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
            <strong>
              By <Link to={"/about"}>{recipe.author.name}</Link>
            </strong>
            <Markdown
              source={recipe.abstract}
              escapeHtml={false}
              className="Recipe-abstract"
            />
            <Image
              className="Recipe-cover"
              data={recipe.coverImage.responsiveImage}
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
                    <Image
                      className="Recipe-flag-image"
                      data={block.image.responsiveImage}
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
      author {
        name
      }
      abstract
      ingredients
      coverImage {
        responsiveImage(imgixParams: { fit: crop, w: 1000, h: 500 }) {
          srcSet
          webpSrcSet
          sizes
          src
          width
          height
          aspectRatio
          alt
          title
          bgColor
          base64
        }
      }
      content {
        ... on TextImageBlockRecord {
          id
          __typename
          image {
            responsiveImage(imgixParams: { fit: crop, w: 300, h: 300 }) {
              srcSet
              webpSrcSet
              sizes
              src
              width
              height
              aspectRatio
              alt
              title
              bgColor
              base64
            }
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
