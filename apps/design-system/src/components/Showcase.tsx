"use client";

import { Header, Container, Stack, Button, Link, TextInput, Alert, Badge, ErrorSummary, useTheme } from "@govnepal/ui";

/**
 * A single realistic mini-service that exercises the components at once: the government header, a
 * status alert, the status badges, a form field with an error, the error summary that links to it,
 * and the button row. Placed inside the ModePanel, it lets a reviewer watch the WHOLE system
 * respond to a mode, language, or text-size change in one glance — the accessibility-review use the
 * panel is for.
 *
 * It reads `language` from the (nested) theme context so its own copy switches with the panel's
 * language toggle — otherwise the toggle would only change the badge labels and read as broken. It
 * also keeps a loading button, whose spinner stops under reduced-motion, so that toggle is visible
 * too. And it shows an error state, because the error path is where most of the accessibility
 * contract lives (§7.1).
 */

const t = {
  applicationsOpen: { ne: "आवेदन खुला छ", en: "Applications are open" },
  applicationsBody: {
    ne: "तपाईं नयाँ नागरिकता प्रमाणपत्रका लागि अनलाइन आवेदन दिन सक्नुहुन्छ। प्रक्रिया पूरा हुन १५ कार्य दिनसम्म लाग्न सक्छ।",
    en: "You can apply for a new citizenship certificate online. Processing takes up to 15 working days.",
  },
  citizenshipLabel: { ne: "नागरिकता नम्बर", en: "Citizenship number" },
  citizenshipHint: {
    ne: "प्रमाणपत्रमा देखिएअनुसार नम्बर हुबहु लेख्नुहोस्, जस्तै १२-०१-७६-१२३४५।",
    en: "Enter the number exactly as shown on your certificate, e.g. 12-01-76-12345",
  },
  citizenshipError: { ne: "तपाईंको नागरिकता नम्बर लेख्नुहोस्", en: "Enter your citizenship number" },
  wardLabel: { ne: "वडा नम्बर", en: "Ward number" },
  submit: { ne: "आवेदन पेश गर्नुहोस्", en: "Submit application" },
  submitting: { ne: "पेश हुँदै…", en: "Submitting…" },
  saveDraft: { ne: "मस्यौदा सुरक्षित गर्नुहोस्", en: "Save draft" },
  serviceName: { ne: "नागरिकता प्रमाणपत्र", en: "Citizenship certificate" },
  needHelp: { ne: "सहयोग चाहियो?", en: "Need help?" },
  trackApplication: { ne: "आफ्नो आवेदन ट्र्याक गर्नुहोस्", en: "Track your application" },
  nationalPortal: { ne: "राष्ट्रिय पोर्टल हेर्नुहोस्", en: "visit the national portal" },
} as const;

export function Showcase() {
  const { language } = useTheme();
  const s = (key: keyof typeof t) => t[key][language === "ne" ? "ne" : "en"];

  return (
    <Stack gap={6}>
      <Header officeNe="गृह मन्त्रालय" officeEn="Ministry of Home Affairs" serviceName={s("serviceName")} />

      <Container>
        <Stack gap={6}>
          <Alert variant="info" title={s("applicationsOpen")}>
            {s("applicationsBody")}
          </Alert>

          <div className="gov-cluster">
            <Badge status="submitted" />
            <Badge status="under-review" />
            <Badge status="correction-required" />
            <Badge status="approved" />
            <Badge status="rejected" />
          </div>

          <ErrorSummary
            focusOnAppear={false}
            errors={[{ fieldId: "sc-citizenship", message: s("citizenshipError") }]}
          />

          <TextInput
            id="sc-citizenship"
            label={s("citizenshipLabel")}
            hint={s("citizenshipHint")}
            error={s("citizenshipError")}
            widthChars={20}
            defaultValue=""
          />

          <TextInput id="sc-ward" label={s("wardLabel")} widthChars={2} inputMode="numeric" />

          <div className="gov-cluster">
            {/* The spinner runs continuously — and stops under reduced-motion, so that toggle shows. */}
            <Button variant="primary" loading loadingLabel={s("submitting")} type="button">
              {s("submit")}
            </Button>
            <Button variant="secondary" type="button">
              {s("saveDraft")}
            </Button>
          </div>

          <p>
            {s("needHelp")} <Link href="#help">{s("trackApplication")}</Link>{" "}
            <Link variant="external" href="https://nepal.gov.np">
              {s("nationalPortal")}
            </Link>
            .
          </p>
        </Stack>
      </Container>
    </Stack>
  );
}
