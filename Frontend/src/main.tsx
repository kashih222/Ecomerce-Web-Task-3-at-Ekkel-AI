import { StrictMode } from "react";
import { Provider } from "react-redux";
import { createRoot } from "react-dom/client";
import "./index.css";
import client from "./GraphqlOprations/apolloClient.ts";

import App from "./App.tsx";
import  store  from "./Redux Toolkit/store.ts";
import { ApolloProvider } from "@apollo/client";


// const client = new ApolloClient({
//   uri: import.meta.env.VITE_GRAPHQL_ENDPOINT, 
//   link: new HttpLink({ uri: 'http://localhost:4100/graphql' }),
//   cache: new InMemoryCache(),
// });

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ApolloProvider client={client}>
    <Provider store={store}>
      <App />
    </Provider>
    </ApolloProvider>
  </StrictMode>
);
