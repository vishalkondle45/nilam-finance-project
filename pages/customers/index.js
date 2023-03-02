import { Navbar } from "@/components/Navbar";
import { Button, Modal, Textarea, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import axios from "axios";
import { MantineReactTable } from "mantine-react-table";
import React, { useEffect, useMemo, useState } from "react";

const Customers = () => {
  const [customers, setCustomers] = useState([]);

  const getCustomers = async () => {
    const { data } = await axios
      .get(`http://localhost:3000/api/customer`)
      .catch((error) => {
        console.log(error);
      });
    setCustomers(data.data);
  };
  useEffect(() => {
    getCustomers();
  }, []);

  const columns = useMemo(
    () => [
      {
        accessorKey: "id",
        header: "ID",
      },
      {
        accessorKey: "name",
        header: "Full Name",
      },
      {
        accessorKey: "mobile",
        header: "Mobile",
      },
      {
        accessorKey: "aadhar",
        header: "Aadhar",
      },
      {
        accessorKey: "address",
        header: "Address",
      },
      {
        accessorKey: "surity",
        header: "Surity",
      },
      {
        accessorKey: "comments",
        header: "comments",
      },
    ],
    []
  );

  const [opened, setOpened] = useState(false);

  const form = useForm({
    initialValues: {
      name: "",
      mobile: null,
      aadhar: null,
      address: "Vidi Gharkul, Hyderabad Road, Solapur",
      surity: "",
      comments: "",
    },
    validate: {
      name: (value) => (value?.length > 8 ? null : "Enter full name"),
      mobile: (value) =>
        value?.length === 10 && !isNaN(value) ? null : "Invalid mobile",
      aadhar: (value) => (value?.length === 12 ? null : "Invalid aadhar"),
      address: (value) =>
        value?.length > 20 ? null : "Enter valid surity name",
      surity: (value) => (value?.length > 8 ? null : "Enter valid surity name"),
    },
  });

  const handleSubmit = async (values) => {
    axios
      .post(`http://localhost:3000/api/customer`, values)
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {});
  };

  return (
    <>
      <Navbar />
      <MantineReactTable
        columns={columns}
        data={customers}
        initialState={{ density: "xs" }}
        enableRowSelection
        renderTopToolbarCustomActions={() => (
          <>
            <Button
              variant="contained"
              color="teal"
              onClick={() => setOpened(true)}
            >
              New Customer
            </Button>
          </>
        )}
        mantineTableProps={{
          sx: {
            tableLayout: "fixed",
          },
        }}
      />

      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title="New Customer"
      >
        <form onSubmit={form.onSubmit((values) => handleSubmit(values))}>
          <TextInput
            withAsterisk
            label="Name"
            placeholder="Full Name"
            {...form.getInputProps("name")}
          />
          <TextInput
            placeholder="Mobile"
            label="Mobile Number"
            withAsterisk
            {...form.getInputProps("mobile")}
            maxLength="10"
          />
          <TextInput
            placeholder="Aadhar"
            label="Aadhar Number"
            withAsterisk
            maxLength="12"
            {...form.getInputProps("aadhar")}
          />
          <TextInput
            placeholder="Address"
            label="Full Address"
            withAsterisk
            {...form.getInputProps("address")}
          />
          <TextInput
            placeholder="Surity"
            label="Surity Name"
            withAsterisk
            {...form.getInputProps("surity")}
          />
          <Textarea
            placeholder="Comments"
            label="Comments"
            {...form.getInputProps("comments")}
          />
          <Button fullWidth type="submit" mt="md">
            Submit
          </Button>
        </form>
      </Modal>
    </>
  );
};

export default Customers;
