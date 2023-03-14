import {
  TextInput,
  PasswordInput,
  Paper,
  Title,
  Container,
  Button,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";

export default function Login() {
  const router = useRouter();

  const [processing, setProcessing] = useState(false);

  const form = useForm({
    initialValues: {
      email: "",
      password: "",
    },

    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
    },
  });

  const handleLogin = async (values) => {
    setProcessing(true);
    signIn("credentials", {
      ...values,
      redirect: false,
    })
      .then((response) => {
        if (response.ok) {
          showNotification({
            title: "Success",
            message: "You logged in successfully.",
            icon: <IconCheck size={18} />,
            color: "green",
          });
          router.push("/");
        }
        if (response.error) {
          if (response.error === "CredentialsSignin") {
            showNotification({
              title: response.error,
              message: "Invalid Username or Password",
              icon: <IconX size={18} />,
              color: "red",
            });
          } else {
            showNotification({
              title: response.error,
              message: "Unknown Error",
              icon: <IconX size={18} />,
              color: "red",
            });
          }
        }
      })
      .catch((error) => {
        showNotification({
          title: error.error,
          message: "System Error",
        });
      });
    setProcessing(false);
  };

  return (
    <>
      <Container size={400} my={40}>
        <Title
          align="center"
          sx={(theme) => ({
            fontFamily: `Greycliff CF, ${theme.fontFamily}`,
            fontWeight: 900,
          })}
        >
          Please Login
        </Title>

        <Paper withBorder shadow="md" p={30} mt={30} radius="md">
          <form onSubmit={form.onSubmit((values) => handleLogin(values))}>
            <TextInput
              label="Email"
              required
              withAsterisk
              placeholder="your@email.com"
              {...form.getInputProps("email")}
            />
            <PasswordInput
              withAsterisk
              label="Password"
              placeholder="Your password"
              required
              mt="md"
              {...form.getInputProps("password")}
            />
            <Button fullWidth mt="xl" disabled={processing} type="submit">
              Submit
            </Button>
          </form>
        </Paper>
      </Container>
    </>
  );
}
