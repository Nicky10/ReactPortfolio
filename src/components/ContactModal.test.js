import React, { useState } from "react";
import { render, fireEvent, wait } from "@testing-library/react";
import ContactModal from "./ContactModal";

const labels = {
  title: "Let’s connect",
  name: "Name",
  email: "Email",
  submit: "Send message",
  close: "Close",
  required: "Please enter your name and email.",
  sending: "Sending…",
};

function ContactHarness() {
  const [show, setShow] = useState(false);
  return (
    <div>
      <button type="button" onClick={() => setShow(true)}>
        Open contact
      </button>
      <ContactModal show={show} onHide={() => setShow(false)} labels={labels} />
    </div>
  );
}

it("moves focus into the dialog on open and restores it on Escape", async () => {
  const { getByRole, getByLabelText, queryByRole } = render(<ContactHarness />);
  const trigger = getByRole("button", { name: "Open contact" });
  trigger.focus();
  fireEvent.click(trigger);

  await wait(() => {
    expect(getByRole("dialog")).toBeInTheDocument();
    expect(getByLabelText("Name")).toHaveFocus();
  });

  fireEvent.keyDown(document, { key: "Escape", code: "Escape" });

  await wait(() => {
    expect(queryByRole("dialog")).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });
});

it("keeps required-field validation available to keyboard users", async () => {
  const { getByRole, getByText } = render(
    <ContactModal show onHide={() => {}} labels={labels} />
  );

  await wait(() => {
    expect(getByRole("dialog")).toBeInTheDocument();
  });

  fireEvent.submit(getByRole("dialog").querySelector("form"));
  expect(getByText("Please enter your name and email.")).toBeInTheDocument();
});

it("does not close with Escape while a submission is in progress", async () => {
  const onHide = jest.fn();
  const fetchMock = jest.spyOn(global, "fetch").mockReturnValue(new Promise(() => {}));
  const { getByRole, getByLabelText } = render(
    <ContactModal
      show
      onHide={onHide}
      labels={labels}
      endpoint="https://example.com/contact"
    />
  );

  await wait(() => {
    expect(getByLabelText("Name")).toBeInTheDocument();
  });

  fireEvent.change(getByLabelText("Name"), { target: { name: "name", value: "Ada" } });
  fireEvent.change(getByLabelText("Email"), {
    target: { name: "email", value: "ada@example.com" },
  });
  fireEvent.submit(getByRole("dialog").querySelector("form"));

  await wait(() => {
    expect(getByRole("button", { name: "Sending…" })).toBeDisabled();
  });

  fireEvent.keyDown(document, { key: "Escape", code: "Escape" });
  expect(onHide).not.toHaveBeenCalled();
  expect(getByRole("dialog")).toBeInTheDocument();

  fetchMock.mockRestore();
});
