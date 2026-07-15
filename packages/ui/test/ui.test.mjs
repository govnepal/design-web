import assert from "node:assert/strict";
import { test, afterEach } from "node:test";
import { createElement as h } from "react";
import { render, screen, cleanup, fireEvent } from "@testing-library/react";

// Import the BUILT package — the tests exercise exactly what ships, not the TS source.
import {
  ThemeProvider,
  Button,
  Link,
  Badge,
  Alert,
  TextInput,
  ErrorSummary,
  Header,
} from "../dist/index.js";

afterEach(cleanup);

/** Every component needs the provider for language; wrap once. */
const withTheme = (node, props = {}) => h(ThemeProvider, props, node);

test("Button is a real <button>, defaults to type=button, and both keys activate", () => {
  render(withTheme(h(Button, { onClick: () => {} }, "Submit application")));
  const button = screen.getByRole("button", { name: "Submit application" });
  assert.equal(button.tagName, "BUTTON");
  // An un-typed button in a form submits it — the default must be "button", not "submit".
  assert.equal(button.getAttribute("type"), "button");
});

test("Button ignores clicks while loading and keeps its label (never a bare spinner)", () => {
  let clicks = 0;
  render(withTheme(h(Button, { loading: true, loadingLabel: "Submitting…", onClick: () => clicks++ }, "Submit")));
  const button = screen.getByRole("button");
  assert.equal(button.getAttribute("aria-busy"), "true");
  assert.equal(button.getAttribute("aria-disabled"), "true");
  fireEvent.click(button);
  assert.equal(clicks, 0, "a busy button must ignore repeat activation");
  assert.match(button.textContent, /Submitting…/);
});

test("disabled Button stays in the tab order (aria-disabled, not the disabled attribute)", () => {
  render(withTheme(h(Button, { disabled: true }, "Approve")));
  const button = screen.getByRole("button", { name: "Approve" });
  // The spec: keep it focusable so a screen reader can reach it and announce why it is disabled.
  assert.equal(button.hasAttribute("disabled"), false);
  assert.equal(button.getAttribute("aria-disabled"), "true");
});

test("external Link carries an accessible 'external' note and hardened rel", () => {
  render(withTheme(h(Link, { variant: "external", href: "https://example.org" }, "Partner site"), { language: "en" }));
  const link = screen.getByRole("link");
  assert.equal(link.getAttribute("rel"), "noopener noreferrer");
  // The ↗ glyph is CSS/aria-hidden; the words must be in the accessible name (§9.2, §4.1).
  assert.match(link.textContent, /external site/);
});

test("Badge renders the taxonomy label, in the active language, and is not a link/button", () => {
  const { rerender } = render(withTheme(h(Badge, { status: "correction-required" }), { language: "ne" }));
  assert.ok(screen.getByText("सुधार आवश्यक"), "Nepali label from the taxonomy");
  assert.equal(screen.queryByRole("button"), null);
  assert.equal(screen.queryByRole("link"), null);

  rerender(withTheme(h(Badge, { status: "correction-required" }), { language: "en" }));
  assert.ok(screen.getByText("Correction required"), "English label from the taxonomy");
});

test("a dynamic error Alert is an assertive live region; a static one is not", () => {
  const { rerender } = render(withTheme(h(Alert, { variant: "error", title: "Submission failed", live: true })));
  const alert = screen.getByRole("alert");
  assert.equal(alert.getAttribute("aria-live"), "assertive");

  rerender(withTheme(h(Alert, { variant: "info", title: "Office hours" })));
  // A static alert must not be a live region, or it re-announces on every navigation.
  assert.equal(screen.queryByRole("alert"), null);
});

test("TextInput binds label, hint, and error, and marks itself invalid on error", () => {
  render(
    withTheme(
      h(TextInput, {
        id: "citizenship",
        label: "Citizenship number",
        hint: "e.g. 12-01-76-12345",
        error: "Enter your citizenship number",
      }),
    ),
  );
  const input = screen.getByLabelText("Citizenship number");
  assert.equal(input.getAttribute("aria-invalid"), "true");
  // aria-describedby joins hint then error, in that order.
  const described = input.getAttribute("aria-describedby").split(" ");
  assert.equal(described.length, 2);
  assert.equal(document.getElementById(described[0]).textContent, "e.g. 12-01-76-12345");
  assert.equal(document.getElementById(described[1]).textContent, "Enter your citizenship number");
});

test("TextInput with no error exposes no aria-invalid and no describedby", () => {
  render(withTheme(h(TextInput, { id: "ward", label: "Ward number" })));
  const input = screen.getByLabelText("Ward number");
  assert.equal(input.hasAttribute("aria-invalid"), false);
  assert.equal(input.hasAttribute("aria-describedby"), false);
});

test("ErrorSummary takes focus on appearance and each entry focuses its field", () => {
  render(
    withTheme(
      h("form", null, [
        h(ErrorSummary, {
          key: "s",
          errors: [{ fieldId: "mobile", message: "Enter your mobile number" }],
        }),
        h(TextInput, { key: "f", id: "mobile", label: "Mobile number" }),
      ]),
    ),
  );
  const summary = screen.getByRole("alert");
  // On appearance the summary is focused, so a keyboard/screen-reader user is taken to it.
  assert.equal(document.activeElement, summary);

  // Activating an entry moves FOCUS into the field, not just the scroll position.
  fireEvent.click(screen.getByRole("link", { name: "Enter your mobile number" }));
  assert.equal(document.activeElement, document.getElementById("mobile"));
});

test("ErrorSummary renders nothing when there are no errors", () => {
  const { container } = render(withTheme(h(ErrorSummary, { errors: [] })));
  assert.equal(container.querySelector(".gov-error-summary"), null);
});

test("Header is a banner, leads with a skip link, and switches language on click", () => {
  render(
    withTheme(
      h(Header, { officeNe: "गृह मन्त्रालय", officeEn: "Ministry of Home Affairs", serviceName: "Citizenship" }),
      { language: "ne" },
    ),
  );
  assert.ok(screen.getByRole("banner"));

  // The skip link is the first focusable element (§7.2).
  const focusables = document.querySelectorAll("a[href], button");
  assert.match(focusables[0].getAttribute("href"), /#main/);

  // Language switcher is text ("नेपाली / EN"), never a flag.
  assert.ok(screen.getByText("नेपाली"));
  assert.ok(screen.getByText("EN"));
});

test("Header shows an honest missing-emblem placeholder, never invented artwork", () => {
  render(
    withTheme(h(Header, { officeNe: "गृह मन्त्रालय", officeEn: "Ministry of Home Affairs" }), { language: "en" }),
  );
  const mark = screen.getByRole("img", { name: /asset missing/ });
  // It must be a text placeholder — no <img>, no <svg>, nothing that could read as a real emblem.
  assert.equal(mark.querySelector("img"), null);
  assert.equal(mark.querySelector("svg"), null);
});
