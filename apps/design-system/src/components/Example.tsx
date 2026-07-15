"use client";

import { useState, type ReactNode } from "react";
import {
  Container,
  Stack,
  PageSection,
  Button,
  Link,
  TextInput,
  ErrorSummary,
  Alert,
  Badge,
  Header,
  Checkbox,
  RadioGroup,
  Select,
  Details,
  WarningText,
  PhaseBanner,
  Stepper,
  LanguageSwitcher,
  SkipLink,
  BackLink,
  Breadcrumb,
  Card,
  IconButton,
  Toggle,
  Textarea,
  Tag,
  Footer,
  Tabs,
  Pagination,
  Modal,
  ConfirmationDialog,
  ToastProvider,
  useToast,
  SummaryList,
  CharacterCount,
  Table,
  EmptyState,
  LoadingState,
  Accordion,
  ProgressBar,
  PasswordInput,
  OtpInput,
  AmountInput,
  AddressBlock,
  MaskedValue,
  FileUpload,
  SearchBox,
  CookieBanner,
  OfflineBanner,
  SessionTimeoutWarning,
  type AddressValue,
} from "@govnepal/ui";
import { ModePanel } from "./ModePanel";

// --- Small stateful example wrappers for the interactive components -----------------------
function ToggleExample() {
  const [on, setOn] = useState(true);
  return <Toggle label="Email notifications" checked={on} onChange={setOn} stateLabels={{ on: "On", off: "Off" }} />;
}
function ModalExample() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button type="button" onClick={() => setOpen(true)}>Open modal</Button>
      <Modal open={open} onClose={() => setOpen(false)} title="Change your address"
        actions={<><Button variant="secondary" type="button" onClick={() => setOpen(false)}>Cancel</Button><Button type="button" onClick={() => setOpen(false)}>Save</Button></>}>
        A short, self-contained sub-task, with focus trapped until you close it.
      </Modal>
    </>
  );
}
function ConfirmExample() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="destructive" type="button" onClick={() => setOpen(true)}>Delete application</Button>
      <ConfirmationDialog open={open} destructive title="Delete this application?" confirmLabel="Delete application"
        onConfirm={() => setOpen(false)} onCancel={() => setOpen(false)}>
        This cannot be undone.
      </ConfirmationDialog>
    </>
  );
}
function ToastTrigger() {
  const { toast } = useToast();
  return <Button type="button" onClick={() => toast("Draft saved")}>Save draft</Button>;
}
function ToastExample() {
  return <ToastProvider><ToastTrigger /></ToastProvider>;
}
function CharacterCountExample() {
  const [value, setValue] = useState("");
  return (
    <div>
      <Textarea id="ex-cc" label="Describe the problem" value={value} onChange={(e) => setValue(e.target.value)} maxLength={200} />
      <CharacterCount current={value.length} max={200} />
    </div>
  );
}
function MaskedExample() {
  return <MaskedValue value="12-01-76-12345" name="citizenship number" canReveal onReveal={() => {}} />;
}
function AmountExample() {
  const [v, setV] = useState("1500");
  return <AmountInput label="Fee" value={v} onChange={setV} />;
}
function OtpExample() {
  const [code, setCode] = useState("");
  return <OtpInput label="Enter the 6-digit code we sent to your phone" value={code} onChange={setCode} resendIn={0} onResend={() => {}} />;
}
function AddressExample() {
  const [addr, setAddr] = useState<AddressValue>({});
  return (
    <AddressBlock legend="Permanent address" value={addr} onChange={setAddr}
      provinces={[{ value: "3", label: "Bagmati" }, { value: "1", label: "Koshi" }]}
      districts={addr.province ? [{ value: "27", label: "Kathmandu" }, { value: "24", label: "Lalitpur" }] : []}
      localLevels={addr.district ? [{ value: "27001", label: "Kathmandu Metropolitan City" }] : []} />
  );
}
function SessionTimeoutExample() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button type="button" onClick={() => setOpen(true)}>Simulate idle timeout</Button>
      <SessionTimeoutWarning open={open} secondsLeft={120} onStay={() => setOpen(false)} onSignOut={() => setOpen(false)} />
    </>
  );
}
function CookieBannerExample() {
  const [choice, setChoice] = useState<string | null>(null);
  return (
    <div style={{ position: "relative", minBlockSize: "6rem" }}>
      {choice ? <p className="gov-text-secondary">You chose: {choice}. (In a real service this is revisitable from the footer.)</p> : null}
      {!choice && (
        <div style={{ position: "static" }}>
          <CookieBanner onAccept={() => setChoice("Accept")} onReject={() => setChoice("Reject")}>
            We use analytics cookies to improve this service. You can decline.
          </CookieBanner>
        </div>
      )}
    </div>
  );
}

// `h` for the wrappers above (this file is .tsx but the wrappers use it once).

/**
 * A live, mode-previewable example per component, keyed by spec id. The docs site pairs each
 * component's guideline spec with the REAL component rendered from @govnepal/ui — so the page a
 * developer reads and the code they install can never drift apart.
 *
 * Only the ten components built so far have an example; the rest render their spec alone until
 * their component exists. `hasExample(id)` lets the page decide.
 */

const EXAMPLES: Record<string, ReactNode> = {
  button: (
    <div className="gov-cluster">
      <Button variant="primary" type="button">Submit application</Button>
      <Button variant="secondary" type="button">Save draft</Button>
      <Button variant="destructive" type="button">Delete application</Button>
      <Button variant="primary" loading loadingLabel="Submitting…" type="button">Submit</Button>
    </div>
  ),

  link: (
    <p>
      Please <Link href="#track">track your application</Link>, download the{" "}
      <Link variant="download" href="#form">application form</Link>, or{" "}
      <Link variant="external" href="https://nepal.gov.np">visit the national portal</Link>.
    </p>
  ),

  badge: (
    <div className="gov-cluster">
      <Badge status="draft" />
      <Badge status="submitted" />
      <Badge status="under-review" />
      <Badge status="correction-required" />
      <Badge status="approved" />
      <Badge status="rejected" />
      <Badge status="printed" />
      <Badge status="delivered" />
    </div>
  ),

  alert: (
    <Stack gap={4}>
      <Alert variant="info" title="Applications are open">You can apply online. Processing takes up to 15 working days.</Alert>
      <Alert variant="success" title="Application submitted">Your reference number is NPGDDG-2082-00113. Keep it to track your application.</Alert>
      <Alert variant="warning" title="Correction required">Your citizenship number does not match our records. Please check and resubmit.</Alert>
      <Alert variant="error" title="Submission failed" live>The service is temporarily unavailable. Your draft has been saved.</Alert>
    </Stack>
  ),

  "text-input": (
    <Stack gap={6}>
      <TextInput id="ex-citizenship" label="Citizenship number" hint="Enter the number exactly as shown on your certificate, e.g. 12-01-76-12345" widthChars={20} />
      <TextInput id="ex-ward" label="Ward number" widthChars={2} inputMode="numeric" />
      <TextInput id="ex-amount" label="Fee" prefix="रु" widthChars={10} inputMode="numeric" />
      <TextInput id="ex-error" label="Mobile number" error="Enter your mobile number" widthChars={10} />
    </Stack>
  ),

  "error-summary": (
    <Stack gap={6}>
      <ErrorSummary
        focusOnAppear={false}
        errors={[
          { fieldId: "es-citizenship", message: "Enter your citizenship number" },
          { fieldId: "es-mobile", message: "Enter your mobile number" },
        ]}
      />
      <TextInput id="es-citizenship" label="Citizenship number" error="Enter your citizenship number" widthChars={20} />
      <TextInput id="es-mobile" label="Mobile number" error="Enter your mobile number" widthChars={10} />
    </Stack>
  ),

  header: (
    <Header officeNe="गृह मन्त्रालय" officeEn="Ministry of Home Affairs" serviceName="Citizenship certificate" />
  ),

  container: (
    <Container>
      <div style={{ background: "var(--gov-color-background-secondary)", padding: "var(--gov-space-4)", borderRadius: "var(--gov-radius-sm)" }}>
        Content constrained to the grid — max width, responsive side margins, centred.
      </div>
    </Container>
  ),

  stack: (
    <Stack gap={4}>
      <div style={{ background: "var(--gov-color-background-secondary)", padding: "var(--gov-space-3)" }}>One</div>
      <div style={{ background: "var(--gov-color-background-secondary)", padding: "var(--gov-space-3)" }}>Two</div>
      <div style={{ background: "var(--gov-color-background-secondary)", padding: "var(--gov-space-3)" }}>Three — spaced by one token step, never a hardcoded margin.</div>
    </Stack>
  ),

  "page-section": (
    <div>
      <PageSection aria-label="Default band"><Container>Default background band.</Container></PageSection>
      <PageSection variant="secondary-background" aria-label="Secondary band"><Container>Secondary background — page rhythm without decoration.</Container></PageSection>
    </div>
  ),

  checkbox: (
    <Stack gap={4}>
      <Checkbox label="I confirm the information I have given is correct" />
      <Checkbox label="Send me updates about this application" hint="Optional — you can change this later." />
    </Stack>
  ),

  radio: (
    <RadioGroup
      legend="Gender (as on your citizenship certificate)"
      name="ex-gender"
      options={[
        { value: "female", label: "महिला / Female" },
        { value: "male", label: "पुरुष / Male" },
        { value: "other", label: "अन्य / Other" },
      ]}
    />
  ),

  select: (
    <Select
      label="Province"
      placeholder="Select your province"
      hint="Then choose your district."
      options={[
        { value: "1", label: "Koshi" },
        { value: "2", label: "Madhesh" },
        { value: "3", label: "Bagmati" },
        { value: "4", label: "Gandaki" },
        { value: "5", label: "Lumbini" },
        { value: "6", label: "Karnali" },
        { value: "7", label: "Sudurpashchim" },
      ]}
    />
  ),

  details: (
    <Details summary="Why we ask for your ward number">
      Your ward number lets us route your application to the office that serves your area, so it is
      reviewed by the right officer.
    </Details>
  ),

  "warning-text": <WarningText>You cannot change your citizenship number after you submit.</WarningText>,

  "phase-banner": (
    <PhaseBanner phase="Pilot">
      This is a new service — <Link href="#feedback">give feedback</Link> to help us improve it.
    </PhaseBanner>
  ),

  stepper: (
    <Stepper
      current={2}
      steps={[
        { label: "Personal details", href: "#1" },
        { label: "Documents", href: "#2" },
        { label: "Review" },
        { label: "Payment" },
      ]}
    />
  ),

  "language-switcher": <LanguageSwitcher />,

  "skip-link": (
    <p className="gov-text-secondary">
      A skip link is visually hidden until focused — press Tab on a page and it appears first,
      before the header. <SkipLink />
    </p>
  ),

  "back-link": <BackLink href="#previous">Back</BackLink>,

  breadcrumb: (
    <Breadcrumb
      items={[
        { label: "Home", href: "#" },
        { label: "Services", href: "#" },
        { label: "Citizenship", href: "#" },
        { label: "Apply" },
      ]}
    />
  ),

  card: (
    <div className="site-grid">
      <Card>
        <h3 style={{ margin: 0 }}>Citizenship certificate</h3>
        <p className="gov-text-secondary">Apply for a new certificate or a copy.</p>
        <Link href="#">Start now</Link>
      </Card>
      <Card interactive href="#">
        <h3 style={{ margin: 0 }}>Track an application</h3>
        <p className="gov-text-secondary">The whole card is one link.</p>
      </Card>
    </div>
  ),

  "icon-button": (
    <div className="gov-cluster">
      <IconButton label="Close" icon={<span aria-hidden="true">✕</span>} />
      <IconButton label="Edit" icon={<span aria-hidden="true">✎</span>} />
      <IconButton label="Clear search" variant="ghost" icon={<span aria-hidden="true">⌫</span>} />
    </div>
  ),

  toggle: <ToggleExample />,

  textarea: (
    <Textarea
      id="ex-remarks"
      label="Describe the problem"
      hint="Tell us what went wrong so we can help."
    />
  ),

  tag: (
    <div className="gov-cluster">
      <Tag>Citizenship</Tag>
      <Tag>PDF</Tag>
      <Tag>Bagmati</Tag>
    </div>
  ),

  footer: (
    <Footer
      officeNe="गृह मन्त्रालय"
      officeEn="Ministry of Home Affairs"
      phone="+977 1 4211200"
      address="Singha Durbar, Kathmandu"
      copyright="© Government of Nepal"
      links={[
        { label: "Accessibility statement", href: "#" },
        { label: "Report a problem", href: "#" },
        { label: "Privacy", href: "#" },
      ]}
    />
  ),

  tabs: (
    <Tabs
      tabs={[
        { id: "details", label: "Details", content: <p>The applicant's personal details.</p> },
        { id: "documents", label: "Documents", content: <p>Uploaded documents.</p> },
        { id: "history", label: "History", content: <p>The application's status history.</p> },
      ]}
    />
  ),

  pagination: <Pagination page={2} totalPages={15} hrefFor={(p) => `#page-${p}`} />,

  toast: <ToastExample />,

  modal: <ModalExample />,

  "confirmation-dialog": <ConfirmExample />,

  "summary-list": (
    <SummaryList
      rows={[
        { key: "Full name", value: "Sita Sharma", action: <Link href="#">Change name</Link> },
        { key: "Citizenship number", value: "12-01-76-12345", action: <Link href="#">Change citizenship number</Link> },
        { key: "Province", value: "Bagmati", action: <Link href="#">Change province</Link> },
      ]}
    />
  ),

  "character-count": <CharacterCountExample />,

  table: (
    <Table
      caption="Recent applications"
      columns={[
        { key: "ref", header: "Reference", render: (r: { ref: string; name: string; status: string }) => r.ref },
        { key: "name", header: "Applicant", render: (r: { ref: string; name: string; status: string }) => r.name },
        { key: "status", header: "Status", render: (r: { ref: string; name: string; status: string }) => r.status },
      ]}
      rows={[
        { ref: "NPGDDG-2082-00113", name: "Sita Sharma", status: "Under review" },
        { ref: "NPGDDG-2082-00114", name: "Ram Thapa", status: "Approved" },
      ]}
      getRowKey={(r: { ref: string }) => r.ref}
    />
  ),

  "empty-state": (
    <EmptyState title="You have not started any applications yet" action={<Link href="#">Apply for a service</Link>}>
      When you start an application, it will appear here so you can track it.
    </EmptyState>
  ),

  "loading-state": <LoadingState label="Loading applications" />,

  accordion: (
    <Accordion
      sections={[
        { id: "need", title: "What you will need", content: "Your citizenship certificate and a recent photo." },
        { id: "time", title: "How long it takes", content: "Up to 15 working days." },
        { id: "cost", title: "How much it costs", content: "रु 500, paid at the review step." },
      ]}
    />
  ),

  "progress-bar": <ProgressBar value={65} label="Uploading citizenship certificate" />,

  "password-input": <PasswordInput id="ex-pw" label="Password" hint="At least 8 characters." autoComplete="new-password" />,

  "otp-input": <OtpExample />,

  "amount-input": <AmountExample />,

  "address-block": <AddressExample />,

  "masked-value": <MaskedExample />,

  "file-upload": <FileUpload id="ex-file" label="Citizenship certificate" accept={["jpg", "png", "pdf"]} maxMb={5} />,

  "search-box": <SearchBox label="Search services" onSubmit={() => {}} />,

  "cookie-banner": <CookieBannerExample />,

  "offline-banner": <OfflineBanner>You are offline. You can still view this page; your draft is saved. We will reconnect automatically.</OfflineBanner>,

  "session-timeout-warning": <SessionTimeoutExample />,
};

export function Example({ id }: { id: string }) {
  const example = EXAMPLES[id];
  if (!example) return null;
  return <ModePanel>{example}</ModePanel>;
}
