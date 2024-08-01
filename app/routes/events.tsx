import React, { useEffect, useRef } from "react";
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
import { link } from "node:fs";
import { a } from "vitest/dist/suite-IbNSsUWN";
import path from "node:path";

const images = [
  "https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-1.png",
  "https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-2.png",
  "https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-3.png",
  "https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-4.png",
  "https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-5.png",
];


export const meta: MetaFunction = () => [{ title: "Remix Notes" }];

export default function Index() {
  const user = useOptionalUser();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [opened, { open, close }] = useDisclosure(false);

  const slides = images.map((url) => (
    <Carousel.Slide key={url}>
      <Image m={"0"} p={"0"} src={url} radius={"md"} style={{
            height: "40%",   // Make image height 100% of the Carousel
            width: "100%",    // Make image width 100% of the Carousel
            objectFit: "cover",
            alignContent: "top" // Cover the Carousel container
          }}
/>
    </Carousel.Slide>
  ));

  return (
    <Paper style={{margin: "0", padding: "0"}}>
      <Box pos={"relative"} pb={"xl"} style={{margin: "0", padding: "0"}}>
          <Carousel style={{width: "100vw", margin: "0", maxWidth: "100%", height: "20vw", maxHeight: "20%"}} loop={true}>{slides}</Carousel>
      </Box>
      <Container
        style={{
          position: "relative",
          paddingBottom: "0",
          paddingTop: "0rem",
          width: "95vw",       
          maxWidth: "95%",
        }}
      >
        
        <Box mt={"lg"}>

          <Flex
            mb={"0"}
            p={"md"}
            pt={"xl"}
            mih={50}
            gap="md"
            justify="center"
            align="center"
            direction="row"
            wrap="wrap"
          >
            <Title order={1}>Upcoming Events!</Title>
          </Flex>

          
        </Box>
        <Box pt="0" ta={"center"}>
          <Carousel
            height={400}
            slideSize="20%"
            slideGap="lg"
            loop
            align="start"
            slidesToScroll={2}
            speed={2}
            withControls={true}
            pb={"0"}
            
          >
            <Carousel.Slide >
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
                  <Badge color="grey">21st Aug</Badge>
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
                  <Badge color="grey">23rd Aug</Badge>
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
                  <Badge color="grey">7th July</Badge>
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
                  <Badge color="grey">16th July</Badge>
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
                  <Badge color="grey">19th July</Badge>
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
                  <Badge color="grey">20th July</Badge>
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
                  <Badge color="grey">9th Sept</Badge>
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
                  <Badge color="grey">13th Sept</Badge>
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
                  <Badge color="grey">Coming Soon!</Badge>
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
                  <Badge color="grey">Coming Soon!</Badge>
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





      <Container
        style={{
          position: "relative",
          paddingBottom: "0",
          paddingTop: "0rem",
          width: "95vw",       
          maxWidth: "95%",     
          
        }}
      >
        
        <Box mt={"lg"}>

          <Flex
            mb={"0"}
            p={"md"}
            pt={"xl"}
            mih={50}
            gap="md"
            justify="center"
            align="center"
            direction="row"
            wrap="wrap"
          >
            <Title order={1}>Ongoing Events</Title>
          </Flex>

          
        </Box>
        <Box pt="0" ta={"center"}>
          <Carousel
            height={400}
            slideSize="20%"
            slideGap="lg"
            loop
            align="start"
            slidesToScroll={2}
            speed={2}
            withControls={true}
            pb={"0"}
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
                  <Badge color="grey">21st Aug</Badge>
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
                  <Badge color="grey">23rd Aug</Badge>
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
                  <Badge color="grey">7th July</Badge>
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
                  <Badge color="grey">16th July</Badge>
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
                  <Badge color="grey">19th July</Badge>
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
                  <Badge color="grey">20th July</Badge>
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
                  <Badge color="grey">9th Sept</Badge>
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
                  <Badge color="grey">13th Sept</Badge>
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
                  <Badge color="grey">Coming Soon!</Badge>
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
                  <Badge color="grey">Coming Soon!</Badge>
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




      <Container
        style={{
          position: "relative",
          paddingBottom: "0",
          paddingTop: "0rem",
          width: "95vw",       
          maxWidth: "95%",     
          
        }}
      >
        
        <Box mt={"lg"}>

          <Flex
            mb={"0"}
            p={"md"}
            pt={"xl"}
            mih={50}
            gap="md"
            justify="center"
            align="center"
            direction="row"
            wrap="wrap"
          >
            <Title order={1}>Previous Events</Title>
          </Flex>

          
        </Box>
        <Box pt="0" ta={"center"}>
          <Carousel
            height={400}
            slideSize="20%"
            slideGap="lg"
            loop
            align="start"
            slidesToScroll={2}
            speed={2}
            withControls={true}
            pb={"0"}
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
                  <Badge color="grey">21st Aug</Badge>
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
                  <Badge color="grey">23rd Aug</Badge>
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
                  <Badge color="grey">7th July</Badge>
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
                  <Badge color="grey">16th July</Badge>
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
                  <Badge color="grey">19th July</Badge>
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
                  <Badge color="grey">20th July</Badge>
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
                  <Badge color="grey">9th Sept</Badge>
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
                  <Badge color="grey">13th Sept</Badge>
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
                  <Badge color="grey">Coming Soon!</Badge>
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
                  <Badge color="grey">Coming Soon!</Badge>
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
        <Button
                  color="primary-color"
                  mt="md"
                  radius="md"
                  mb={"lg"}
                  ml={"47.5%"}
                  
                >
                  <Link to={"/all-events"}>View All</Link>
        </Button>
      </Container>
    </Paper>
  );
}
