"use client";

import type { ReactNode } from "react";
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
} from "@govnepal/ui";
import { ModePanel } from "./ModePanel";

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
};

export function Example({ id }: { id: string }) {
  const example = EXAMPLES[id];
  if (!example) return null;
  return <ModePanel>{example}</ModePanel>;
}
