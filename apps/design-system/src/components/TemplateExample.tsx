"use client";

import { useState, type ReactNode } from "react";
import {
  Header,
  Footer,
  Container,
  Stack,
  Button,
  Link,
  BackLink,
  Stepper,
  TextInput,
  ErrorSummary,
  SummaryList,
  Alert,
  Badge,
  Card,
  PhaseBanner,
  SearchBox,
  ApplicationStatusTracker,
  PasswordInput,
  QrCode,
} from "@govnepal/ui";
import { ModePanel } from "./ModePanel";

/**
 * Live whole-page templates (templates/*), composed from the real @govnepal/ui components. This is
 * the culmination the design system is for: a citizen service page built entirely from the library,
 * previewable in every display mode. Each template follows its spec's anatomy.
 *
 * Rendered inside a bordered "page frame" so a whole page reads as one artefact within the docs.
 */

function PageFrame({ children }: { children: ReactNode }) {
  return (
    <div style={{ background: "var(--gov-color-background-default)", border: "var(--gov-border-width-sm) solid var(--gov-color-border-default)", borderRadius: "var(--gov-radius-md)", overflow: "hidden" }}>
      {children}
    </div>
  );
}

const gov = { officeNe: "गृह मन्त्रालय", officeEn: "Ministry of Home Affairs" } as const;

function ServiceStart() {
  return (
    <PageFrame>
      <Header {...gov} serviceName="Citizenship certificate" />
      <PhaseBanner phase="Pilot">This is a new service — <Link href="#">give feedback</Link>.</PhaseBanner>
      <Container>
        <div style={{ paddingBlock: "var(--gov-space-8)" }}>
          <Stack gap={6}>
            <h1>Apply for a citizenship certificate</h1>
            <p className="site-hero__lead">Apply online for a new citizenship certificate. Most applications are decided within 15 working days.</p>
            <Card>
              <h2 style={{ marginBlockStart: 0 }}>Before you start</h2>
              <ul>
                <li>Your old citizenship certificate or a copy</li>
                <li>A recent photo</li>
                <li>The fee: रु 500, paid at the review step</li>
              </ul>
              <p className="gov-text-secondary">This takes about 10 minutes to complete.</p>
            </Card>
            <div className="gov-cluster">
              <Button variant="primary">Start now</Button>
              <Link href="#">Get help with this service</Link>
            </div>
          </Stack>
        </div>
      </Container>
      <Footer {...{ officeNe: gov.officeNe, officeEn: gov.officeEn }} phone="+977 1 4211200" address="Singha Durbar, Kathmandu" links={[{ label: "Accessibility statement", href: "#" }, { label: "Report a problem", href: "#" }]} />
    </PageFrame>
  );
}

function QuestionPage() {
  const [submitted, setSubmitted] = useState(false);
  const [citizenship, setCitizenship] = useState("");
  const showError = submitted && !citizenship.trim();
  return (
    <PageFrame>
      <Header {...gov} serviceName="Citizenship certificate" />
      <Container variant="narrow">
        <div style={{ paddingBlock: "var(--gov-space-8)" }}>
          <Stack gap={6}>
            <Stepper current={0} steps={[{ label: "Personal details" }, { label: "Documents" }, { label: "Review" }, { label: "Payment" }]} />
            <BackLink href="#" />
            {showError && <ErrorSummary errors={[{ fieldId: "q-citizenship", message: "Enter your citizenship number" }]} />}
            <h1>What is your citizenship number?</h1>
            <TextInput
              id="q-citizenship"
              label="Citizenship number"
              hint="Enter the number exactly as shown on your certificate, e.g. 12-01-76-12345"
              widthChars={20}
              value={citizenship}
              onChange={(e) => setCitizenship(e.target.value)}
              error={showError ? "Enter your citizenship number" : undefined}
            />
            <div className="gov-cluster">
              <Button variant="primary" onClick={() => setSubmitted(true)}>Continue</Button>
              <Button variant="secondary">Save draft</Button>
            </div>
          </Stack>
        </div>
      </Container>
    </PageFrame>
  );
}

function CheckAnswers() {
  return (
    <PageFrame>
      <Header {...gov} serviceName="Citizenship certificate" />
      <Container variant="narrow">
        <div style={{ paddingBlock: "var(--gov-space-8)" }}>
          <Stack gap={6}>
            <Stepper current={2} steps={[{ label: "Personal details", href: "#" }, { label: "Documents", href: "#" }, { label: "Review" }, { label: "Payment" }]} />
            <h1>Check your answers</h1>
            <SummaryList rows={[
              { key: "Full name", value: "Sita Sharma", action: <Link href="#">Change name</Link> },
              { key: "Citizenship number", value: "••••2345", action: <Link href="#">Change citizenship number</Link> },
              { key: "Province", value: "Bagmati", action: <Link href="#">Change province</Link> },
              { key: "Ward", value: "10", action: <Link href="#">Change ward</Link> },
            ]} />
            <Alert variant="info" title="Before you submit">There is a रु 500 fee, paid next. Your application will be decided within 15 working days.</Alert>
            <Button variant="primary">Accept and continue to payment</Button>
          </Stack>
        </div>
      </Container>
    </PageFrame>
  );
}

function ConfirmationPage() {
  return (
    <PageFrame>
      <Header {...gov} serviceName="Citizenship certificate" />
      <Container variant="narrow">
        <div style={{ paddingBlock: "var(--gov-space-8)" }}>
          <Stack gap={6}>
            <Alert variant="success" title="Application submitted">
              Your reference number is <strong className="gov-reference">NPGDDG-2082-00113</strong>. Keep it to track your application.
            </Alert>
            <div>
              <h2>What happens next</h2>
              <ol>
                <li>An officer reviews your application (up to 15 working days).</li>
                <li>You receive an SMS when the decision is made.</li>
                <li>Collect your certificate from your ward office.</li>
              </ol>
            </div>
            <QrCode src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Crect width='120' height='120' fill='white'/%3E%3Crect x='10' y='10' width='30' height='30'/%3E%3Crect x='80' y='10' width='30' height='30'/%3E%3Crect x='10' y='80' width='30' height='30'/%3E%3Crect x='55' y='55' width='12' height='12'/%3E%3C/svg%3E" reference="NPGDDG-2082-00113" alt="Scan to verify this application" />
            <div className="gov-cluster">
              <Button variant="secondary">Print confirmation</Button>
              <Link href="#">Track your application</Link>
            </div>
          </Stack>
        </div>
      </Container>
    </PageFrame>
  );
}

function ErrorPage({ heading, body }: { heading: string; body: string }) {
  return (
    <PageFrame>
      <Header {...gov} serviceName="Citizenship certificate" />
      <Container variant="narrow">
        <div style={{ paddingBlock: "var(--gov-space-8)" }}>
          <Stack gap={4}>
            <h1>{heading}</h1>
            <p>{body}</p>
            <div className="gov-cluster">
              <Link href="#">Go to the service home</Link>
            </div>
          </Stack>
        </div>
      </Container>
      <Footer {...{ officeNe: gov.officeNe, officeEn: gov.officeEn }} phone="+977 1 4211200" address="Singha Durbar, Kathmandu" links={[{ label: "Report a problem", href: "#" }]} />
    </PageFrame>
  );
}

function SignIn() {
  return (
    <PageFrame>
      <Header {...gov} serviceName="Citizen portal" />
      <Container variant="narrow">
        <div style={{ paddingBlock: "var(--gov-space-8)" }}>
          <Stack gap={6}>
            <h1>Sign in</h1>
            <TextInput id="si-id" label="National ID or mobile number" widthChars={20} autoComplete="username" />
            <PasswordInput id="si-pw" label="Password" autoComplete="current-password" />
            <Button variant="primary" type="submit">Sign in</Button>
            <p>We will never ask for your password or OTP by phone or SMS.</p>
            <p><Link href="#">Create an account</Link> · <Link href="#">Forgotten your password?</Link></p>
          </Stack>
        </div>
      </Container>
    </PageFrame>
  );
}

function SearchResults() {
  return (
    <PageFrame>
      <Header {...gov} serviceName="Find a service" />
      <Container>
        <div style={{ paddingBlock: "var(--gov-space-8)" }}>
          <Stack gap={6}>
            <SearchBox label="Search services" defaultValue="citizenship" onSubmit={() => {}} />
            <p className="gov-text-secondary">2 results for “citizenship”</p>
            <Stack gap={4}>
              <Card interactive href="#"><h3 style={{ margin: 0 }}>Apply for a citizenship certificate</h3><p className="gov-text-secondary">Ministry of Home Affairs</p></Card>
              <Card interactive href="#"><h3 style={{ margin: 0 }}>Replace a lost citizenship certificate</h3><p className="gov-text-secondary">Ministry of Home Affairs</p></Card>
            </Stack>
          </Stack>
        </div>
      </Container>
    </PageFrame>
  );
}

function Dashboard() {
  return (
    <PageFrame>
      <Header {...gov} serviceName="Your applications" />
      <Container>
        <div style={{ paddingBlock: "var(--gov-space-8)" }}>
          <Stack gap={6}>
            <h1>Your applications</h1>
            <div className="site-grid">
              <Card>
                <div className="gov-cluster" style={{ justifyContent: "space-between" }}>
                  <h3 style={{ margin: 0 }}>Citizenship certificate</h3>
                  <Badge status="under-review" />
                </div>
                <p className="gov-reference">NPGDDG-2082-00113</p>
                <Link href="#">Track application</Link>
              </Card>
              <Card>
                <div className="gov-cluster" style={{ justifyContent: "space-between" }}>
                  <h3 style={{ margin: 0 }}>Passport renewal</h3>
                  <Badge status="correction-required" />
                </div>
                <p className="gov-reference">NPGDDG-2082-00098</p>
                <Link href="#">Update your application</Link>
              </Card>
            </div>
            <ApplicationStatusTracker sequence={["submitted", "under-review", "approved", "delivered"]} current="under-review" />
          </Stack>
        </div>
      </Container>
    </PageFrame>
  );
}

const TEMPLATES: Record<string, ReactNode> = {
  "service-start": <ServiceStart />,
  "question-page": <QuestionPage />,
  "check-answers": <CheckAnswers />,
  "confirmation-page": <ConfirmationPage />,
  "sign-in": <SignIn />,
  "search-results": <SearchResults />,
  dashboard: <Dashboard />,
  "error-not-found": <ErrorPage heading="We could not find that page" body="The page may have been moved, removed, or the link may be out of date. Go to the service home to continue." />,
  "error-server": <ErrorPage heading="Sorry, there is a problem with the service" body="Try again in a few minutes. Your saved draft has not been lost. If it keeps happening, contact the office below." />,
  "error-offline": <ErrorPage heading="You are offline" body="You can still view pages you have already opened, and your draft is saved. We will reconnect automatically." />,
  "error-maintenance": <ErrorPage heading="The service is closed for maintenance" body="This service is unavailable until 6:00 AM NPT. You can still contact the office below." />,
};

export function TemplateExample({ id }: { id: string }) {
  const template = TEMPLATES[id];
  if (!template) return null;
  return <ModePanel>{template}</ModePanel>;
}
