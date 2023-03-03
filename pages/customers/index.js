import { Navbar } from "@/components/Navbar";
import {
  ActionIcon,
  Button,
  Flex,
  Modal,
  Text,
  Textarea,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { openConfirmModal } from "@mantine/modals";
import { showNotification } from "@mantine/notifications";
import { IconTrash, IconPencil, IconCheck, IconX } from "@tabler/icons";
import { IconTrashXFilled } from "@tabler/icons-react";
// import { IconTrashFilled } from "@tabler/icons-react";
import axios from "axios";
import { MantineReactTable } from "mantine-react-table";
import React, { useEffect, useMemo, useState } from "react";

const Customers = () => {
  const [opened, setOpened] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

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

  const getCustomer = async (id) => {
    const { data } = await axios
      .get(`http://localhost:3000/api/customer/${id}`)
      .catch((error) => {
        console.log(error);
      });
    form1.setValues(data.data);
  };
  useEffect(() => {
    if (editOpen) {
      getCustomer(editOpen);
    }
  }, [editOpen]);

  const columns = useMemo(
    () => [
      {
        accessorKey: "id",
        header: "ID",
        size: 10,
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
        header: "Comments",
      },
    ],
    []
  );

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

  const form1 = useForm({
    initialValues: {
      id: null,
      name: "",
      mobile: null,
      aadhar: null,
      address: "",
      surity: "",
      comments: "",
    },
    validate: {
      name: (value) => (value?.length > 8 ? null : "Enter full name"),
      mobile: (value) =>
        (value + "")?.length === 10 && !isNaN(value) ? null : "Invalid Mobile",
      aadhar: (value) =>
        (value + "")?.length === 12 ? null : "Invalid aadhar",
      address: (value) =>
        value?.length > 20 ? null : "Enter valid surity name",
      surity: (value) => (value?.length > 8 ? null : "Enter valid surity name"),
    },
  });

  const handleSubmit = async (values) => {
    axios
      .post(`http://localhost:3000/api/customer`, values)
      .then((response) => {
        showNotification({
          title: response.data.title,
          message: response.data.message,
          color: response.data.color,
          icon: <IconCheck />,
        });
        getCustomers();
      })
      .catch((error) => {
        console.log(error);
        showNotification({
          title: "Error",
          message: "Call Vishal - 7276718848",
          color: "red",
          icon: <IconX />,
        });
      })
      .finally(() => {
        setOpened(false);
      });
  };

  const handleUpdate = async (values) => {
    axios
      .put(`http://localhost:3000/api/customer/${values.id}`, values)
      .then((response) => {
        showNotification({
          title: response.data.title,
          message: response.data.message,
          color: response.data.color,
          icon: <IconCheck />,
        });
        getCustomers();
      })
      .catch((error) => {
        console.log(error);
        showNotification({
          title: "Error",
          message: "Call Vishal - 7276718848",
          color: "red",
          icon: <IconX />,
        });
      })
      .finally(() => {
        setEditOpen(false);
        form1.reset();
      });
  };

  const handleDelete = async (id) => {
    axios
      .delete(`http://localhost:3000/api/customer/${id}`)
      .then((response) => {
        showNotification({
          title: response.data.title,
          message: response.data.message,
          color: response.data.color,
          icon: <IconCheck />,
        });
        getCustomers();
      })
      .catch((error) => {
        console.log(error);
        showNotification({
          title: "Error",
          message: "Call Vishal - 7276718848",
          color: "red",
          icon: <IconX />,
        });
      });
  };

  const openModal = (row) =>
    openConfirmModal({
      title: "Are you sure ?",
      children: (
        <Text size="sm">
          You want to delete - <b>{row.original.name}</b>.
        </Text>
      ),
      labels: { confirm: "Yes, Delete", cancel: "Cancel" },
      confirmProps: { color: "red" },
      onCancel: () => {},
      onConfirm: () => handleDelete(row.original.id),
    });

  return (
    <>
      <Navbar />
      <MantineReactTable
        columns={columns}
        data={customers}
        initialState={{ density: "xs" }}
        enableRowActions
        positionActionsColumn="last"
        enableStickyHeader
        enablePagination={false}
        mantineTableContainerProps={{
          sx: {
            maxHeight: "70vh",
          },
        }}
        renderRowActions={({ row }) => (
          <Flex sx={{ whiteSpace: "nowrap" }}>
            <ActionIcon
              color="blue"
              onClick={() => setEditOpen(row.original.id)}
            >
              <IconPencil size="18" />
            </ActionIcon>
            <ActionIcon color="red" onClick={() => openModal(row)}>
              <IconTrashXFilled size="18" />
            </ActionIcon>
          </Flex>
        )}
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
        // mantineTableProps={{
        //   sx: {
        //     tableLayout: "fixed",
        //   },
        // }}
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
      <Modal
        opened={editOpen}
        onClose={() => {
          setEditOpen(false);
          form1.reset();
        }}
        title="Edit Customer"
      >
        <form onSubmit={form1.onSubmit((values) => handleUpdate(values))}>
          <TextInput
            withAsterisk
            label="ID"
            placeholder="Id"
            {...form1.getInputProps("id")}
            disabled
          />
          <TextInput
            withAsterisk
            label="Name"
            placeholder="Full Name"
            {...form1.getInputProps("name")}
          />
          <TextInput
            placeholder="Mobile"
            label="Mobile Number"
            withAsterisk
            {...form1.getInputProps("mobile")}
            maxLength="10"
          />
          <TextInput
            placeholder="Aadhar"
            label="Aadhar Number"
            withAsterisk
            maxLength="12"
            {...form1.getInputProps("aadhar")}
          />
          <TextInput
            placeholder="Address"
            label="Full Address"
            withAsterisk
            {...form1.getInputProps("address")}
          />
          <TextInput
            placeholder="Surity"
            label="Surity Name"
            withAsterisk
            {...form1.getInputProps("surity")}
          />
          <Textarea
            placeholder="Comments"
            label="Comments"
            {...form1.getInputProps("comments")}
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
