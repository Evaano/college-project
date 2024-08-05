import {
  ActionIcon,
  Button,
  Container,
  Flex,
  Group,
  Modal,
  Paper,
  rem,
  SimpleGrid,
  Table,
  Textarea,
  TextInput,
  Title,
} from "@mantine/core";
import { DateTimePicker } from "@mantine/dates";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import {
  ActionFunctionArgs,
  json,
  LoaderFunctionArgs,
  MetaFunction,
} from "@remix-run/node";
import { Form, useActionData, useLoaderData } from "@remix-run/react";
import { IconPencil, IconTrash } from "@tabler/icons-react";
import dayjs from "dayjs";
import { SetStateAction, useEffect, useRef, useState } from "react";
import { z } from "zod";

import { prisma } from "~/db.server";
import { requireUserId } from "~/session.server";

interface Event {
  id: string;
  image: string;
  name: string;
  location: string;
  description: string;
  eventStart: string;
  eventEnd: string;
}

export const meta: MetaFunction = () => [{ title: "Add Event" }];

const formSchema = z.object({
  id: z.string().optional(),
  image: z.string().url(),
  name: z.string().min(1, "Event name is required"),
  location: z.string().min(1, "Location is required"),
  description: z.string().min(1, "Description is required"),
  start: z.string().datetime(),
  end: z.string().datetime(),
});

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const userId = await requireUserId(request);

  const events = await prisma.event.findMany({
    where: {
      userId: userId,
    },
  });

  return json({ events });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const { _action, ...form } = Object.fromEntries(formData);
  const userId = await requireUserId(request);

  const validatedForm = formSchema.safeParse(form);

  if (!validatedForm.success) {
    return json(
      { errors: validatedForm.error.formErrors.fieldErrors },
      { status: 400 },
    );
  }

  const validData = validatedForm.data;

  if (_action === "add") {
    await prisma.event.create({
      data: {
        image: validData.image,
        name: validData.name,
        location: validData.location,
        description: validData.description,
        eventStart: validData.start,
        eventEnd: validData.end,
        userId: userId,
      },
    });
  } else if (_action === "edit") {
    await prisma.event.update({
      where: { id: validData.id },
      data: {
        image: validData.image,
        name: validData.name,
        location: validData.location,
        description: validData.description,
        eventStart: validData.start,
        eventEnd: validData.end,
      },
    });
  }

  return json({ errors: null }, { status: 200 });
};

export default function AddEvents() {
  const [addOpened, { open: openAdd, close: closeAdd }] = useDisclosure(false);
  const [editOpened, { open: openEdit, close: closeEdit }] =
    useDisclosure(false);
  const currentDateTime = dayjs().toDate();
  const actionData = useActionData<typeof action>();
  const formRef = useRef<HTMLFormElement>(null);
  const { events } = useLoaderData<typeof loader>();
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  useEffect(() => {
    if (actionData?.errors === null) {
      notifications.show({
        title: "All Good!",
        message: "New event added successfully! 😺",
        radius: "md",
        autoClose: 3000,
      });
      formRef.current?.reset();
    }
  }, [actionData]);

  const handleEditClick = (event: SetStateAction<Event | null>) => {
    setSelectedEvent(event);
    openEdit();
  };

  const rows = events.map((event) => (
    <Table.Tr key={event.id}>
      <Table.Td>{event.name}</Table.Td>
      <Table.Td>{event.location}</Table.Td>
      <Table.Td>{event.description}</Table.Td>
      <Table.Td>
        {event.eventStart ? new Date(event.eventStart).toLocaleString() : "N/A"}
      </Table.Td>
      <Table.Td>
        {event.eventEnd ? new Date(event.eventEnd).toLocaleString() : "N/A"}
      </Table.Td>
      <Table.Td>
        <Group gap={0}>
          <ActionIcon
            variant="subtle"
            color="gray"
            onClick={() => handleEditClick(event)}
          >
            <IconPencil
              style={{ width: rem(16), height: rem(16) }}
              stroke={1.5}
            />
          </ActionIcon>
          <ActionIcon variant="subtle" color="red">
            <IconTrash
              style={{ width: rem(16), height: rem(16) }}
              stroke={1.5}
            />
          </ActionIcon>
        </Group>
      </Table.Td>
    </Table.Tr>
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
        <Flex justify={"space-between"} my="xl">
          <Title order={2}>My Events</Title>
          <Button onClick={openAdd}>Add Event</Button>
        </Flex>

        {/* Add event modal */}
        <Modal
          radius={"md"}
          opened={addOpened}
          onClose={closeAdd}
          title="Add Event"
        >
          <Form method={"post"} ref={formRef}>
            <TextInput
              label="Image"
              withAsterisk
              placeholder="url of the image"
              radius={"md"}
              name={"image"}
              error={actionData?.errors?.image}
            />
            <SimpleGrid cols={2} mt={"md"}>
              <TextInput
                label="Event Name"
                withAsterisk
                radius={"md"}
                name={"name"}
                error={actionData?.errors?.name}
              />
              <TextInput
                label="Location"
                withAsterisk
                radius={"md"}
                name={"location"}
                error={actionData?.errors?.location}
              />
            </SimpleGrid>
            <Textarea
              radius="md"
              label="Description"
              withAsterisk
              mt={"md"}
              placeholder={"brief description about the event"}
              name={"description"}
              error={actionData?.errors?.description}
            />
            <SimpleGrid cols={2} mt={"md"}>
              <DateTimePicker
                label="Start Date"
                defaultValue={currentDateTime}
                radius={"md"}
                mt={"md"}
                name={"start"}
                error={actionData?.errors?.start}
              />
              <DateTimePicker
                label="End Date"
                defaultValue={currentDateTime}
                radius={"md"}
                mt={"md"}
                name={"end"}
                error={actionData?.errors?.end}
              />
            </SimpleGrid>

            <Group justify="flex-end" mt="md">
              <Button
                type={"submit"}
                variant={"filled"}
                mt={"md"}
                name={"_action"}
                value={"add"}
              >
                Submit
              </Button>
            </Group>
          </Form>
        </Modal>

        {/* Edit event modal */}
        <Modal
          radius={"md"}
          opened={editOpened}
          onClose={closeEdit}
          title="Edit Event"
        >
          <Form method={"post"} ref={formRef}>
            <input type="hidden" name="id" value={selectedEvent?.id} />
            <TextInput
              label="Image"
              withAsterisk
              placeholder="url of the image"
              radius={"md"}
              name={"image"}
              defaultValue={selectedEvent?.image}
              error={actionData?.errors?.image}
            />
            <SimpleGrid cols={2} mt={"md"}>
              <TextInput
                label="Event Name"
                withAsterisk
                radius={"md"}
                name={"name"}
                defaultValue={selectedEvent?.name}
                error={actionData?.errors?.name}
              />
              <TextInput
                label="Location"
                withAsterisk
                radius={"md"}
                name={"location"}
                defaultValue={selectedEvent?.location}
                error={actionData?.errors?.location}
              />
            </SimpleGrid>
            <Textarea
              radius="md"
              label="Description"
              withAsterisk
              mt={"md"}
              placeholder={"brief description about the event"}
              name={"description"}
              defaultValue={selectedEvent?.description}
              error={actionData?.errors?.description}
            />
            <SimpleGrid cols={2} mt={"md"}>
              <DateTimePicker
                label="Start Date"
                defaultValue={
                  selectedEvent
                    ? new Date(selectedEvent.eventStart)
                    : currentDateTime
                }
                radius={"md"}
                mt={"md"}
                name={"start"}
                error={actionData?.errors?.start}
              />
              <DateTimePicker
                label="End Date"
                defaultValue={
                  selectedEvent
                    ? new Date(selectedEvent.eventEnd)
                    : currentDateTime
                }
                radius={"md"}
                mt={"md"}
                name={"end"}
                error={actionData?.errors?.end}
              />
            </SimpleGrid>

            <Group justify="flex-end" mt="md">
              <Button
                type={"submit"}
                variant={"filled"}
                mt={"md"}
                name={"_action"}
                value={"edit"}
              >
                Submit
              </Button>
            </Group>
          </Form>
        </Modal>

        <Table stickyHeader stickyHeaderOffset={60}>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Event Name</Table.Th>
              <Table.Th>Location</Table.Th>
              <Table.Th>Description</Table.Th>
              <Table.Th>Start Date</Table.Th>
              <Table.Th>End Date</Table.Th>
              <Table.Th>Action</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{rows}</Table.Tbody>
        </Table>
      </Container>
    </Paper>
  );
}
