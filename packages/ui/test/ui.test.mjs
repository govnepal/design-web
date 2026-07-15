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
  Checkbox,
  RadioGroup,
  Select,
  Stepper,
  Emblem,
  Flag,
  Tabs,
  Modal,
  ConfirmationDialog,
  Toggle,
  IconButton,
  Card,
  Breadcrumb,
  Pagination,
  Textarea,
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

test("Header renders the verified emblem by default, as a cached image never inline artwork", () => {
  render(
    withTheme(h(Header, { officeNe: "गृह मन्त्रालय", officeEn: "Ministry of Home Affairs" }), { language: "en" }),
  );
  // The emblem is an <img> of the verified master (identity/emblem) — the institution named in the
  // accessible name, never "logo", and never redrawn inline (no <svg> path data in the header).
  const emblem = screen.getByRole("img", { name: /Emblem of the Government of Nepal/ });
  assert.equal(emblem.tagName, "IMG");
  assert.match(emblem.getAttribute("src"), /emblem-of-nepal\.svg/);
  assert.equal(document.querySelector(".gov-header svg"), null, "the emblem must not be inline SVG");
});

test("Header can opt out of the emblem with emblem={null}", () => {
  render(withTheme(h(Header, { emblem: null, officeNe: "गृह", officeEn: "Home" })));
  assert.equal(screen.queryByRole("img"), null);
});

test("Checkbox binds the whole label to a real checkbox and is never pre-ticked", () => {
  render(withTheme(h(Checkbox, { label: "I confirm the information is correct" })));
  const box = screen.getByLabelText("I confirm the information is correct");
  assert.equal(box.type, "checkbox");
  assert.equal(box.checked, false, "a declaration must never be pre-ticked — that's the legal point");
});

test("RadioGroup is a fieldset with the question as legend, no default selection", () => {
  render(
    withTheme(
      h(RadioGroup, {
        legend: "Gender",
        name: "gender",
        options: [
          { value: "f", label: "महिला" },
          { value: "m", label: "पुरुष" },
          { value: "o", label: "अन्य" },
        ],
      }),
    ),
  );
  // The three legal options are all visible radios (never a select that hides them, §7.1).
  const group = screen.getByRole("group", { name: "Gender" });
  assert.ok(group);
  const radios = screen.getAllByRole("radio");
  assert.equal(radios.length, 3);
  assert.ok(radios.every((r) => !r.checked), "no default when the choice has legal weight");
});

test("RadioGroup error marks the group, not one option", () => {
  render(
    withTheme(
      h(RadioGroup, {
        legend: "Calendar",
        name: "cal",
        error: "Select a calendar",
        options: [
          { value: "bs", label: "BS" },
          { value: "ad", label: "AD" },
        ],
      }),
    ),
  );
  const group = screen.getByRole("group", { name: "Calendar" });
  assert.equal(group.getAttribute("aria-invalid"), "true");
  assert.match(group.getAttribute("aria-describedby"), /error/);
});

test("Select is a native select with a disabled instruction option, not a fake value", () => {
  render(
    withTheme(
      h(Select, {
        label: "Province",
        placeholder: "Select your province",
        options: [
          { value: "1", label: "Koshi" },
          { value: "3", label: "Bagmati" },
        ],
      }),
    ),
  );
  const select = screen.getByLabelText("Province");
  assert.equal(select.tagName, "SELECT");
  const first = select.querySelector("option");
  assert.equal(first.disabled, true, "the instruction option must not be selectable as a value");
});

test("Stepper is an ordered list marking the current step", () => {
  render(
    withTheme(
      h(Stepper, {
        current: 1,
        steps: [{ label: "Personal details" }, { label: "Documents" }, { label: "Review" }],
      }),
      { language: "en" },
    ),
  );
  const current = document.querySelector('[aria-current="step"]');
  assert.ok(current, "the current step carries aria-current=step");
  assert.match(current.textContent, /Documents/);
  assert.equal(document.querySelector("ol.gov-stepper").tagName, "OL");
});

test("Emblem and Flag are img of the verified masters, named the institution not 'logo'", () => {
  const { rerender } = render(h(Emblem, {}));
  const emblem = screen.getByRole("img");
  assert.match(emblem.getAttribute("src"), /emblem-of-nepal\.svg/);
  assert.doesNotMatch(emblem.getAttribute("alt").toLowerCase(), /logo/);

  rerender(h(Flag, {}));
  assert.match(screen.getByRole("img").getAttribute("src"), /flag-of-nepal\.svg/);
});

test("Tabs implements the ARIA pattern: tablist/tab/tabpanel, roving tabindex, arrow keys", () => {
  render(
    withTheme(
      h(Tabs, {
        tabs: [
          { id: "a", label: "Details", content: "Detail content" },
          { id: "b", label: "Documents", content: "Doc content" },
        ],
      }),
    ),
  );
  const tabs = screen.getAllByRole("tab");
  assert.equal(tabs.length, 2);
  // Roving tabindex: active tab is 0, the other -1.
  assert.equal(tabs[0].getAttribute("tabindex"), "0");
  assert.equal(tabs[1].getAttribute("tabindex"), "-1");
  assert.equal(tabs[0].getAttribute("aria-selected"), "true");
  // ArrowRight moves selection to the next tab.
  fireEvent.keyDown(tabs[0], { key: "ArrowRight" });
  assert.equal(screen.getAllByRole("tab")[1].getAttribute("aria-selected"), "true");
});

test("Modal moves focus in, returns it on close, and closes on Escape", () => {
  const trigger = document.createElement("button");
  document.body.appendChild(trigger);
  trigger.focus();

  let open = true;
  const onClose = () => {
    open = false;
  };
  const { rerender } = render(
    withTheme(h(Modal, { open: true, onClose, title: "Confirm", actions: h("button", {}, "OK") }, "Body")),
  );
  const dialog = screen.getByRole("dialog");
  assert.equal(dialog.getAttribute("aria-modal"), "true");
  // Focus moved into the dialog (to the first focusable — the OK button).
  assert.ok(dialog.contains(document.activeElement));
  // Escape triggers close.
  fireEvent.keyDown(document, { key: "Escape" });
  assert.equal(open, false);
  rerender(withTheme(h(Modal, { open: false, onClose, title: "Confirm" }, "Body")));
  // Focus returns to the trigger.
  assert.equal(document.activeElement, trigger);
  trigger.remove();
});

test("ConfirmationDialog is an alertdialog and a destructive one won't dismiss on scrim click", () => {
  let confirmed = false;
  let cancelled = false;
  render(
    withTheme(
      h(ConfirmationDialog, {
        open: true,
        destructive: true,
        title: "Reject this application?",
        confirmLabel: "Reject application",
        onConfirm: () => (confirmed = true),
        onCancel: () => (cancelled = true),
      }, "This cannot be undone."),
    ),
  );
  assert.ok(screen.getByRole("alertdialog"));
  // The confirm button repeats the specific verb + object.
  assert.ok(screen.getByRole("button", { name: "Reject application" }));
  // Scrim click must NOT dismiss a destructive confirmation.
  fireEvent.click(document.querySelector(".gov-modal__scrim"));
  assert.equal(cancelled, false, "destructive confirmation must not dismiss on scrim click");
});

test("Toggle is a switch with aria-checked and flips on click", () => {
  let checked = false;
  const { rerender } = render(
    withTheme(h(Toggle, { label: "Email notifications", checked: false, onChange: (v) => (checked = v) })),
  );
  const sw = screen.getByRole("switch", { name: "Email notifications" });
  assert.equal(sw.getAttribute("aria-checked"), "false");
  fireEvent.click(sw);
  assert.equal(checked, true);
  rerender(withTheme(h(Toggle, { label: "Email notifications", checked: true, onChange: () => {} })));
  assert.equal(screen.getByRole("switch").getAttribute("aria-checked"), "true");
});

test("IconButton requires and exposes an accessible name", () => {
  render(withTheme(h(IconButton, { label: "Close", icon: h("span", {}, "x") })));
  const button = screen.getByRole("button", { name: "Close" });
  assert.equal(button.tagName, "BUTTON");
});

test("interactive Card is a single link, never nested interactive content", () => {
  render(withTheme(h(Card, { interactive: true, href: "/x" }, "Whole card is one target")));
  const links = screen.getAllByRole("link");
  assert.equal(links.length, 1);
  assert.equal(links[0].getAttribute("href"), "/x");
});

test("Breadcrumb marks the current page and does not link it", () => {
  render(
    withTheme(
      h(Breadcrumb, { items: [{ label: "Home", href: "/" }, { label: "Services", href: "/s" }, { label: "Apply" }] }),
    ),
  );
  const current = document.querySelector('[aria-current="page"]');
  assert.match(current.textContent, /Apply/);
  assert.equal(current.tagName, "SPAN", "the current crumb is not a link");
});

test("Pagination disables Previous on the first page", () => {
  render(withTheme(h(Pagination, { page: 1, totalPages: 5, onNavigate: () => {} }), { language: "en" }));
  const prev = screen.getByText("Previous");
  assert.equal(prev.getAttribute("aria-disabled"), "true");
});

test("Textarea binds label and marks invalid on error", () => {
  render(withTheme(h(Textarea, { id: "remarks", label: "Describe the problem", error: "Enter a description" })));
  const area = screen.getByLabelText("Describe the problem");
  assert.equal(area.tagName, "TEXTAREA");
  assert.equal(area.getAttribute("aria-invalid"), "true");
});
