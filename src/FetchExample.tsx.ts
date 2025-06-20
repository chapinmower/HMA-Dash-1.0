import { ActionPanel, List, showToast, ToastStyle } from "@raycast/api";
import { useFetch } from "@raycast/utils";

export default function FetchExample() {
  const { data, isLoading, error } = useFetch("https://api.publicapis.org/entries");

  if (error) {
    showToast(ToastStyle.Failure, "Failed to fetch data", error.message);
  }

  return (
    <List isLoading={isLoading}>
      {data?.entries.map((entry: any) => (
        <List.Item
          key={entry.API}
          title={entry.API}
          subtitle={entry.Description}
          actions={
            <ActionPanel>
              <ActionPanel.Item title="Open in Browser" onAction={() => open(entry.Link)} />
            </ActionPanel>
          }
        />
      ))}
    </List>
  );
}
