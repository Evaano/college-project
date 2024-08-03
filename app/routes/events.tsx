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
import type { MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";

import classes from "~/components/Carousel/carousel.module.css";

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

export default function Events() {
  const [opened, { open, close }] = useDisclosure(false);

  const slides = featuredEvents.map((event) => (
    <Carousel.Slide key={event.id}>
      <Image src={event.image} radius={"md"} />
    </Carousel.Slide>
  ));

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
              {featuredEvents.map((event) => (
                <Carousel.Slide key={event.id}>
                  <Card shadow="sm" padding="lg" radius="md" withBorder mx={10}>
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

                    <Button
                      // onClick={() => {
                      //   setSelectedEvent(event);
                      //   open();
                      // }}
                      fullWidth
                      mt="md"
                      radius="md"
                    >
                      See More
                    </Button>
                  </Card>
                </Carousel.Slide>
              ))}
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
              {featuredEvents.map((event) => (
                <Carousel.Slide key={event.id}>
                  <Card shadow="sm" padding="lg" radius="md" withBorder mx={10}>
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

                    <Button
                      // onClick={() => {
                      //   setSelectedEvent(event);
                      //   open();
                      // }}
                      fullWidth
                      mt="md"
                      radius="md"
                    >
                      See More
                    </Button>
                  </Card>
                </Carousel.Slide>
              ))}
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
              {featuredEvents.map((event) => (
                <Carousel.Slide key={event.id}>
                  <Card shadow="sm" padding="lg" radius="md" withBorder mx={10}>
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

                    <Button
                      // onClick={() => {
                      //   setSelectedEvent(event);
                      //   open();
                      // }}
                      fullWidth
                      mt="md"
                      radius="md"
                    >
                      See More
                    </Button>
                  </Card>
                </Carousel.Slide>
              ))}
            </Carousel>
          </Box>
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
