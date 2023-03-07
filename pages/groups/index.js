import { Navbar } from "@/components/Navbar";
import {
  ActionIcon,
  Button,
  Flex,
  Modal,
  NumberInput,
  Select,
  Text,
  Textarea,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { openConfirmModal } from "@mantine/modals";
import { showNotification } from "@mantine/notifications";
import { IconPencil, IconCheck, IconX } from "@tabler/icons";
import { IconTrashXFilled } from "@tabler/icons-react";
import axios from "axios";
import dayjs from "dayjs";
import { MantineReactTable } from "mantine-react-table";
import React, { useEffect, useMemo, useState } from "react";

const Customers = () => {
  const form = useForm({
    initialValues: {
      name: "",
      comments: "",
    },
    validate: {
      name: (value) => (value ? null : "Enter Name"),
    },
  });

  const [opened, setOpened] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  const [groups, setGroups] = useState([]);

  const getGroups = async () => {
    const { data } = await axios.get(`/api/group`).catch((error) => {
      console.log(error);
    });
    setGroups(data.data);
  };
  useEffect(() => {
    getGroups();
  }, []);

  const getGroup = async (id) => {
    const { data } = await axios.get(`/api/group/${id}`).catch((error) => {
      console.log(error);
    });
    form1.setValues(data.data);
  };

  useEffect(() => {
    if (editOpen) {
      getGroup(editOpen);
    }
  }, [editOpen]);

  const columns = useMemo(
    () => [
      {
        accessorKey: "id",
        header: "ID",
      },
      {
        accessorKey: "name",
        header: "Group Name",
      },
      {
        accessorKey: "comments",
        header: "Comments",
      },
      {
        accessorKey: "createdAt",
        header: "Created At",
        Cell: ({ cell }) => dayjs(cell.getValue()).format("DD-MM-YYYY"),
      },
      {
        accessorKey: "updatedAt",
        header: "Updated At",
        Cell: ({ cell }) => dayjs(cell.getValue()).format("DD-MM-YYYY"),
      },
    ],
    []
  );

  const form1 = useForm({
    initialValues: {
      id: null,
      name: "",
      comments: "",
    },
    validate: {
      name: (value) => (value ? null : "Enter Group Name"),
    },
  });

  const handleSubmit = async (values) => {
    axios
      .post(`/api/group`, values)
      .then((response) => {
        showNotification({
          title: response.data.title,
          message: response.data.message,
          color: response.data.color,
          icon: <IconCheck />,
        });
        getGroups();
        setOpened(false);
        form.reset();
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

  const handleUpdate = async (values) => {
    axios
      .put(`/api/group/${values.id}`, values)
      .then((response) => {
        showNotification({
          title: response.data.title,
          message: response.data.message,
          color: response.data.color,
          icon: <IconCheck />,
        });
        getGroups();
        setEditOpen(false);
        form1.reset();
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

  const handleDelete = async (id) => {
    axios
      .delete(`/api/group/${id}`)
      .then((response) => {
        showNotification({
          title: response.data.title,
          message: response.data.message,
          color: response.data.color,
          icon: <IconCheck />,
        });
        getGroups();
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
          You want to delete - <b>{row.original.id}</b>.
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
        data={groups}
        initialState={{ density: "xs" }}
        enableRowActions
        positionActionsColumn="last"
        enableStickyHeader
        enablePagination={true}
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
              New Group
            </Button>
          </>
        )}
      />
      <Modal
        opened={opened}
        onClose={() => {
          setOpened(false);
          form.reset();
        }}
        title="New Group"
      >
        <form onSubmit={form.onSubmit((values) => handleSubmit(values))}>
          <TextInput
            withAsterisk
            label="Name"
            placeholder="Name"
            {...form.getInputProps("name")}
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
        title="Edit Loan"
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
            placeholder="Name"
            {...form1.getInputProps("name")}
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
