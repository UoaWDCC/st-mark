import React from "react";
import { render, RenderResult } from "@testing-library/react";
import { createMemoryHistory, MemoryHistory } from "history";
import { Router } from "react-router-dom";

const renderWithRouter = (
  component: React.ReactElement,
  route = "/"
): { history: MemoryHistory; renderResult: RenderResult } => {
  const history = createMemoryHistory();
  history.push(route);
  const renderResult = render(<Router history={history}>{component}</Router>);
  return {
    history,
    renderResult,
  };
};

export default renderWithRouter;
