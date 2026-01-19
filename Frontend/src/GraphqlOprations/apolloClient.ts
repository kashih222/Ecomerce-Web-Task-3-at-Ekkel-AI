import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { from } from "@apollo/client";

const httpLink = new HttpLink({
  uri: import.meta.env.VITE_BACKEND_PRODUCTION_URL,

});
console.log(import.meta.env.VITE_BACKEND_PRODUCTION_URL);
const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const client = new ApolloClient({
  link: from([authLink, httpLink]),
  cache: new InMemoryCache(),
});

export default client;
