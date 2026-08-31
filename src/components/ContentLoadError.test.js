import React from "react";
import { render, fireEvent } from "@testing-library/react";
import ContentLoadError from "./ContentLoadError";

it("shows an accessible retry action and contact fallback", () => {
  const onRetry = jest.fn();
  const { getByRole } = render(
    <ContentLoadError
      title="Content couldn’t load"
      body="The portfolio content didn’t load."
      retryLabel="Try again"
      contactHref="mailto:nicolas.felipedelgado@gmail.com"
      contactLabel="Email Nicolas"
      onRetry={onRetry}
    />
  );

  expect(getByRole("alert")).toHaveTextContent("Content couldn’t load");
  fireEvent.click(getByRole("button", { name: "Try again" }));
  expect(onRetry).toHaveBeenCalledTimes(1);
  expect(getByRole("link", { name: "Email Nicolas" })).toHaveAttribute(
    "href",
    "mailto:nicolas.felipedelgado@gmail.com"
  );
});

it("omits the contact fallback when no contact route is available", () => {
  const { queryByRole, getByRole } = render(
    <ContentLoadError
      title="Content couldn’t load"
      body="The portfolio content didn’t load."
      retryLabel="Try again"
      onRetry={() => {}}
    />
  );

  expect(getByRole("button", { name: "Try again" })).toBeInTheDocument();
  expect(queryByRole("link", { name: "Email Nicolas" })).not.toBeInTheDocument();
});
