import { Carousel } from "@mantine/carousel";
import {
  Box,
  Modal,
  Button,
  Container,
  Group,
  Image,
  Paper,
  Text,
  Title,
  Flex,
  Card,
  Badge,
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
}

const featuredEvents = [
  {
    image:
      "https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-1.png",
    id: 1,
    name: "Event 1",
    status: "ongoing",
    description: "some random bs",
  },
  {
    image:
      "https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-2.png",
    id: 2,
    name: "Event 1",
    status: "ongoing",
    description: "some random bs",
  },
  {
    image:
      "https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-3.png",
    id: 3,
    name: "Event 1",
    status: "ongoing",
    description: "some random bs",
  },
  {
    image:
      "https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-4.png",
    id: 4,
    name: "Event 1",
    status: "ongoing",
    description: "some random bs",
  },
  {
    image:
      "https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-4.png",
    id: 5,
    name: "Event 1",
    status: "ongoing",
    description: "some random bs",
  },
  {
    image:
      "https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-4.png",
    id: 6,
    name: "Event 1",
    status: "ongoing",
    description: "some random bs",
  },
];

export const meta: MetaFunction = () => [{ title: "Remix Notes" }];

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const userId = await requireUserId(request);

  if (!userId) return redirect("/");

  const events = await prisma.event.findMany({
    include: {
      vendor: true,
    },
  });

  return json({ events });
};

export default function ViewAllEvents() {
  const { events } = useLoaderData<typeof loader>();
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
          <Card shadow="sm" padding="lg" withBorder mx={10}>
            <Card.Section>
              <Image
                src={
                  event.image ||
                  "https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-1.png"
                }
                height={160}
                alt={event.name}
              />
            </Card.Section>

            <Group justify="space-between" mt="md" mb="xs">
              <Text fw={500}>{event.name}</Text>
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
            </Group>

            <Text size="sm" c="dimmed" ta={"left"}>
              {event.description}
            </Text>

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

        <Flex
          mih={50}
          gap="md"
          justify="center"
          align="center"
          direction="row"
          wrap="wrap"
        >
          <Button>View All</Button>
        </Flex>
      </Container>
    </Paper>
  );
}
