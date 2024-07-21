import {
  Anchor,
  Box,
  Button,
  Checkbox,
  Container,
  Flex,
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

import { verifyLogin } from "~/models/user.server";
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
  const remember = formData.get("remember");

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

  const user = await verifyLogin(email, password);

  if (!user) {
    return json(
      { errors: { email: "Invalid email or password", password: null } },
      { status: 400 },
    );
  }

  return createUserSession({
    redirectTo,
    remember: remember === "on" ? true : false,
    request,
    userId: user.id,
  });
};

export const meta: MetaFunction = () => [{ title: "Login" }];

export default function LoginPage() {
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") || "/notes";
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
                radius="md"
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
                radius="md"
                className="w-full"
              />
            </div>

            <input type="hidden" name="redirectTo" value={redirectTo} />

            <Button
              type="submit"
              fullWidth
              radius="md"
              className="w-full bg-blue-500 hover:bg-blue-600 focus:bg-blue-400 text-white"
            >
              Log in
            </Button>

            <Group p="apart" className="mt-4">
              <Checkbox id="remember" name="remember" label="Remember me" />

              <Text size="sm" className="text-gray-500">
                Don&apos;t have an account?{" "}
                <Anchor
                  component={Link}
                  to={{ pathname: "/join", search: searchParams.toString() }}
                  className="text-blue-500 underline"
                >
                  Sign up
                </Anchor>
              </Text>
            </Group>
          </Form>
        </div>
      </Container>
    </Paper>
  );
}
