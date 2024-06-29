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
import type { MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";

import { useOptionalUser } from "~/utils";

const images = [
  "https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-1.png",
  "https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-2.png",
  "https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-3.png",
  "https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-4.png",
  "https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-5.png",
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

export const meta: MetaFunction = () => [{ title: "Remix Notes" }];

export default function Index() {
  const user = useOptionalUser();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [opened, { open, close }] = useDisclosure(false);

  const slides = images.map((url) => (
    <Carousel.Slide key={url}>
      <Image src={url} radius={"md"} />
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
          <Carousel loop={true}>{slides}</Carousel>
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
                <Button
                  component={Link}
                  to="/notes"
                  variant="light"
                  color="blue"
                >
                  View Notes for {user.email}
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
            <Carousel.Slide>
              <Card shadow="sm" padding="lg" radius="md" withBorder>
                <Card.Section>
                  <Image
                    src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-8.png"
                    height={160}
                    alt="Norway"
                  />
                </Card.Section>

                <Group justify="space-between" mt="md" mb="xs">
                  <Text fw={500}>Norway Fjord Adventures</Text>
                  <Badge color="pink">Ongoing</Badge>
                </Group>

                <Text size="sm" c="dimmed" ta={"left"}>
                  With Fjord Tours you can explore more of the magical fjord
                  landscapes with tours and activities on and around the fjords
                  of Norway
                </Text>
                <Modal
                  opened={opened}
                  onClose={close}
                  title="Event Details"
                  centered
                  radius={"md"}
                >
                  {<Text>Location: Central Park</Text>}
                </Modal>
                <Button
                  onClick={open}
                  color="blue"
                  fullWidth
                  mt="md"
                  radius="md"
                >
                  See More
                </Button>
              </Card>
            </Carousel.Slide>

            <Carousel.Slide>
              <Card shadow="sm" padding="lg" radius="md" withBorder>
                <Card.Section>
                  <Image
                    src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-2.png"
                    height={160}
                    alt="Norway"
                  />
                </Card.Section>

                <Group justify="space-between" mt="md" mb="xs">
                  <Text fw={500}>Norway Fjord Adventures</Text>
                  <Badge color="pink">Ongoing</Badge>
                </Group>

                <Text size="sm" c="dimmed" ta={"left"}>
                  With Fjord Tours you can explore more of the magical fjord
                  landscapes with tours and activities on and around the fjords
                  of Norway
                </Text>

                <Button
                  onClick={open}
                  color="blue"
                  fullWidth
                  mt="md"
                  radius="md"
                >
                  See More
                </Button>
              </Card>
            </Carousel.Slide>

            <Carousel.Slide>
              <Card shadow="sm" padding="lg" radius="md" withBorder>
                <Card.Section>
                  <Image
                    src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-1.png"
                    height={160}
                    alt="Norway"
                  />
                </Card.Section>

                <Group justify="space-between" mt="md" mb="xs">
                  <Text fw={500}>Norway Fjord Adventures</Text>
                  <Badge color="grey">Finished Event</Badge>
                </Group>

                <Text size="sm" c="dimmed" ta={"left"}>
                  With Fjord Tours you can explore more of the magical fjord
                  landscapes with tours and activities on and around the fjords
                  of Norway
                </Text>

                <Button
                  onClick={open}
                  color="blue"
                  fullWidth
                  mt="md"
                  radius="md"
                >
                  See More
                </Button>
              </Card>
            </Carousel.Slide>

            <Carousel.Slide>
              <Card shadow="sm" padding="lg" radius="md" withBorder>
                <Card.Section>
                  <Image
                    src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-3.png"
                    height={160}
                    alt="Norway"
                  />
                </Card.Section>

                <Group justify="space-between" mt="md" mb="xs">
                  <Text fw={500}>Norway Fjord Adventures</Text>
                  <Badge color="grey">Finished Event</Badge>
                </Group>

                <Text size="sm" c="dimmed">
                  With Fjord Tours you can explore more of the magical fjord
                  landscapes with tours and activities on and around the fjords
                  of Norway
                </Text>

                <Button
                  onClick={open}
                  color="blue"
                  fullWidth
                  mt="md"
                  radius="md"
                >
                  See More
                </Button>
              </Card>
            </Carousel.Slide>

            <Carousel.Slide>
              <Card shadow="sm" padding="lg" radius="md" withBorder>
                <Card.Section>
                  <Image
                    src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-4.png"
                    height={160}
                    alt="Norway"
                  />
                </Card.Section>

                <Group justify="space-between" mt="md" mb="xs">
                  <Text fw={500}>Norway Fjord Adventures</Text>
                  <Badge color="grey">Finished Event</Badge>
                </Group>

                <Text size="sm" c="dimmed">
                  With Fjord Tours you can explore more of the magical fjord
                  landscapes with tours and activities on and around the fjords
                  of Norway
                </Text>

                <Button
                  onClick={open}
                  color="blue"
                  fullWidth
                  mt="md"
                  radius="md"
                >
                  See More
                </Button>
              </Card>
            </Carousel.Slide>

            <Carousel.Slide>
              <Card shadow="sm" padding="lg" radius="md" withBorder>
                <Card.Section>
                  <Image
                    src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-5.png"
                    height={160}
                    alt="Norway"
                  />
                </Card.Section>

                <Group justify="space-between" mt="md" mb="xs">
                  <Text fw={500}>Norway Fjord Adventures</Text>
                  <Badge color="grey">Finished Event</Badge>
                </Group>

                <Text size="sm" c="dimmed">
                  With Fjord Tours you can explore more of the magical fjord
                  landscapes with tours and activities on and around the fjords
                  of Norway
                </Text>

                <Button
                  onClick={open}
                  color="blue"
                  fullWidth
                  mt="md"
                  radius="md"
                >
                  See More
                </Button>
              </Card>
            </Carousel.Slide>

            <Carousel.Slide>
              <Card shadow="sm" padding="lg" radius="md" withBorder>
                <Card.Section>
                  <Image
                    src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-6.png"
                    height={160}
                    alt="Norway"
                  />
                </Card.Section>

                <Group justify="space-between" mt="md" mb="xs">
                  <Text fw={500}>Norway Fjord Adventures</Text>
                  <Badge color="grey">Finished Event</Badge>
                </Group>

                <Text size="sm" c="dimmed">
                  With Fjord Tours you can explore more of the magical fjord
                  landscapes with tours and activities on and around the fjords
                  of Norway
                </Text>

                <Button
                  onClick={open}
                  color="blue"
                  fullWidth
                  mt="md"
                  radius="md"
                >
                  See More
                </Button>
              </Card>
            </Carousel.Slide>

            <Carousel.Slide>
              <Card shadow="sm" padding="lg" radius="md" withBorder>
                <Card.Section>
                  <Image
                    src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-7.png"
                    height={160}
                    alt="Norway"
                  />
                </Card.Section>

                <Group justify="space-between" mt="md" mb="xs">
                  <Text fw={500}>Norway Fjord Adventures</Text>
                  <Badge color="grey">Finished Event</Badge>
                </Group>

                <Text size="sm" c="dimmed">
                  With Fjord Tours you can explore more of the magical fjord
                  landscapes with tours and activities on and around the fjords
                  of Norway
                </Text>

                <Button
                  onClick={open}
                  color="blue"
                  fullWidth
                  mt="md"
                  radius="md"
                >
                  See More
                </Button>
              </Card>
            </Carousel.Slide>

            <Carousel.Slide>
              <Card shadow="sm" padding="lg" radius="md" withBorder>
                <Card.Section>
                  <Image
                    src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-9.png"
                    height={160}
                    alt="Norway"
                  />
                </Card.Section>

                <Group justify="space-between" mt="md" mb="xs">
                  <Text fw={500}>Norway Fjord Adventures</Text>
                  <Badge color="grey">Finished Event</Badge>
                </Group>

                <Text size="sm" c="dimmed">
                  With Fjord Tours you can explore more of the magical fjord
                  landscapes with tours and activities on and around the fjords
                  of Norway
                </Text>

                <Button
                  onClick={open}
                  color="blue"
                  fullWidth
                  mt="md"
                  radius="md"
                >
                  See More
                </Button>
              </Card>
            </Carousel.Slide>
          </Carousel>
        </Box>
      </Container>
    </Paper>
  );
}
