/* eslint-disable react/jsx-no-leaked-render */
import {
  Table,
  Group,
  ActionIcon,
  rem,
  Paper,
  Title,
  Button,
  Modal,
  Container,
  Flex,
  TextInput,
  SimpleGrid,
  Select,
  Text,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import {
  json,
  redirect,
  LoaderFunctionArgs,
  ActionFunctionArgs,
} from "@remix-run/node";
import {
  Form,
  useActionData,
  useFetcher,
  useLoaderData,
} from "@remix-run/react";
import { IconPencil, IconTrash } from "@tabler/icons-react";
import { SetStateAction, useEffect, useRef, useState } from "react";
import { z } from "zod";

import { prisma } from "~/db.server";
import { getUserById } from "~/models/user.server";
import { getUser, requireUserId } from "~/session.server";
import { safeRedirect } from "~/utils";

interface User {
  id: string;
  email: string;
  role: {
    id: string;
    name: string;
  };
}

const formSchema = z.object({
  id: z.string(),
  email: z.string().optional(),
  role: z.string().optional(),
});

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { searchParams } = new URL(request.url);
  const redirectTo = safeRedirect(searchParams.get("redirectTo"), "/");
  const user = await getUser(request);
  const adminRoleId = process.env.ADMIN_ROLE_ID;

  if (user?.roleId !== adminRoleId) {
    return redirect(redirectTo);
  }

  const roles = await prisma.role.findMany();
  const users = await prisma.user.findMany({
    where: {
      deletedAt: null,
    },
    include: {
      role: true,
    },
  });

  return json({ roles, users });
};

// This is enough for the assignment but in a real world application there should be better validations like
// checking if the formData email, etc is in the db by doing a zod refine and safeParseAsync with separate schema for form and fetcher.
export const action = async ({ request }: ActionFunctionArgs) => {
  const userId = await requireUserId(request);
  const formData = await request.formData();
  const user = await getUserById(userId);
  const { _action, ...form } = Object.fromEntries(formData);

  console.log(_action);
  console.log(form);

  if (!user) {
    throw new Response(null, {
      status: 404,
      statusText: "Not Found",
    });
  }

  const validatedForm = formSchema.safeParse(form);

  if (!validatedForm.success) {
    return json(
      { errors: validatedForm.error.formErrors.fieldErrors },
      { status: 400 },
    );
  }

  const validData = validatedForm.data;

  console.log(validData);

  if (_action === "edit") {
    await prisma.user.update({
      where: { id: validData.id },
      data: {
        email: validData.email,
        roleId: validData.role,
      },
    });
    return json({ errors: null, message: "User updated successfully" });
  } else if (_action === "delete") {
    await prisma.user.update({
      where: { id: validData.id },
      data: {
        deletedAt: new Date(),
      },
    });
    return json({ errors: null, message: "User deleted successfully" });
  }

  throw new Response("Internal Server Error", {
    status: 500,
    statusText: "Internal Server Error",
  });
};

export default function UserManage() {
  const [editOpened, { open: openEdit, close: closeEdit }] =
    useDisclosure(false);
  const actionData = useActionData<typeof action>();
  const formRef = useRef<HTMLFormElement>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const { roles, users } = useLoaderData<typeof loader>();
  const fetcher = useFetcher();

  // Could make this better by using dynamic notification messages based on actionData message
  useEffect(() => {
    if (actionData?.errors === null) {
      notifications.show({
        title: "All Good!",
        message: "User updated successfully! 😺",
        autoClose: 3000,
      });
      formRef.current?.reset();
    }
  }, [actionData]);

  const handleEditClick = (user: SetStateAction<User | null>) => {
    setSelectedUser(user);
    openEdit();
  };

  const handleDelete = (userId: string) => {
    fetcher.submit({ id: userId, _action: "delete" }, { method: "post" });
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

  const rows = users.map((user) => (
    <Table.Tr key={user.id}>
      <Table.Td>{user.email}</Table.Td>
      <Table.Td>{user.role.name}</Table.Td>
      <Table.Td>
        <Group gap={0}>
          <ActionIcon
            variant="subtle"
            color="gray"
            onClick={() => handleEditClick(user)}
          >
            <IconPencil
              style={{ width: rem(16), height: rem(16) }}
              stroke={1.5}
            />
          </ActionIcon>
          <ActionIcon
            variant="subtle"
            color="red"
            onClick={() => openModal(user.id)}
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
          <Title order={2}>All Users</Title>
        </Flex>

        {/* Edit user modal */}
        <Modal opened={editOpened} onClose={closeEdit} title="Edit User">
          <Form method="post" ref={formRef}>
            <input type="hidden" name="id" value={selectedUser?.id} />
            <SimpleGrid cols={2} mt="md">
              <TextInput
                label="Email"
                withAsterisk
                name="email"
                defaultValue={selectedUser?.email}
              />
              <Select
                label="Role"
                placeholder="Choose role"
                defaultValue={selectedUser?.role.id}
                data={roles.map((role) => ({
                  value: role.id,
                  label: role.name,
                }))}
                name="role"
              />
            </SimpleGrid>

            <Group justify="flex-end" mt="md">
              <Button
                type="submit"
                variant="filled"
                mt="md"
                name="_action"
                value="edit"
              >
                Submit
              </Button>
            </Group>
          </Form>
        </Modal>

        <Table stickyHeader stickyHeaderOffset={60}>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Email</Table.Th>
              <Table.Th>Role</Table.Th>
              <Table.Th>Action</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{rows}</Table.Tbody>
        </Table>
      </Container>
    </Paper>
  );
}
