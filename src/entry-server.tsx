import React from "react";
import { renderToString } from "react-dom/server";
import App from "./App";

export function renderPage(url: string) {
  return renderToString(<App ssrLocation={url} />);
}
