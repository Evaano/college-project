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
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import {
  json,
  redirect,
  LoaderFunctionArgs,
  ActionFunctionArgs,
} from "@remix-run/node";
import { Form, useActionData, useLoaderData } from "@remix-run/react";
import { IconPencil, IconTrash } from "@tabler/icons-react";
import { SetStateAction, useEffect, useRef, useState } from "react";

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
    include: {
      role: true,
    },
  });

  return json({ roles, users });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const userId = await requireUserId(request);
  const formData = await request.formData();
  const user = await getUserById(userId);
  const { _action, form } = Object.fromEntries(formData);

  console.log(_action, form);

  if (!user) {
    throw new Response(null, {
      status: 404,
      statusText: "Not Found",
    });
  }

  return json({ errors: null }, { status: 200 });
};

export default function UserManage() {
  const [editOpened, { open: openEdit, close: closeEdit }] =
    useDisclosure(false);
  const actionData = useActionData<typeof action>();
  const formRef = useRef<HTMLFormElement>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const { roles, users } = useLoaderData<typeof loader>();

  useEffect(() => {
    if (actionData?.errors === null) {
      notifications.show({
        title: "All Good!",
        message: "New event added successfully! 😺",
        autoClose: 3000,
      });
      formRef.current?.reset();
    }
  }, [actionData]);

  const handleEditClick = (user: SetStateAction<User | null>) => {
    setSelectedUser(user);
    openEdit();
  };

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
        <Modal opened={editOpened} onClose={closeEdit} title="Edit Event">
          <Form method={"post"} ref={formRef}>
            <input type="hidden" name="id" value={selectedUser?.id} />
            <SimpleGrid cols={2} mt={"md"}>
              <TextInput
                label="Email"
                withAsterisk
                name={"name"}
                defaultValue={selectedUser?.email}
              />
              <Select
                label="Role"
                placeholder="choose role"
                defaultValue={selectedUser?.role.id}
                data={roles.map((role) => ({
                  value: role.id,
                  label: role.name,
                }))}
                name={"role"}
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
