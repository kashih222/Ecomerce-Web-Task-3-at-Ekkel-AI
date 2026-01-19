import { ApolloClient, InMemoryCache, HttpLink, from } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

// ✅ GraphQL endpoint from env
const httpLink = new HttpLink({
  uri: `${import.meta.env.VITE_BACKEND_PRODUCTION_URL}/graphql`,
  credentials: "include",
});

console.log("✅ GraphQL URI:", `${import.meta.env.VITE_BACKEND_PRODUCTION_URL}/graphql`);

// ✅ Attach JWT token
const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem("token");

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

// ✅ Apollo Client
const client = new ApolloClient({
  link: from([authLink, httpLink]),
  cache: new InMemoryCache(),
});

export default client;
