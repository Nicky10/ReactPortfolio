import React from "react";
import ReactDOM from "react-dom";
import { render, fireEvent } from "@testing-library/react";
import $ from "jquery";
import App from "./App";

beforeEach(() => {
  window.$primaryLanguage = "en";
  window.$secondaryLanguage = "fr";
  jest.spyOn($, "ajax").mockImplementation(() => {});
});

afterEach(() => {
  $.ajax.mockRestore();
});

it("renders without crashing", () => {
  const div = document.createElement("div");
  ReactDOM.render(<App />, div);
  ReactDOM.unmountComponentAtNode(div);
});

it("shows a retryable recovery state when required content fails to load", () => {
  $.ajax.mockImplementation((opts) => {
    opts.error({}, "error", new Error("fail"));
  });

  const { getByRole, queryByRole } = render(<App />);

  expect(getByRole("alert")).toHaveTextContent("Content couldn’t load");
  expect(getByRole("button", { name: "Try again" })).toBeInTheDocument();
  expect(queryByRole("link", { name: "Email Nicolas" })).not.toBeInTheDocument();

  fireEvent.click(getByRole("button", { name: "Try again" }));
  expect($.ajax.mock.calls.length).toBeGreaterThan(2);
});

it("keeps published content when a language request fails", () => {
  const shared = {
    basic_info: {
      name: "Nicolas Delgado",
      social: [{ name: "mail", url: "mailto:nicolas.felipedelgado@gmail.com" }],
    },
  };
  const english = {
    basic_info: {
      description_header: "Hi",
      description: "Intro",
      section_name: {
        about: "About me",
        projects: "Work",
        skills: "Skills",
        certificates: "Certs",
        experience: "Experience",
      },
      ui: {
        load_error: {
          title: "Content couldn’t load",
          language_body:
            "That language couldn’t load. Your current page was left unchanged.",
          retry: "Try again",
          contact: "Email Nicolas",
        },
      },
    },
    projects: [],
    certificates: [],
    experience: [],
  };

  $.ajax.mockImplementation((opts) => {
    const url = String(opts.url);
    if (url.indexOf("portfolio_shared_data") !== -1) {
      opts.success(shared);
      return;
    }
    if (url.indexOf("res_primaryLanguage") !== -1) {
      opts.success(english);
      return;
    }
    opts.error({}, "error", new Error("fail"));
  });

  const { getByText, getByRole, getAllByRole } = render(<App />);
  expect(getByText("Hi")).toBeInTheDocument();

  const frenchToggle = getAllByRole("button").find((button) =>
    /FR/.test(button.textContent || "")
  );
  fireEvent.click(frenchToggle);

  expect(getByText("Hi")).toBeInTheDocument();
  expect(getByRole("alert")).toHaveTextContent(
    "That language couldn’t load. Your current page was left unchanged."
  );
  expect(getByRole("link", { name: "Email Nicolas" })).toHaveAttribute(
    "href",
    "mailto:nicolas.felipedelgado@gmail.com"
  );
});
