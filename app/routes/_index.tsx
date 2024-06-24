import { Carousel } from "@mantine/carousel";
import { Box, Button, Container, Group, Image, Paper, Text, Title } from "@mantine/core";
import type { MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";

import { useOptionalUser } from "~/utils";

const images = [
  "https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-1.png",
  "https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-2.png",
  "https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-3.png",
  "https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-4.png",
  "https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-5.png"
];

const sponsors = [
  {
    src: "https://user-images.githubusercontent.com/1500684/157764397-ccd8ea10-b8aa-4772-a99b-35de937319e1.svg",
    alt: "Fly.io",
    href: "https://fly.io"
  },
  {
    src: "https://cdn.worldvectorlogo.com/logos/ooredoo-2.svg",
    alt: "Ooredoo",
    href: "https://www.ooredoo.mv"
  },
  {
    src: "https://user-images.githubusercontent.com/1500684/157772662-92b0dd3a-453f-4d18-b8be-9fa6efde52cf.png",
    alt: "Testing Library",
    href: "https://testing-library.com"
  },
  {
    src: "https://user-images.githubusercontent.com/1500684/157772934-ce0a943d-e9d0-40f8-97f3-f464c0811643.svg",
    alt: "Prettier",
    href: "https://prettier.io"
  },
  {
    src: "https://user-images.githubusercontent.com/1500684/157772990-3968ff7c-b551-4c55-a25c-046a32709a8e.svg",
    alt: "ESLint",
    href: "https://eslint.org"
  },
  {
    src: "https://user-images.githubusercontent.com/1500684/157773063-20a0ed64-b9f8-4e0b-9d1e-0b65a3d4a6db.svg",
    alt: "TypeScript",
    href: "https://typescriptlang.org"
  }
];

export const meta: MetaFunction = () => [{ title: "Remix Notes" }];

export default function Index() {
  const user = useOptionalUser();

  const slides = images.map((url) => (
    <Carousel.Slide key={url}>
      <Image src={url} radius={"md"} />
    </Carousel.Slide>
  ));

  return (
    <Paper>
      <Container style={{ position: "relative", paddingBottom: "4rem", paddingTop: "2rem" }}>
        <Box ta={"center"}>
          <Title order={1} size={"50px"}><Text span c={"primary-color"} inherit>EVENT {" "}</Text>HUB</Title>
        </Box>
        <Box pos={"relative"}>
          <Carousel>{slides}</Carousel>
          <Box pos={"absolute"} style={{ bottom: "2rem", left: "50%", transform: "translateX(-50%)" }}>
            <Group justify={"center"}>
              {user ? (
                <Button component={Link} to="/notes" variant="light" color="blue">
                  View Notes for {user.email}
                </Button>
              ) : (
                <>
                  <Button component={Link} to="/join" variant="filled" color={"primary-color"}>
                    Sign up
                  </Button>
                  <Button component={Link} to="/login" variant="filled" color={"black"}>
                    Log In
                  </Button>
                </>
              )}
            </Group>
          </Box>
        </Box>
        <Box mt={40}>
          <Box mb={24} p={16}
               style={{ backgroundColor: "white", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Title order={2}>Sponsored By</Title>
          </Box>
          <Group gap={32} justify="center" mt={24} mb={50}>
            {sponsors.map((img) => (
              <a key={img.href} href={img.href}
                      className="flex h-16 w-32 justify-center p-1 grayscale transition hover:grayscale-0 focus:grayscale-0">
                <Box
                  style={{
                    display: "flex",
                    height: 64,
                    width: 128,
                    justifyContent: "center",
                    padding: 8,
                    filter: "grayscale(1)",
                    transition: "filter 0.3s"
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.filter = "grayscale(0)"}
                  onMouseLeave={(e) => e.currentTarget.style.filter = "grayscale(1)"}
                >
                  <Image src={img.src} alt={img.alt} fit="contain" />
                </Box>
              </a>
            ))}
          </Group>
        </Box>
      </Container>
    </Paper>
  );
}
