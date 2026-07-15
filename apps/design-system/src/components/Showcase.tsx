import { Header, Container, Stack, Button, Link, TextInput, Alert, Badge, ErrorSummary } from "@nepal-gov/ui";

/**
 * A single realistic mini-service that exercises all ten components at once: the government header,
 * a status alert, the status badges, a form field with an error, the error summary that links to
 * it, and the button row. Placed inside the ModePanel, it lets a reviewer watch the WHOLE system
 * respond to a mode or language change in one glance — which is the accessibility-review use the
 * panel is for.
 *
 * It intentionally shows an error state, because the error path is where most of the accessibility
 * contract lives (§7.1) and the least-tested visually.
 */
export function Showcase() {
  return (
    <Stack gap={6}>
      <Header
        officeNe="गृह मन्त्रालय"
        officeEn="Ministry of Home Affairs"
        serviceName="Citizenship certificate"
      />

      <Container>
        <Stack gap={6}>
          <Alert variant="info" title="Applications are open">
            You can apply for a new citizenship certificate online. Processing takes up to 15 working days.
          </Alert>

          <div className="gov-cluster">
            <Badge status="submitted" />
            <Badge status="under-review" />
            <Badge status="correction-required" />
            <Badge status="approved" />
            <Badge status="rejected" />
          </div>

          <ErrorSummary errors={[{ fieldId: "citizenship", message: "Enter your citizenship number" }]} />

          <TextInput
            id="citizenship"
            label="Citizenship number"
            hint="Enter the number exactly as shown on your certificate, e.g. 12-01-76-12345"
            error="Enter your citizenship number"
            widthChars={20}
            defaultValue=""
          />

          <TextInput id="ward" label="Ward number" widthChars={2} inputMode="numeric" />

          <div className="gov-cluster">
            <Button variant="primary" type="button">
              Submit application
            </Button>
            <Button variant="secondary" type="button">
              Save draft
            </Button>
            <Button variant="destructive" type="button">
              Delete application
            </Button>
          </div>

          <p>
            Need help? <Link href="#help">Track your application</Link> or{" "}
            <Link variant="external" href="https://nepal.gov.np">
              visit the national portal
            </Link>
            .
          </p>
        </Stack>
      </Container>
    </Stack>
  );
}
