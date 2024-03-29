import { Navbar } from "@/components/Navbar";
import { ActionIcon, Button, LoadingOverlay, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { openConfirmModal } from "@mantine/modals";
import { showNotification } from "@mantine/notifications";
import { IconCheck, IconCirclePlus, IconX } from "@tabler/icons";
import { IconDownload, IconTrashFilled, IconTrashXFilled } from "@tabler/icons-react";
import axios from "axios";
import dayjs from "dayjs";
import exportFromJSON from "export-from-json";
import { MantineReactTable } from "mantine-react-table";
import React, { useEffect, useMemo, useState } from "react";

const Customers = () => {
  const [installments, setInstallments] = useState([]);
  const [visible, { toggle }] = useDisclosure(true);

  const getInstallments = async () => {
    const { data } = await axios.get(`/api/installment`).catch((error) => {
      console.log(error);
    });
    setInstallments(data.data);
    toggle();
  };

  useEffect(() => {
    getInstallments();
  }, []);

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
        getInstallments();
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

  const download = () => {
    const fileName = `Installments-${dayjs().format('DD-MM-YYYY HH-mm')}`
    const exportType =  exportFromJSON.types.csv
    exportFromJSON({ data:installments, fileName, exportType })
  }


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
      onConfirm: () => handleDelete(row.original.id),
    });

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
        enablePagination={true}
        mantineTableContainerProps={{
          sx: {
            maxHeight: "70vh",
          },
        }}
        renderRowActions={({ row }) => (
          <ActionIcon color="red" onClick={() => openModal(row)}>
            <IconTrashXFilled />
          </ActionIcon>
        )}
        renderTopToolbarCustomActions={() => (
          <>
            <Button variant="contained" color="teal" disabled>
              All Installments
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
    </>
  );
};

export default Customers;
