import { Carousel } from "@mantine/carousel";
import {
  Box,
  Modal,
  Button,
  Container,
  Image,
  Paper,
  Text,
  Title,
  Flex,
  Card,
  Badge,
  Stack,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  json,
  LoaderFunctionArgs,
  MetaFunction,
  redirect,
} from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import Autoplay from "embla-carousel-autoplay";
import moment from "moment/moment";
import { useRef, useState } from "react";

import classes from "~/components/Carousel/carousel.module.css";
import { prisma } from "~/db.server";
import { requireUserId } from "~/session.server";

interface Event {
  id: string;
  name: string;
  description: string;
  status: string;
  image?: string;
  eventStart: string;
  eventEnd: string;
  location: string;
  vendor: {
    name: string;
  };
  category: {
    name: string;
  };
}

export const meta: MetaFunction = () => [{ title: "Remix Notes" }];

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const userId = await requireUserId(request);

  if (!userId) return redirect("/");

  const events = await prisma.event.findMany({
    include: {
      vendor: true,
      category: true,
    },
  });

  const featuredEvents = await prisma.event.findMany({
    where: {
      featured: true,
    },
  });

  return json({ events, featuredEvents });
};

export default function ViewAllEvents() {
  const { events, featuredEvents } = useLoaderData<typeof loader>();
  const [opened, { open, close }] = useDisclosure(false);
  const autoplay = useRef(Autoplay({ delay: 2000 }));
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  const slides = featuredEvents.map((event) => (
    <Carousel.Slide key={event.id}>
      <Image src={event.image} radius={"md"} />
    </Carousel.Slide>
  ));

  const handleSelectEvent = (event: Event) => {
    setSelectedEvent(event);
    open();
  };

  const renderEventCards = (events: Event[], status: string) => {
    return events
      .filter((event) => event.status === status)
      .map((event) => (
        <Carousel.Slide key={event.id}>
          <Card shadow="sm" padding="lg" radius="md" withBorder h={380}>
            <Card.Section h={170}>
              <Image src={event.image} alt={event.name} fit="cover" h={170} />
            </Card.Section>

            <Stack mt="md" mb="xs" gap="xs" style={{ height: "150px" }}>
              <Text fw={500} lineClamp={1}>
                {event.name}
              </Text>
              <Badge
                color={
                  event.status === "ongoing"
                    ? "blue"
                    : event.status === "upcoming"
                      ? "green"
                      : "grey"
                }
              >
                {event.status === "ongoing"
                  ? "Ongoing"
                  : event.status === "upcoming"
                    ? "Upcoming"
                    : "Finished Event"}
              </Badge>
              <Text size="sm" c="dimmed" ta={"left"} lineClamp={3}>
                {event.description}
              </Text>
            </Stack>

            <Button fullWidth mt="md" onClick={() => handleSelectEvent(event)}>
              See More
            </Button>
          </Card>
        </Carousel.Slide>
      ));
  };

  return (
    <Paper>
      <Container
        style={{
          position: "relative",
          paddingBottom: "4rem",
          paddingTop: "2rem",
        }}
      >
        <Box pos={"relative"} pb={"xl"} style={{ margin: "0", padding: "0" }}>
          <Carousel
            slideSize="100%"
            slideGap="md"
            loop
            height="100%"
            style={{ flex: 1 }}
            withIndicators
            withControls={false}
            plugins={[autoplay.current]}
            onMouseEnter={autoplay.current.stop}
            onMouseLeave={autoplay.current.reset}
          >
            {slides}
          </Carousel>
        </Box>

        {/* Upcoming Events */}
        <Flex
          mih={50}
          gap="md"
          justify="center"
          align="center"
          direction="row"
          wrap="wrap"
        >
          <Title order={2}>Upcoming Events</Title>
        </Flex>
        <Container>
          <Box pos={"relative"} pb={"xl"} style={{ margin: "0", padding: "0" }}>
            <Carousel
              slideSize={310}
              dragFree
              slideGap="md"
              loop
              height="100%"
              controlsOffset={0}
              style={{ flex: 1 }}
              classNames={{
                root: classes.carousel,
                controls: classes.carouselControls,
                indicator: classes.carouselIndicator,
              }}
            >
              {renderEventCards(events, "upcoming")}
            </Carousel>
          </Box>
        </Container>

        {/* Ongoing Events */}
        <Flex
          mih={50}
          gap="md"
          justify="center"
          align="center"
          direction="row"
          wrap="wrap"
        >
          <Title order={2}>Ongoing Events</Title>
        </Flex>
        <Container>
          <Box pos={"relative"} pb={"xl"} style={{ margin: "0", padding: "0" }}>
            <Carousel
              slideSize={310}
              slideGap="md"
              loop
              dragFree
              height="100%"
              controlsOffset={-2}
              style={{ flex: 1 }}
              classNames={{
                root: classes.carousel,
                controls: classes.carouselControls,
                indicator: classes.carouselIndicator,
              }}
            >
              {renderEventCards(events, "ongoing")}
            </Carousel>
          </Box>
        </Container>

        {/* Previous Events */}
        <Flex
          mih={50}
          gap="md"
          justify="center"
          align="center"
          direction="row"
          wrap="wrap"
        >
          <Title order={2}>Finished Events</Title>
        </Flex>
        <Container>
          <Box pos={"relative"} pb={"xl"} style={{ margin: "0", padding: "0" }}>
            <Carousel
              slideSize={310}
              slideGap="md"
              loop
              dragFree
              height="100%"
              controlsOffset={-2}
              style={{ flex: 1 }}
              classNames={{
                root: classes.carousel,
                controls: classes.carouselControls,
                indicator: classes.carouselIndicator,
              }}
            >
              {renderEventCards(events, "finished")}
            </Carousel>
          </Box>

          <Modal opened={opened} onClose={close} title="Event Details">
            {selectedEvent ? (
              <div>
                <Text fw={500}>{selectedEvent.name}</Text>
                <Text size="sm">Category: {selectedEvent.category.name}</Text>
                <Text size="sm">Vendor: {selectedEvent.vendor.name}</Text>
                <Text size="sm">
                  Date & Time:
                  {moment(selectedEvent.eventStart).format(
                    "MMMM D, YYYY HH:mm",
                  )}{" "}
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
      </Container>
    </Paper>
  );
}
