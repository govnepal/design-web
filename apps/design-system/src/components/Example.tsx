"use client";

import type { ReactNode } from "react";
import { Container, Stack, PageSection, Button, Link, TextInput, ErrorSummary, Alert, Badge, Header } from "@nepal-gov/ui";
import { ModePanel } from "./ModePanel";

/**
 * A live, mode-previewable example per component, keyed by spec id. The docs site pairs each
 * component's guideline spec with the REAL component rendered from @nepal-gov/ui — so the page a
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
};

export function Example({ id }: { id: string }) {
  const example = EXAMPLES[id];
  if (!example) return null;
  return <ModePanel>{example}</ModePanel>;
}
