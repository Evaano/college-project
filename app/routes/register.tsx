import {
  Button,
  Container,
  Flex,
  Group,
  NumberInput,
  Paper,
  SimpleGrid,
  Textarea,
  TextInput,
  Title,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import {
  ActionFunctionArgs,
  json,
  LoaderFunctionArgs,
  MetaFunction,
} from "@remix-run/node";
import { Form, useActionData, useNavigate } from "@remix-run/react";
import { useEffect, useRef } from "react";
import { z } from "zod";

import { prisma } from "~/db.server";
import { requireUserId } from "~/session.server";

export const meta: MetaFunction = () => [{ title: "Vendor Registration" }];

const formSchema = z.object({
  name: z.string().min(1, "Vendor name is required"),
  email: z.string().toLowerCase().min(1, "Vendor mail is required"),
  address: z.string().min(1, "Vendor address is required"),
  phone: z.coerce.string().min(1, "Phone is required"),
  description: z.string().optional(),
});

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const userId = await requireUserId(request);

  return json({});
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
    const newVendor = await prisma.vendor.create({
      data: {
        name: validData.name,
        description: validData.description,
        address: validData.address,
        phoneNumber: validData.phone,
      },
    });

    await prisma.user.update({
      where: { id: userId },
      data: {
        vendorId: newVendor.id,
      },
    });

    return json({ errors: null }, { status: 200 });
  }

  throw new Response("Internal Server Error", {
    status: 500,
    statusText: "Internal Server Error",
  });
};

export default function VendorRegistration() {
  const actionData = useActionData<typeof action>();
  const formRef = useRef<HTMLFormElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (actionData?.errors === null) {
      notifications.show({
        title: "All Good!",
        message: "New event added successfully! 😺",
        radius: "md",
        autoClose: 3000,
      });
      navigate("/register");
    }
  }, [actionData, navigate]);

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
          <Title order={2}>Vendor Registration</Title>
        </Flex>
        <Form method="post" ref={formRef}>
          <SimpleGrid cols={2} mt="md">
            <TextInput
              label="Vendor Name"
              withAsterisk
              radius="md"
              name="name"
              error={actionData?.errors?.name}
            />
            <TextInput
              label="Address"
              radius="md"
              withAsterisk
              name="address"
              error={actionData?.errors?.address}
            />
            <NumberInput
              label="Phone"
              withAsterisk
              hideControls
              radius="md"
              name="phone"
              error={actionData?.errors?.phone}
            />
            <TextInput
              label="Email"
              radius="md"
              withAsterisk
              name="email"
              error={actionData?.errors?.email}
            />
          </SimpleGrid>
          <Textarea
            radius="md"
            label="Description"
            mt="md"
            name="description"
            error={actionData?.errors?.description}
          />
          <Group justify="flex-end" mt="md">
            <Button
              type="submit"
              variant="filled"
              mt="md"
              name="_action"
              value="add"
            >
              Submit
            </Button>
          </Group>
        </Form>
      </Container>
    </Paper>
  );
}
