import { StrictMode } from "react";
import { Provider } from "react-redux";
import { createRoot } from "react-dom/client";
import "./index.css";
import client from "./GraphqlOprations/apolloClient.ts";

import App from "./App.tsx";
import  store  from "./Redux Toolkit/store.ts";
import { ApolloProvider } from "@apollo/client";




createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ApolloProvider client={client}>
    <Provider store={store}>
      <App />
    </Provider>
    </ApolloProvider>
  </StrictMode>
);
