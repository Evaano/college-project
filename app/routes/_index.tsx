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
import { useMediaQuery, useDisclosure } from "@mantine/hooks";
import { json, LoaderFunction, MetaFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import Autoplay from "embla-carousel-autoplay";
import { useRef, useState } from "react";

import { prisma } from "~/db.server";
import { useOptionalUser } from "~/utils";

const featuredEvents = [
  {
    image:
      "https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-1.png",
    id: 1,
  },
  {
    image:
      "https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-2.png",
    id: 2,
  },
  {
    image:
      "https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-3.png",
    id: 3,
  },
  {
    image:
      "https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-4.png",
    id: 4,
  },
];

const sponsors = [
  {
    src: "https://user-images.githubusercontent.com/1500684/157764397-ccd8ea10-b8aa-4772-a99b-35de937319e1.svg",
    alt: "Fly.io",
    href: "https://fly.io",
  },
  {
    src: "https://cdn.worldvectorlogo.com/logos/ooredoo-2.svg",
    alt: "Ooredoo",
    href: "https://www.ooredoo.mv",
  },
  {
    src: "https://user-images.githubusercontent.com/1500684/157772662-92b0dd3a-453f-4d18-b8be-9fa6efde52cf.png",
    alt: "Testing Library",
    href: "https://testing-library.com",
  },
  {
    src: "https://user-images.githubusercontent.com/1500684/157772934-ce0a943d-e9d0-40f8-97f3-f464c0811643.svg",
    alt: "Prettier",
    href: "https://prettier.io",
  },
  {
    src: "https://user-images.githubusercontent.com/1500684/157772990-3968ff7c-b551-4c55-a25c-046a32709a8e.svg",
    alt: "ESLint",
    href: "https://eslint.org",
  },
  {
    src: "https://user-images.githubusercontent.com/1500684/157773063-20a0ed64-b9f8-4e0b-9d1e-0b65a3d4a6db.svg",
    alt: "TypeScript",
    href: "https://typescriptlang.org",
  },
];

export const meta: MetaFunction = () => [{ title: "Event Hub" }];

interface Event {
  id: string;
  name: string;
  description: string;
  image?: string;
  status: string;
  location: string;
  eventStart: Date;
  eventEnd: Date;
}

export const loader: LoaderFunction = async () => {
  const events = await prisma.event.findMany({});

  return json({ events });
};

export default function Index() {
  const { events } = useLoaderData<typeof loader>();
  const user = useOptionalUser();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [opened, { open, close }] = useDisclosure(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const autoplay = useRef(Autoplay({ delay: 2000 }));

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
        <Box ta={"center"} mb={"md"}>
          <Title order={1} size={"50px"}>
            <Text span c={"primary-color"} inherit>
              Event{" "}
            </Text>
            Hub
          </Title>
        </Box>
        <Box pos={"relative"}>
          <Carousel
            withControls={false}
            withIndicators={false}
            plugins={[autoplay.current]}
            onMouseEnter={autoplay.current.stop}
            onMouseLeave={autoplay.current.reset}
          >
            {slides}
          </Carousel>
          <Box
            pos={"absolute"}
            style={{
              bottom: "2rem",
              left: "50%",
              transform: "translateX(-50%)",
            }}
          >
            <Group justify={"center"}>
              {user ? (
                <Button component={Link} to="/">
                  Logged in as {user.email}
                </Button>
              ) : (
                !isMobile && (
                  <>
                    <Button
                      component={Link}
                      to="/join"
                      variant="filled"
                      color={"primary-color"}
                    >
                      Sign up
                    </Button>
                    <Button
                      component={Link}
                      to="/login"
                      variant="filled"
                      color={"black"}
                    >
                      Log In
                    </Button>
                  </>
                )
              )}
            </Group>
          </Box>
        </Box>
        <Box mt={40}>
          <Flex
            mb={24}
            p={16}
            mih={50}
            gap="md"
            justify="center"
            align="center"
            direction="row"
            wrap="wrap"
          >
            <Title order={2}>Sponsored By</Title>
          </Flex>
          <Group gap={32} justify="center" mt={24} mb={50}>
            {sponsors.map((img) => (
              <a
                key={img.href}
                href={img.href}
                className="flex h-16 w-32 justify-center p-1 grayscale transition hover:grayscale-0 focus:grayscale-0"
              >
                <Box
                  style={{
                    display: "flex",
                    height: 64,
                    width: 128,
                    justifyContent: "center",
                    padding: 8,
                    filter: "grayscale(1)",
                    transition: "filter 0.3s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.filter = "grayscale(0)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.filter = "grayscale(1)")
                  }
                >
                  <Image src={img.src} alt={img.alt} fit="contain" />
                </Box>
              </a>
            ))}
          </Group>
        </Box>
        <Box pt="lg" ta={"center"}>
          <Carousel
            height={420}
            slideSize="33.333333%"
            slideGap="sm"
            loop
            align="start"
            slidesToScroll={3}
            speed={4}
            withControls={false}
            withIndicators={true}
            pb={"xl"}
          >
            {events.map((event: Event) => (
              <Carousel.Slide key={event.id}>
                <Card shadow="sm" padding="lg" radius="md" withBorder>
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
                    onClick={() => {
                      setSelectedEvent(event);
                      open();
                    }}
                    color="blue"
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

      <Modal
        opened={opened}
        onClose={close}
        title="Event Details"
        centered
        radius={"md"}
      >
        {selectedEvent ? (
          <>
            <Text>Location: {selectedEvent.location}</Text>
            <Text>
              Start Date{" "}
              {new Date(selectedEvent.eventStart).toLocaleDateString()}
            </Text>
          </>
        ) : null}
      </Modal>
    </Paper>
  );
}
