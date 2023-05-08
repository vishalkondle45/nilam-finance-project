import { Navbar } from "@/components/Navbar";
import {
  ActionIcon,
  Button,
  Flex,
  LoadingOverlay,
  Modal,
  NumberInput,
  Text,
  Textarea,
  TextInput,
} from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { openConfirmModal } from "@mantine/modals";
import { showNotification } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons";
import { IconDownload, IconTrashXFilled } from "@tabler/icons-react";
import axios from "axios";
import dayjs from "dayjs";
import exportFromJSON from "export-from-json";
import { MantineReactTable } from "mantine-react-table";
import { useRouter } from "next/router";
import React, { useEffect, useMemo, useState } from "react";

const Customers = () => {
  const [visible, { toggle }] = useDisclosure(true);
  const form = useForm({
    initialValues: {
      customer: "",
      loan: null,
      installment: null,
      interest: 0,
      fine: 0,
      dueDate: new Date(),
      paidDate: new Date(),
      comments: "",
      nextDue: null,
    },
    validate: {
      customer: (value) => (value ? null : "Select customer"),
    },
  });

  const router = useRouter();
  const { id } = router.query;

  const [opened, setOpened] = useState(false);

  const [installments, setInstallments] = useState([]);
  const [loan, setLoan] = useState(null);

  const columns = useMemo(
    () => [
      {
        accessorKey: "id",
        header: "ID",
        size: 10,
      },
      {
        accessorKey: "loan",
        header: "Loan ID",
        size: 10,
      },
      {
        accessorKey: "customer",
        header: "Customer Name",
        size: 10,
      },
      {
        accessorKey: "installment",
        header: "Installment",
        size: 10,
      },
      {
        accessorKey: "interest",
        header: "Interest",
        size: 10,
      },
      {
        accessorKey: "fine",
        header: "Fine",
        size: 10,
      },
      {
        accessorKey: "dueDate",
        header: "Due Date",
        size: 10,
        Cell: ({ cell }) => dayjs(cell.getValue()).format("DD-MM-YYYY"),
      },
      {
        accessorKey: "paidDate",
        header: "Paid Date",
        size: 10,
        Cell: ({ cell }) => dayjs(cell.getValue()).format("DD-MM-YYYY"),
      },
      {
        accessorKey: "comments",
        header: "Comments",
        size: 10,
      },
    ],
    []
  );

  const handleSubmit = async (values) => {
    await axios
      .post(`/api/installment`, values)
      .then((response) => {
        showNotification({
          title: response.data.title,
          message: response.data.message,
          color: response.data.color,
          icon: <IconCheck />,
        });
        getInstallments(values.loan);
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

  const handleDelete = async (iid, id) => {
    axios
      .delete(`/api/installments/${iid}`)
      .then((response) => {
        showNotification({
          title: response.data.title,
          message: response.data.message,
          color: response.data.color,
          icon: <IconCheck />,
        });
        getInstallments(id);
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
      onCancel: () => console.log(row.original),
      onConfirm: () => handleDelete(row.original.id, row.original.loan),
    });

  const getLoan = async (lid) => {
    const { data } = await axios.get(`/api/loan/${lid}`).catch((error) => {
      console.log(error);
    });
    if (!data.data) {
      showNotification({
        title: "Invalid Loan ID",
        message: "Please check the Loan ID...",
        icon: <IconX />,
        color: "red",
        autoClose: 5000,
      });
      router.push("/installments");
    } else {
      setLoan(data.data);
      const { customer, id: loan, installment, nextDue } = data.data;
      form.setValues({
        customer,
        loan,
        installment,
        dueDate: new Date(nextDue),
      });
    }
  };

  const getInstallments = async (id) => {
    if (id) {
      const { data } = await axios
        .get(`/api/installments/${id}`)
        .catch((error) => {
          console.log(error);
        });
      setInstallments(data.data);
    }
  };

  useEffect(() => {
    if (id) {
      getLoan(id);
      getInstallments(id);
      toggle();
    }
  }, [id]);

  const download = () => {
    const fileName = `${router.query.id}-installments-${dayjs().format(
      "DD-MM-YYYY HH-mm"
    )}`;
    const exportType = exportFromJSON.types.csv;
    exportFromJSON({ data: installments, fileName, exportType });
  };

  return (
    <>
      <Navbar />
      <LoadingOverlay visible={visible} overlayBlur={2} />
      <MantineReactTable
        columns={columns}
        data={installments}
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
            <ActionIcon color="red" onClick={() => openModal(row)}>
              <IconTrashXFilled />
            </ActionIcon>
          </Flex>
        )}
        renderTopToolbarCustomActions={() => (
          <>
            <Button
              variant="contained"
              color="teal"
              onClick={() => setOpened(true)}
              disabled={installments.length === loan?.count}
            >
              New Installment
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
      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title="New Installment"
      >
        <form onSubmit={form.onSubmit((values) => handleSubmit(values))}>
          <NumberInput
            withAsterisk
            label="Loan ID"
            placeholder="Loan ID"
            step={500}
            {...form.getInputProps("loan")}
            disabled
          />
          <TextInput
            withAsterisk
            label="Customer"
            placeholder="Customer"
            {...form.getInputProps("customer")}
            disabled
          />
          <Flex gap="xs">
            <NumberInput
              withAsterisk
              label="Loan Amount"
              placeholder="Loan Amount"
              step={500}
              value={loan?.loanAmount}
              disabled
            />
            <NumberInput
              withAsterisk
              label="Installment"
              placeholder="Installment"
              step={100}
              min={100}
              {...form.getInputProps("installment")}
              disabled
            />
          </Flex>
          <Flex gap="xs">
            <NumberInput
              withAsterisk
              label="Interest"
              placeholder="Interest"
              step={5}
              min={0}
              {...form.getInputProps("interest")}
            />
            <NumberInput
              withAsterisk
              label="Fine"
              placeholder="Fine"
              step={5}
              min={0}
              {...form.getInputProps("fine")}
            />
          </Flex>
          <Flex gap="xs">
            <DatePicker
              placeholder="Due Date"
              label="Due Date"
              withAsterisk
              {...form.getInputProps("dueDate")}
            />
            <DatePicker
              placeholder="Paid Date"
              label="Paid Date"
              withAsterisk
              {...form.getInputProps("paidDate")}
            />
          </Flex>
          <DatePicker
            placeholder="Next Due"
            label="Next Due (Optional)"
            {...form.getInputProps("nextDue")}
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
