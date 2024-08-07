import { Box, Container, Text, Title, Paper, Modal } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  json,
  LoaderFunctionArgs,
  MetaFunction,
  redirect,
} from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import moment from "moment";
import { useState } from "react";
import { Calendar, momentLocalizer, Event } from "react-big-calendar";

import "react-big-calendar/lib/css/react-big-calendar.css";
import { prisma } from "~/db.server";
import { requireUserId } from "~/session.server";
import { getUserVendors } from "~/models/user.server";

const localizer = momentLocalizer(moment);

export const meta: MetaFunction = () => [{ title: "Event Calendar" }];

interface CustomEvent extends Event {
  id: string;
  image: string;
  name: string;
  location: string;
  description: string;
  status: string;
  eventStart: string;
  eventEnd: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const userId = await requireUserId(request);

  if (!userId) return redirect("/");

  const userVendor = await getUserVendors(userId);

  const events = await prisma.event.findMany({
    where: {
      vendorId: userVendor?.vendorId,
    },
  });

  return json({ events });
};

export default function EventCalendar() {
  const { events } = useLoaderData<typeof loader>();
  const [selectedEvent, setSelectedEvent] = useState<CustomEvent | null>(null);
  const [opened, { open, close }] = useDisclosure(false);

  // Convert events to the format expected by react-big-calendar
  const calendarEvents = events.map((event) => ({
    ...event,
    title: event.name,
    start: new Date(event.eventStart),
    end: new Date(event.eventEnd),
  }));

  const handleSelectEvent = (event: CustomEvent) => {
    setSelectedEvent(event);
    open();
  };

  return (
    <Paper className="p-4">
      <Container
        size="lg"
        style={{
          position: "relative",
          paddingBottom: "4rem",
          paddingTop: "2rem",
        }}
      >
        <Title order={2} className="text-center mb-4">
          Event Calendar
        </Title>
        <Box className="h-[600px]">
          <Calendar<CustomEvent>
            localizer={localizer}
            events={calendarEvents}
            startAccessor="start"
            endAccessor="end"
            titleAccessor="name"
            onSelectEvent={handleSelectEvent}
            style={{ height: "100%" }}
            eventPropGetter={() => {
              const backgroundColor = "lightblue";
              const border = "black";
              const borderStyle = "solid";
              return { style: { backgroundColor, border, borderStyle } };
            }}
          />
        </Box>

        <Modal opened={opened} onClose={close} title="Event Details">
          {selectedEvent ? (
            <div>
              <Text fw={500}>{selectedEvent.name}</Text>
              <Text size="sm">
                {moment(selectedEvent.eventStart).format("MMMM D, YYYY HH:mm")}{" "}
                -{moment(selectedEvent.eventEnd).format("MMMM D, YYYY HH:mm")}
              </Text>
              <Text size="sm">Location: {selectedEvent.location}</Text>
              <Text size="sm" c="dimmed">
                {selectedEvent.description}
              </Text>
              <Text size="xs" c="blue">
                {selectedEvent.status}
              </Text>
            </div>
          ) : null}
        </Modal>
      </Container>
    </Paper>
  );
}
