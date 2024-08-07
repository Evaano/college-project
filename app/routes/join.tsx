import {
  Anchor,
  Button,
  Checkbox,
  Container,
  Group,
  Paper,
  PasswordInput,
  Text,
  TextInput,
} from "@mantine/core";
import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
} from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, Link, useActionData, useSearchParams } from "@remix-run/react";
import { useEffect, useRef } from "react";

import { createUser, getUserByEmail } from "~/models/user.server";
import { createUserSession, getUserId } from "~/session.server";
import { safeRedirect, validateEmail } from "~/utils";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const userId = await getUserId(request);
  if (userId) return redirect("/");
  return json({});
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");
  const redirectTo = safeRedirect(formData.get("redirectTo"), "/");

  if (!validateEmail(email)) {
    return json(
      { errors: { email: "Email is invalid", password: null } },
      { status: 400 },
    );
  }

  if (typeof password !== "string" || password.length === 0) {
    return json(
      { errors: { email: null, password: "Password is required" } },
      { status: 400 },
    );
  }

  if (password.length < 8) {
    return json(
      { errors: { email: null, password: "Password is too short" } },
      { status: 400 },
    );
  }

  const existingUser = await getUserByEmail(email);
  if (existingUser) {
    return json(
      {
        errors: {
          email: "A user already exists with this email",
          password: null,
        },
      },
      { status: 400 },
    );
  }

  const user = await createUser(email, password);

  return createUserSession({
    redirectTo,
    remember: false,
    request,
    userId: user.id,
  });
};

export const meta: MetaFunction = () => [{ title: "Sign Up" }];

export default function Join() {
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") ?? undefined;
  const actionData = useActionData<typeof action>();
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (actionData?.errors?.email) {
      emailRef.current?.focus();
    } else if (actionData?.errors?.password) {
      passwordRef.current?.focus();
    }
  }, [actionData]);

  return (
    <Paper>
      <Container className="flex justify-center items-center w-full py-12">
        <div className="w-full sm:w-96">
          <Form method="post" className="space-y-6">
            <div className="mt-1">
              <TextInput
                label="Email"
                placeholder={"your@email.com"}
                ref={emailRef}
                required
                name="email"
                autoComplete="email"
                error={actionData?.errors?.email}
                className="w-full"
              />
            </div>

            <div className="mt-1">
              <PasswordInput
                placeholder="Your password"
                label="Password"
                required
                name="password"
                ref={passwordRef}
                autoComplete="current-password"
                error={actionData?.errors?.password}
                className="w-full"
              />
            </div>

            <input type="hidden" name="redirectTo" value={redirectTo} />

            <Button
              type="submit"
              fullWidth
              className="w-full bg-blue-500 hover:bg-blue-600 focus:bg-blue-400 text-white"
            >
              Sign up
            </Button>

            <Group p="apart" className="mt-4">
              <Checkbox id="remember" name="remember" label="Remember me" />

              <Text size="sm" className="text-gray-500">
                Already have an account?{" "}
                <Anchor
                  component={Link}
                  to={{ pathname: "/login", search: searchParams.toString() }}
                  className="text-blue-500 underline"
                >
                  Login
                </Anchor>
              </Text>
            </Group>
          </Form>
        </div>
      </Container>
    </Paper>
  );
}
