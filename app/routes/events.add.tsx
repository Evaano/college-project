import {
  ActionIcon,
  Button,
  Checkbox,
  Container,
  Flex,
  Group,
  Modal,
  Paper,
  rem,
  Select,
  SimpleGrid,
  Table,
  Text,
  Textarea,
  TextInput,
  Title,
} from "@mantine/core";
import { DateTimePicker } from "@mantine/dates";
import { useDisclosure } from "@mantine/hooks";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import {
  ActionFunctionArgs,
  json,
  LoaderFunctionArgs,
  MetaFunction,
} from "@remix-run/node";
import {
  Form,
  useActionData,
  useFetcher,
  useLoaderData,
} from "@remix-run/react";
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
  featured: boolean;
}

export const meta: MetaFunction = () => [{ title: "Add Event" }];

const addSchema = z.object({
  id: z.string().optional(),
  image: z.string().url(),
  name: z.string().min(1, "Event name is required"),
  location: z.string().min(1, "Location is required"),
  description: z.string().min(1, "Description is required"),
  start: z.string().datetime(),
  end: z.string().datetime(),
  category: z.string(),
  featured: z.preprocess((val) => val === "true", z.boolean()).default(false),
});

const editSchema = z.object({
  id: z.string(),
  image: z.string().url().optional(),
  name: z.string().optional(),
  location: z.string().optional(),
  description: z.string().optional(),
  start: z.string().datetime().optional(),
  end: z.string().datetime().optional(),
  category: z.string().optional(),
  featured: z.preprocess((val) => val === "true", z.boolean()).default(false),
});

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const userId = await requireUserId(request);

  const userVendor = await prisma.user.findFirst({
    where: {
      id: userId,
    },
    include: {
      vendor: true,
    },
  });

  if (!userVendor || !userVendor.vendor) {
    throw new Response(null, {
      status: 404,
      statusText: "User Vendor Not Found",
    });
  }

  const events = await prisma.event.findMany({
    where: {
      deletedAt: null,
      vendorId: userVendor.vendor.id,
    },
  });

  const categories = await prisma.category.findMany();

  return json({ events, categories });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const { _action, ...form } = Object.fromEntries(formData);
  const userId = await requireUserId(request);

  const userVendor = await prisma.user.findFirst({
    where: {
      id: userId,
    },
    include: {
      vendor: true,
    },
  });

  if (!userVendor || !userVendor.vendor) {
    throw new Response(null, {
      status: 404,
      statusText: "User Vendor Not Found",
    });
  }

  if (_action === "add") {
    const validatedForm = addSchema.safeParse(form);

    if (!validatedForm.success) {
      return json(
        { errors: validatedForm.error.formErrors.fieldErrors },
        { status: 400 },
      );
    }

    const validData = validatedForm.data;

    await prisma.event.create({
      data: {
        image: validData.image,
        name: validData.name,
        location: validData.location,
        description: validData.description,
        eventStart: validData.start,
        eventEnd: validData.end,
        vendorId: userVendor.vendor.id,
        categoryId: validData.category,
        featured: validData.featured,
      },
    });
  } else if (_action === "edit") {
    const validatedForm = editSchema.safeParse(form);

    if (!validatedForm.success) {
      return json(
        { errors: validatedForm.error.formErrors.fieldErrors },
        { status: 400 },
      );
    }

    const validData = validatedForm.data;

    await prisma.event.update({
      where: { id: validData.id },
      data: {
        image: validData.image,
        name: validData.name,
        location: validData.location,
        description: validData.description,
        eventStart: validData.start,
        eventEnd: validData.end,
        vendorId: userVendor.vendor.id,
        categoryId: validData.category,
        featured: validData.featured,
      },
    });
  } else if (_action === "delete") {
    const validatedForm = editSchema.safeParse(form);

    if (!validatedForm.success) {
      return json(
        { errors: validatedForm.error.formErrors.fieldErrors },
        { status: 400 },
      );
    }

    const validData = validatedForm.data;

    await prisma.event.update({
      where: { id: validData.id },
      data: {
        deletedAt: new Date(),
      },
    });
  }

  return json({ errors: null }, { status: 200 });
};

// Could use file system and store the image in public/uploads but for this assignment image url is fine.
export default function AddEvents() {
  const [addOpened, { open: openAdd, close: closeAdd }] = useDisclosure(false);
  const [editOpened, { open: openEdit, close: closeEdit }] =
    useDisclosure(false);
  const currentDateTime = dayjs().toDate();
  const actionData = useActionData<typeof action>();
  const formRef = useRef<HTMLFormElement>(null);
  const { events, categories } = useLoaderData<typeof loader>();
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const fetcher = useFetcher();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (actionData?.errors === null) {
      notifications.show({
        title: "All Good!",
        message: "Action executed successfully! 😺",
        autoClose: 3000,
      });
      formRef.current?.reset();
    }
  }, [actionData]);

  const handleEditClick = (event: SetStateAction<Event | null>) => {
    setSelectedEvent(event);
    openEdit();
  };

  const handleDelete = (id: string) => {
    fetcher.submit({ id: id, _action: "delete" }, { method: "post" });
  };

  const openModal = (id: string) =>
    modals.openConfirmModal({
      title: "Are you sure you want to delete this user?",
      children: (
        <Text size="sm">
          This action will mark the user for deletion. The user will not be
          permanently removed but will be flagged as deleted in the system.
        </Text>
      ),
      labels: { confirm: "Confirm", cancel: "Cancel" },
      confirmProps: { color: "red" },
      onCancel: () => console.log("Cancel"),
      onConfirm: () => handleDelete(id),
    });

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
      <Table.Td>{event.featured ? "Yes" : "No"}</Table.Td>
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
          <ActionIcon
            variant="subtle"
            color="red"
            onClick={() => openModal(event.id)}
          >
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
        size={"lg"}
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
        <Modal opened={addOpened} onClose={closeAdd} title="Add Event">
          <Form method={"post"} ref={formRef}>
            <TextInput
              label="Image"
              withAsterisk
              placeholder="url of the image"
              name={"image"}
              error={actionData?.errors?.image}
            />
            <SimpleGrid cols={2} mt={"md"}>
              <TextInput
                label="Event Name"
                withAsterisk
                name={"name"}
                error={actionData?.errors?.name}
              />
              <TextInput
                label="Location"
                withAsterisk
                name={"location"}
                error={actionData?.errors?.location}
              />
            </SimpleGrid>
            <Textarea
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
                mt={"sm"}
                name={"start"}
                error={actionData?.errors?.start}
              />
              <DateTimePicker
                label="End Date"
                defaultValue={currentDateTime}
                mt={"sm"}
                name={"end"}
                error={actionData?.errors?.end}
              />
            </SimpleGrid>
            <Select
              mt={"lg"}
              label="Category"
              placeholder="choose category"
              data={categories.map((category) => ({
                value: category.id,
                label: category.name,
              }))}
              name={"category"}
            />

            <Group justify="space-between" mt="md">
              <Checkbox
                defaultChecked={"off"}
                label="Featured"
                checked={checked}
                onChange={(event) => setChecked(event.currentTarget.checked)}
              />
              <input
                type="hidden"
                value={JSON.stringify(checked)}
                name="featured"
              />
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
        <Modal opened={editOpened} onClose={closeEdit} title="Edit Event">
          <Form method={"post"} ref={formRef}>
            <input type="hidden" name="id" value={selectedEvent?.id} />
            <TextInput
              label="Image"
              withAsterisk
              placeholder="url of the image"
              name={"image"}
              defaultValue={selectedEvent?.image}
              error={actionData?.errors?.image}
            />
            <SimpleGrid cols={2} mt={"md"}>
              <TextInput
                label="Event Name"
                withAsterisk
                name={"name"}
                defaultValue={selectedEvent?.name}
                error={actionData?.errors?.name}
              />
              <TextInput
                label="Location"
                withAsterisk
                name={"location"}
                defaultValue={selectedEvent?.location}
                error={actionData?.errors?.location}
              />
            </SimpleGrid>
            <Textarea
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
                mt={"md"}
                name={"end"}
                error={actionData?.errors?.end}
              />
            </SimpleGrid>

            <Group justify="space-between" mt="md">
              <Checkbox
                defaultValue={"off"}
                label="Featured"
                checked={checked}
                onChange={(event) => setChecked(event.currentTarget.checked)}
              />
              <input
                type="hidden"
                value={JSON.stringify(checked)}
                name="featured"
              />
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
              <Table.Th>Featured</Table.Th>
              <Table.Th>Action</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{rows}</Table.Tbody>
        </Table>
      </Container>
    </Paper>
  );
}
