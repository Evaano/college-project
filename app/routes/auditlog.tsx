import {
  Badge,
  Card,
  Container,
  Group,
  Pagination,
  Paper,
  Text,
  Title,
} from "@mantine/core";
import {
  LoaderFunctionArgs,
  MetaFunction,
  json,
  redirect,
} from "@remix-run/node";
import { useLoaderData, useSearchParams } from "@remix-run/react";
import { format } from "date-fns";

import { getAuditLogData, getTotalLogs } from "~/models/log.server";
import { getUser } from "~/session.server";
import { safeRedirect } from "~/utils";

export const meta: MetaFunction = () => [{ title: "Action Log" }];

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { searchParams } = new URL(request.url);
  const redirectTo = safeRedirect(searchParams.get("redirectTo"), "/");
  const user = await getUser(request);
  const pageParam = searchParams.get("page");
  const page = pageParam ? parseInt(pageParam, 10) : 1;
  const logsPerPage = 20;

  if (!user) {
    return redirect(redirectTo);
  }

  const logs = await getAuditLogData(page, logsPerPage);
  const totalLogs = await getTotalLogs();
  const totalPages = Math.ceil(totalLogs / logsPerPage);

  return json({ logs, totalLogs, totalPages });
};

export default function Auditlog() {
  const { logs, totalLogs, totalPages } = useLoaderData<typeof loader>();
  const [searchParams, setSearchParams] = useSearchParams();

  const handleSearchParamsChange = (
    searchParams: URLSearchParams,
    key: string,
    value: string,
  ) => {
    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.set(key, value);
    return newSearchParams;
  };

  const logsByDate = logs.reduce(
    (groups: Record<string, (typeof logs)[0][]>, log) => {
      const date = format(new Date(log.createdAt), "yyyy-MM-dd");
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(log);
      return groups;
    },
    {},
  );

  return (
    <Paper>
      <Container
        size={"lg"}
        style={{
          position: "relative",
          paddingBottom: "4rem",
          paddingTop: "2rem",
        }}
      >
        <Card className="shadow-sm p-6">
          <Title order={3} className="border-b border-gray-400">
            <Text span c="myColor" inherit>
              Action
            </Text>{" "}
            Log
          </Title>
          {Object.entries(logsByDate).map(([date, logs]) => (
            <div key={date} className="mt-3">
              <Text fw={700}>{date}</Text>
              {logs.map((log) => (
                <Card className="shadow-xs rounded-sm" key={log.id}>
                  <div className="flex justify-between">
                    <Text>{log.action}</Text>
                    <Badge>{new Date(log.createdAt).toLocaleString()}</Badge>
                  </div>
                  <Text className="text-sm text-gray-600">{log.person}</Text>
                </Card>
              ))}
            </div>
          ))}
        </Card>

        <div className="w-full flex justify-between items-center">
          <div className="flex justify-center flex-grow">
            <Pagination.Root
              total={totalPages}
              onChange={(newPage) => {
                const newSearchParams = handleSearchParamsChange(
                  searchParams,
                  "page",
                  String(newPage),
                );
                setSearchParams(newSearchParams);
              }}
            >
              <Group gap={7} mt="lg">
                <Pagination.First />
                <Pagination.Previous />
                <Pagination.Items />
                <Pagination.Next />
                <Pagination.Last />
              </Group>
            </Pagination.Root>
          </div>

          <Paper className="mt-7">
            <Text size="md" c="myColor">
              Total Logs: {totalLogs}
            </Text>
          </Paper>
        </div>
      </Container>
    </Paper>
  );
}
