import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

export default function EmailTemplate({
  userName = "",
  type = "budget-alert",
  data = {
    percentage: 80,
    budgetAmount: "0",
    totalExpenses: "0",
  },
}) {
  if (type === "monthly-report") {
    return (
      <Html>
        <Head />
        <Preview>Your Monthly Financial Report</Preview>
        <Body style={main}>
          <Container style={container}>
            <Heading style={heading}>Monthly Report</Heading>
            <Section style={content}>
              <Text style={greeting}>Hello {userName},</Text>
              <Text style={text}>
                Here is your financial summary for the month.
              </Text>
              <Section style={statsBox}>
                <Text style={statText}>
                  <strong>Total Income:</strong> ${data?.income}
                </Text>
                <Text style={statText}>
                  <strong>Total Expenses:</strong> ${data?.expenses}
                </Text>
              </Section>
              {data?.insights && data.insights.length > 0 && (
                <Section style={statsBox}>
                  <Text style={statText}>
                    <strong>Monthly Insights</strong>
                  </Text>
                  {data.insights.map((insight, index) => (
                    <Text key={index} style={text}>
                      • {insight}
                    </Text>
                  ))}
                </Section>
              )}
              <Text style={text}>
                Keep up the great work managing your finances!
              </Text>
              <Button style={button} href={`${process.env.NEXT_PUBLIC_APP_URL || "https://welth.app"}/dashboard`}>
                View Full Report
              </Button>
            </Section>
            <Hr style={hr} />
            <Text style={footer}>
              © {new Date().getFullYear()} Welth. All rights reserved.
            </Text>
          </Container>
        </Body>
      </Html>
    );
  }

  // Default: budget-alert
  return (
    <Html>
      <Head />
      <Preview>Budget Alert</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={heading}>Budget Alert</Heading>
          <Section style={content}>
            <Text style={greeting}>Hello {userName},</Text>
            <Text style={text}>
              You&apos;ve used <strong>{data?.percentage.toFixed(1)}%</strong> of your monthly budget.
            </Text>
            <Section style={statsBox}>
              <Text style={statText}>
                <strong>Budget Amount:</strong> ${data?.budgetAmount}
              </Text>
              <Text style={statText}>
                <strong>Spent So Far:</strong> ${data?.totalExpenses}
              </Text>
              <Text style={statText}>
                <strong>Remaining:</strong> ${Math.max(0, data?.budgetAmount - data?.totalExpenses).toFixed(2)}
              </Text>
            </Section>
            <Button style={button} href={`${process.env.NEXT_PUBLIC_APP_URL || "https://welth.app"}/dashboard`}>
              View Dashboard
            </Button>
          </Section>
          <Hr style={hr} />
          <Text style={footer}>
            © {new Date().getFullYear()} Welth. All rights reserved.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

// Styles
const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "20px 0 48px",
  marginBottom: "64px",
  borderRadius: "8px",
  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05)",
  maxWidth: "580px",
};

const heading = {
  fontSize: "28px",
  fontWeight: "bold",
  textAlign: "center",
  color: "#2563eb", // Tailwind Blue 600
  margin: "30px 0",
};

const content = {
  padding: "0 40px",
};

const greeting = {
  fontSize: "18px",
  color: "#333",
  lineHeight: "26px",
};

const text = {
  fontSize: "16px",
  color: "#555",
  lineHeight: "24px",
};

const statsBox = {
  backgroundColor: "#f8fafc",
  borderRadius: "6px",
  padding: "16px",
  margin: "24px 0",
};

const statText = {
  fontSize: "16px",
  color: "#333",
  margin: "8px 0",
};

const button = {
  backgroundColor: "#2563eb",
  borderRadius: "6px",
  color: "#fff",
  fontSize: "16px",
  fontWeight: "bold",
  textDecoration: "none",
  textAlign: "center",
  display: "block",
  padding: "12px 20px",
  marginTop: "24px",
};

const hr = {
  borderColor: "#e2e8f0",
  margin: "32px 0",
};

const footer = {
  color: "#8898aa",
  fontSize: "12px",
  textAlign: "center",
};