import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import client from "../client.js";

const POSTS_PER_PAGE = 4;

const Home = () => {
  const [recipies, setRecipies] = useState();
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await client.request(query, variables);
        setRecipies(result.posts);
        setIsFetching(false);
      } catch (error) {
        console.error(JSON.stringify(error, undefined, 2));
        setIsFetching(false);
      }
    };

    fetchData();
  }, []);

  return (
    <section>
      <ul className="Home-ul">
        {recipies &&
          recipies.map(post => (
            <li className="Home-li" key={`post-${post.id}`}>
              <Link to={`/post/${post.slug}`} className="Home-link">
                <img
                  alt={post.title}
                  className="Home-img"
                  src={post.coverImage.url}
                />
                <div>
                  <h3>{post.title}</h3>
                  <p>{post.abstract}</p>
                </div>
              </Link>
            </li>
          ))}
      </ul>
      <div className="Home-showMoreWrapper">
        {false ? (
          <button className="Home-button" disabled={isFetching}>
            {isFetching ? "Loading..." : "Show More Posts"}
          </button>
        ) : (
          ""
        )}
      </div>
    </section>
  );
};

const query = `
  query posts($first: IntType!, $skip: IntType!) {
    meta: _allPostsMeta {
      count
    }
    posts: allPosts(orderBy: _createdAt_DESC, first: $first, skip: $skip) {
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

const variables = {
  skip: 0,
  first: POSTS_PER_PAGE
};

export default Home;
