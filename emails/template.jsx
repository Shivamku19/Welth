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
  Row,
  Column,
} from "@react-email/components";
import * as React from "react";

export default function EmailTemplate({
  userName = "",
  type = "monthly-report",
  data = {},
}) {
  if (type === "monthly-report") {
    return (
      <Html>
        <Head />
        <Preview>Your Monthly Financial Report</Preview>
        <Body style={styles.body}>
          <Container style={styles.container}>
            <Heading style={styles.title}>Monthly Financial Report</Heading>

            <Text style={styles.text}>Hello {userName},</Text>
            <Text style={styles.text}>
              Here&rsquo;s your financial summary for {data?.month}:
            </Text>

            <Section style={content}>

              <Section style={statContainer}>
                <Text style={statLabel}>Total Income</Text>
                <Text style={statValue}>${data?.income}</Text>
              </Section>
              
              <Section style={statContainer}>
                <Text style={statLabel}>Total Expenses</Text>
                <Text style={statValue}>${data?.expenses}</Text>
              </Section>
              
              <Section style={statContainer}>
                <Text style={statLabel}>Net</Text>
                <Text style={statValue}>${data?.income - data?.expenses}</Text>
              </Section>

              {data?.statData && data.statData.length > 0 && (
                <Section style={statContainer}>
                  <Heading as="h3" style={sectionHeading}>
                    Expenses by Category
                  </Heading>
                  {data.statData.map((stat, index) => (
                    <Row key={index} style={rowStyle}>
                      <Column align="left">
                        <Text style={nameStyle}>{stat.category}</Text>
                      </Column>
                      <Column align="right">
                        <Text style={moneyStyle}>${stat.amount}</Text>
                      </Column>
                    </Row>
                  ))}
                </Section>
              )}

              {data?.insights && data.insights.length > 0 && (
                <Section style={statContainer}>
                  <Heading as="h3" style={sectionHeading}>
                    Welth Insights
                  </Heading>
                  {data.insights.map((insight, index) => (
                    <Text key={index} style={text}>
                      • {insight}
                    </Text>
                  ))}
                </Section>
              )}
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

const headingReport = {
  fontSize: "28px",
  fontWeight: "bold",
  textAlign: "center",
  color: "#1e293b",
  margin: "30px 0",
};

const statContainer = {
  padding: "16px",
  backgroundColor: "#f9fafb",
  borderRadius: "8px",
  marginBottom: "16px",
};

const statLabel = {
  fontSize: "14px",
  color: "#6b7280",
  margin: "0 0 4px 0",
};

const statValue = {
  fontSize: "24px",
  fontWeight: "bold",
  color: "#111827",
  margin: "0",
};

const styles = {
  body: main,
  container: container,
  title: headingReport,
  text: text,
};

const sectionHeading = {
  fontSize: "18px",
  fontWeight: "bold",
  color: "#1e293b",
  marginBottom: "16px",
};

const rowStyle = {
  display: "table",
  width: "100%",
  padding: "12px 0",
  borderBottom: "1px solid #e2e8f0",
};

const nameStyle = {
  fontSize: "14px",
  color: "#6b7280",
  margin: "0",
};

const moneyStyle = {
  fontSize: "14px",
  fontWeight: "500",
  color: "#111827",
  margin: "0",
  textAlign: "right",
};