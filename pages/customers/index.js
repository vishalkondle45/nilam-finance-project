import { Navbar } from "@/components/Navbar";
import { Button, Group } from "@mantine/core";
import React from "react";

const Customers = () => {
  return (
    <>
      <Navbar />
      <Group position="right">
        <Button variant="filled" radius="xs">
          Add Customer
        </Button>
      </Group>
    </>
  );
};

export default Customers;
