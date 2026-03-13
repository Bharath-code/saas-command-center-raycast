import {
  Action,
  ActionPanel,
  Clipboard,
  Color,
  Icon,
  List,
  Toast,
  showToast,
} from "@raycast/api";
import { useEffect, useState } from "react";

import { FailedPaymentsList } from "./components/FailedPaymentsList";
import { OnboardingDetail } from "./components/OnboardingDetail";
import { useProjects } from "./hooks/useProjects";
import { formatCurrency, formatPercentDelta } from "./lib/formatters";
import { getRevenueSnapshot } from "./lib/stripe-metrics-service";
import { RevenueSnapshot } from "./lib/types";

export default function RevenueSnapshotCommand() {
  const projects = useProjects();
  const [snapshot, setSnapshot] = useState<RevenueSnapshot | null>(null);
  const [isLoadingSnapshot, setIsLoadingSnapshot] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function loadSnapshot(showSuccessToast = false) {
    if (!projects.activeProject) {
      return;
    }

    setIsLoadingSnapshot(true);
    setError(null);

    try {
      const nextSnapshot = await getRevenueSnapshot(projects.activeProject);
      setSnapshot(nextSnapshot);

      if (showSuccessToast) {
        await showToast({ style: Toast.Style.Success, title: "Metrics updated" });
      }
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Couldn't load revenue metrics.");
    } finally {
      setIsLoadingSnapshot(false);
    }
  }

  useEffect(() => {
    if (!projects.activeProject) {
      return;
    }

    void loadSnapshot();
  }, [projects.activeProject?.id]);

  if (!projects.isLoading && !projects.activeProject) {
    return <OnboardingDetail onDidSaveProject={projects.saveProject} onUseDemo={projects.enableDemoProject} />;
  }

  function copySnapshot() {
    if (!snapshot || !projects.activeProject) {
      return;
    }

    const summary = [
      `${projects.activeProject.name} revenue snapshot`,
      `Today Revenue: ${formatCurrency(snapshot.todayRevenue, snapshot.currency)}`,
      `MRR: ${formatCurrency(snapshot.mrr, snapshot.currency)}`,
      `New Customers: ${snapshot.newCustomers}`,
      `Failed Payments: ${snapshot.failedPaymentsCount}`,
      `Revenue At Risk: ${formatCurrency(snapshot.revenueAtRisk, snapshot.currency)}`,
    ].join("\n");

    void Clipboard.copy(summary);
  }

  return (
    <List
      isLoading={projects.isLoading || isLoadingSnapshot}
      navigationTitle="SaaS Snapshot"
      searchBarPlaceholder="Revenue snapshot"
    >
      {error ? (
        <List.EmptyView
          title="Couldn't load Stripe data"
          description={error}
          actions={
            <ActionPanel>
              <Action title="Try Again" icon={Icon.ArrowClockwise} onAction={() => void loadSnapshot()} />
              <Action title="Use Demo Metrics" icon={Icon.AppWindow} onAction={() => void projects.enableDemoProject()} />
            </ActionPanel>
          }
        />
      ) : null}
      {snapshot ? (
        <>
          <List.Section title="Revenue Metrics" subtitle={`Stripe • ${projects.activeProject?.name ?? "Project"}`}>
            <List.Item
              icon={{ source: Icon.Coins, tintColor: Color.Green }}
              title="Today Revenue"
              subtitle={snapshot.todayRevenueDelta === null ? snapshot.todayRevenueContext : formatPercentDelta(snapshot.todayRevenueDelta)}
              accessories={[{ text: formatCurrency(snapshot.todayRevenue, snapshot.currency) }]}
              actions={
                <ActionPanel>
                  <Action title="Refresh Metrics" icon={Icon.ArrowClockwise} onAction={() => void loadSnapshot(true)} />
                  <Action title="Copy Snapshot" icon={Icon.Clipboard} onAction={copySnapshot} />
                  <Action.OpenInBrowser
                    title="Open Stripe Dashboard"
                    url={projects.activeProject?.dashboardUrl ?? "https://dashboard.stripe.com"}
                  />
                  {projects.activeProject ? (
                    <Action.Push title="View Failed Payments" target={<FailedPaymentsList project={projects.activeProject} />} />
                  ) : null}
                </ActionPanel>
              }
            />
            <List.Item
              icon={{ source: Icon.LineChart, tintColor: Color.Blue }}
              title="Monthly Recurring Revenue"
              subtitle={snapshot.mrrContext}
              accessories={[{ text: formatCurrency(snapshot.mrr, snapshot.currency) }]}
              actions={
                <ActionPanel>
                  <Action title="Refresh Metrics" icon={Icon.ArrowClockwise} onAction={() => void loadSnapshot(true)} />
                  <Action title="Copy Snapshot" icon={Icon.Clipboard} onAction={copySnapshot} />
                </ActionPanel>
              }
            />
            <List.Item
              icon={{ source: Icon.Person, tintColor: Color.SecondaryText }}
              title="New Customers"
              subtitle={snapshot.newCustomersContext}
              accessories={[{ text: String(snapshot.newCustomers) }]}
              actions={
                <ActionPanel>
                  <Action title="Refresh Metrics" icon={Icon.ArrowClockwise} onAction={() => void loadSnapshot(true)} />
                  <Action title="Copy Snapshot" icon={Icon.Clipboard} onAction={copySnapshot} />
                </ActionPanel>
              }
            />
          </List.Section>
          <List.Section title="Revenue Risk">
            <List.Item
              icon={{ source: Icon.ExclamationMark, tintColor: Color.Orange }}
              title="Failed Payments"
              subtitle={`${formatCurrency(snapshot.revenueAtRisk, snapshot.currency)} at risk`}
              accessories={[
                { text: String(snapshot.failedPaymentsCount) },
              ]}
              actions={
                <ActionPanel>
                  <Action title="Refresh Metrics" icon={Icon.ArrowClockwise} onAction={() => void loadSnapshot(true)} />
                  <Action title="Copy Snapshot" icon={Icon.Clipboard} onAction={copySnapshot} />
                  <Action.OpenInBrowser
                    title="Open Stripe Dashboard"
                    url={projects.activeProject?.dashboardUrl ?? "https://dashboard.stripe.com"}
                  />
                  {projects.activeProject ? (
                    <Action.Push title="View Failed Payments" target={<FailedPaymentsList project={projects.activeProject} />} />
                  ) : null}
                </ActionPanel>
              }
            />
          </List.Section>
        </>
      ) : null}
    </List>
  );
}
