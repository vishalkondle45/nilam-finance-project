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
import { DatePicker } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { openConfirmModal } from "@mantine/modals";
import { showNotification } from "@mantine/notifications";
import { IconPencil, IconCheck, IconX, IconCirclePlus } from "@tabler/icons";
import { IconDownload, IconTrashXFilled } from "@tabler/icons-react";
import axios from "axios";
import dayjs from "dayjs";
import exportFromJSON from "export-from-json";
import { MantineReactTable } from "mantine-react-table";
import { useRouter } from "next/router";
import React, { useEffect, useMemo, useState } from "react";

const Customers = () => {
  const router = useRouter();

  const form = useForm({
    initialValues: {
      customer: "",
      loanAmount: 0,
      charges: 0,
      installment: 100,
      interest:0,
      count: 10,
      date: new Date(),
      nextDue: new Date(),
      comments: "",
      group: "",
    },
    validate: {
      customer: (value) => (value ? null : "Select customer"),
    },
  });

  const [opened, setOpened] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  const [customers, setCustomers] = useState([]);
  const [loans, setLoans] = useState([]);

  const getLoans = async () => {
    const { data } = await axios.get(`/api/loan`).catch((error) => {
      console.log(error);
    });
    setLoans(data.data);
  };
  const getCustomers = async () => {
    const { data } = await axios
      .get(`/api/customer/customers`)
      .catch((error) => {
        console.log(error);
      });
    setCustomers(data.data);
  };
  useEffect(() => {
    getLoans();
    getCustomers();
  }, []);

  const getLoan = async (id) => {
    const { data } = await axios.get(`/api/loan/${id}`).catch((error) => {
      console.log(error);
    });
    form1.setValues({
      ...data.data,
      date: new Date(data.data.date),
      nextDue: new Date(data.data.nextDue),
    });
  };

  useEffect(() => {
    if (editOpen) {
      getLoan(editOpen);
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
        accessorKey: "customer",
        header: "Customer Name",
        size: 10,
      },
      {
        accessorKey: "loanAmount",
        header: "Loan Amount",
        size: 10,
      },
      {
        accessorKey: "interest",
        header: "Interest",
        size: 10,
      },
      {
        accessorKey: "installment",
        header: "Installment",
        size: 10,
      },
      {
        accessorKey: "charges",
        header: "Charges",
        size: 10,
      },
      {
        accessorKey: "count",
        header: "Count",
        size: 10,
      },
      {
        accessorKey: "date",
        header: "Starting Date",
        size: 10,
        Cell: ({ cell }) => dayjs(cell.getValue()).format("DD-MM-YYYY"),
      },
      {
        accessorKey: "nextDue",
        header: "Next Due",
        size: 10,
        Cell: ({ cell }) => dayjs(cell.getValue()).format("DD-MM-YYYY"),
      },
      {
        accessorKey: "comments",
        header: "Comments",
        size: 10,
      },
      {
        accessorKey: "group",
        header: "Group",
        size: 10,
      },
    ],
    []
  );

  const form1 = useForm({
    initialValues: {
      id: null,
      customer: "",
      loanAmount: 0,
      charges: 0,
      installment: 100,
      count: 10,
      interest: 0,
      date: new Date(),
      nextDue: new Date(),
      comments: "",
      group: "",
    },
    validate: {
      customer: (value) => (value ? null : "Select customer"),
    },
  });

  const handleSubmit = async (values) => {
    axios
      .post(`/api/loan`, values)
      .then((response) => {
        showNotification({
          title: response.data.title,
          message: response.data.message,
          color: response.data.color,
          icon: <IconCheck />,
        });
        getLoans();
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
      .put(`/api/loan/${values.id}`, values)
      .then((response) => {
        showNotification({
          title: response.data.title,
          message: response.data.message,
          color: response.data.color,
          icon: <IconCheck />,
        });
        getLoans();
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
      .delete(`/api/loan/${id}`)
      .then((response) => {
        showNotification({
          title: response.data.title,
          message: response.data.message,
          color: response.data.color,
          icon: <IconCheck />,
        });
        getLoans();
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

  const [groups, setGroups] = useState([]);
  const getGroups = async () => {
    const { data } = await axios.get(`/api/group/getAll`).catch((error) => {
      console.log(error);
    });
    setGroups(data.data);
  };
  useEffect(() => {
    getGroups();
  }, []);

  const download = () => {
    const fileName = `Loans-${dayjs().format('DD-MM-YYYY HH-mm')}`
    const exportType =  exportFromJSON.types.csv
    exportFromJSON({ data:loans, fileName, exportType })
  }


  return (
    <>
      <Navbar />
      <MantineReactTable
        columns={columns}
        data={loans}
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
              color="green"
              onClick={() => router.push(`installments/${row.original.id}`)}
            >
              <IconCirclePlus size="18" />
            </ActionIcon>
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
              New Loan
            </Button>
            <Button
              variant="contained"
              color="dark"
              onClick={download}
              leftIcon={<IconDownload />}
            >
              Download
            </Button>
          </>
        )}
      />
      <Modal opened={opened} onClose={() => setOpened(false)} title="New Loan">
        <form onSubmit={form.onSubmit((values) => handleSubmit(values))}>
          <Select
            withAsterisk
            label="Select Customer"
            placeholder="Customers"
            searchable
            nothingFound="No Customers"
            data={customers}
            {...form.getInputProps("customer")}
          />
          <NumberInput
            withAsterisk
            label="Loan Amount"
            placeholder="Loan Amount"
            step={500}
            {...form.getInputProps("loanAmount")}
          />
          <NumberInput
            withAsterisk
            label="Interest Amount"
            placeholder="Interest Amount"
            step={5}
            {...form.getInputProps("interest")}
          />
          <NumberInput
            withAsterisk
            label="Extra Charges"
            placeholder="Extra Charges"
            step={500}
            {...form.getInputProps("charges")}
          />
          <NumberInput
            withAsterisk
            label="Installment"
            placeholder="Installment"
            step={100}
            min={100}
            {...form.getInputProps("installment")}
          />
          <Select
            placeholder="Installments Count"
            label="Installments Count"
            withAsterisk
            min="10"
            searchable
            data={[
              { label: "10", value: 10 },
              { label: "52", value: 52 },
              { label: "100", value: 100 },
              { label: "12", value: 12 },
              { label: "20", value: 20 },
              { label: "17", value: 17 },
            ]}
            {...form.getInputProps("count")}
          />
          <DatePicker
            placeholder="Starting Date"
            label="Starting Date"
            withAsterisk
            {...form.getInputProps("date")}
          />
          <DatePicker
            placeholder="Next Due"
            label="Next Due"
            withAsterisk
            {...form.getInputProps("nextDue")}
          />
          <Textarea
            placeholder="Comments"
            label="Comments"
            {...form.getInputProps("comments")}
          />
          <Select
            withAsterisk
            label="Select Group"
            placeholder="Group"
            searchable
            nothingFound="No Groups"
            data={groups}
            {...form.getInputProps("group")}
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
          <Select
            withAsterisk
            label="Select Customer"
            placeholder="Customers"
            searchable
            nothingFound="No Customers"
            data={customers}
            {...form1.getInputProps("customer")}
          />
          <NumberInput
            withAsterisk
            label="Loan Amount"
            placeholder="Loan Amount"
            step={500}
            {...form1.getInputProps("loanAmount")}
          />
          <NumberInput
            withAsterisk
            label="Interest Amount"
            placeholder="Interest Amount"
            step={5}
            {...form1.getInputProps("interest")}
          />
          <NumberInput
            withAsterisk
            label="Extra Charges"
            placeholder="Extra Charges"
            step={500}
            {...form1.getInputProps("charges")}
          />
          <NumberInput
            withAsterisk
            label="Installment"
            placeholder="Installment"
            step={100}
            min={100}
            {...form1.getInputProps("installment")}
          />
          <Select
            placeholder="Installments Count"
            label="Installments Count"
            withAsterisk
            min="10"
            searchable
            data={[
              { label: "10", value: 10 },
              { label: "52", value: 52 },
              { label: "100", value: 100 },
              { label: "12", value: 12 },
              { label: "20", value: 20 },
              { label: "17", value: 17 },
            ]}
            {...form1.getInputProps("count")}
          />
          <DatePicker
            placeholder="Starting Date"
            label="Starting Date"
            withAsterisk
            {...form1.getInputProps("date")}
          />
          <DatePicker
            placeholder="Next Due"
            label="Next Due"
            withAsterisk
            {...form1.getInputProps("nextDue")}
          />
          <Textarea
            placeholder="Comments"
            label="Comments"
            {...form1.getInputProps("comments")}
          />
          <Select
            withAsterisk
            label="Select Group"
            placeholder="Group"
            searchable
            nothingFound="No Groups"
            data={groups}
            {...form1.getInputProps("group")}
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
