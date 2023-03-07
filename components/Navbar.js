import { useState } from "react";
import {
  createStyles,
  Header,
  Container,
  Group,
  Burger,
  Paper,
  Transition,
  Text,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useRouter } from "next/router";
import { signOut, useSession } from "next-auth/react";
// import { MantineLogo } from "@mantine/ds";

const HEADER_HEIGHT = "3.75rem";

const useStyles = createStyles((theme) => ({
  root: {
    position: "relative",
    zIndex: 1,
  },

  dropdown: {
    position: "absolute",
    top: HEADER_HEIGHT,
    left: 0,
    right: 0,
    zIndex: 0,
    borderTopRightRadius: 0,
    borderTopLeftRadius: 0,
    borderTopWidth: 0,
    overflow: "hidden",

    [theme.fn.largerThan("sm")]: {
      display: "none",
    },
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    height: "100%",
  },

  links: {
    [theme.fn.smallerThan("sm")]: {
      display: "none",
    },
  },

  burger: {
    [theme.fn.largerThan("sm")]: {
      display: "none",
    },
  },

  link: {
    display: "block",
    lineHeight: 1,
    padding: `0.5rem 0.7rem`,
    borderRadius: theme.radius.sm,
    textDecoration: "none",
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[0]
        : theme.colors.gray[7],
    fontSize: theme.fontSizes.sm,
    fontWeight: 500,

    "&:hover": {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[6]
          : theme.colors.gray[0],
    },

    [theme.fn.smallerThan("sm")]: {
      borderRadius: 0,
      padding: theme.spacing.md,
    },
  },

  linkActive: {
    "&, &:hover": {
      backgroundColor: theme.fn.variant({
        variant: "light",
        color: theme.primaryColor,
      }).background,
      color: theme.fn.variant({ variant: "light", color: theme.primaryColor })
        .color,
    },
  },
}));

export function Navbar() {
  const links = [
    {
      link: "/customers",
      label: "Customers",
    },
    {
      link: "/loans",
      label: "Loans",
    },
    {
      link: "/installments",
      label: "All Installments",
    },
    {
      link: "/groups",
      label: "Groups",
    },
  ];
  const [opened, { toggle, close }] = useDisclosure(false);
  const router = useRouter();
  const [active, setActive] = useState(router.pathname);
  // links[0].link
  const { classes, cx } = useStyles();
  const { data: session } = useSession({
    required: true,
  });

  if (!session) {
    return <></>;
  }

  const items = links.map((link) => (
    <Text
      key={link.label}
      className={cx(classes.link, {
        [classes.linkActive]: active === link.link,
      })}
      sx={{ cursor: "pointer" }}
      onClick={(event) => {
        event.preventDefault();
        router.push(link.link);
        setActive(link.link);
        close();
      }}
    >
      {link.label}
    </Text>
  ));

  return (
    <Header
      height={HEADER_HEIGHT}
      mb={10}
      mt={"-10px"}
      className={classes.root}
    >
      <Container className={classes.header}>
        {/* <MantineLogo size={28} /> */}
        <Text
          variant="gradient"
          gradient={{ from: "indigo", to: "cyan", deg: 45 }}
          sx={{ fontFamily: "Greycliff CF, sans-serif" }}
          ta="center"
          fz="xl"
          fw={700}
        >
          Neelam Finance
        </Text>
        <Group spacing={5} className={classes.links}>
          {items}
          <Text
            key={"Logout"}
            className={cx(classes.link, {
              [classes.linkActive]: active === "/logout",
            })}
            sx={{ cursor: "pointer" }}
            onClick={(event) => {
              event.preventDefault();
              signOut();
              router.push("/login");
              close();
            }}
          >
            {"Logout"}
          </Text>
        </Group>

        <Burger
          opened={opened}
          onClick={toggle}
          className={classes.burger}
          size="sm"
        />

        <Transition transition="pop-top-right" duration={200} mounted={opened}>
          {(styles) => (
            <Paper className={classes.dropdown} withBorder style={styles}>
              {items}
              <a
                key={"Logout"}
                className={cx(classes.link, {
                  [classes.linkActive]: active === "/logout",
                })}
                onClick={(event) => {
                  event.preventDefault();
                  signOut();
                  router.push("/login");
                  close();
                }}
              >
                {"Logout"}
              </a>
            </Paper>
          )}
        </Transition>
      </Container>
    </Header>
  );
}
