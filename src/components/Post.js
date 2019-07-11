import React, { useEffect, useState } from "react";
import client from "../client.js";
import Markdown from "react-markdown";

const Post = props => {
  const [post, setPost] = useState();
  const [isFetching, setIsFetching] = useState(false);

  useEffect(
    () => {
      const fetchData = async () => {
        try {
          const variables = {
            slug: props.match.params.slug
          };
          const result = await client.request(query, variables);
          setPost(result.post);
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
        <h2>Loading post...</h2>
      ) : (
        post && (
          <article>
            <h1>{post.title}</h1>
            <div className="Post-placeholder">
              <img alt={post.title} src={post.coverImage.url} />
            </div>
            <Markdown source={post.abstract} escapeHtml={false} />
            {post.content.map(block => {
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
  query singlePost($slug: String!) {
    post: post(filter: { slug: { eq: $slug } }) {
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

export default Post;
