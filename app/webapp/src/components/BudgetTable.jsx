import React, { useEffect, useState, useRef } from 'react';
import {
  AnalyticalTable,
  Toast,
  ToolbarV2,
  ToolbarButton
} from "@ui5/webcomponents-react";
import OrderDialog from "./OrderDialog"
export default function OrderTable() {
  const [toastTextState, setToastTextState] = useState("")
  const toast = useRef();
  const [rows, setRows] = useState([]);
  const [orderCreationDialogState, setOrderCreationDialogState] = useState(false)
  useEffect(() => {
    fetchOrders();
  }, []);
  const onNewOrderClick = () => {
    setOrderCreationDialogState(true)
  };
  async function fetchOrders() {
    try {
      const response = await fetch("/odata/v4/sales/Orders");
      const products = await response.json();
      setRows(products.value);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }
  const columns = [
    {
      Header: "Title",
      accessor: "title",
    },
    {
      Header: "Customer",
      accessor: "soldTo_email",
    }
  ]
  return (
    <>
        <ToolbarV2>
            <ToolbarButton text="Create" onClick={onNewOrderClick}/>
        </ToolbarV2>
        <AnalyticalTable
          infiniteScroll="true"
          infiniteScrollThreshold="10"
          minRows="10"
          sortable="true"
          filterable="true"
          visibleRows="10"
          columns={columns}
          data={rows}
        />
        <OrderDialog
          orderCreationDialogState={orderCreationDialogState}
          setOrderCreationDialogState={setOrderCreationDialogState}
          fetchOrders={fetchOrders}
          toast={toast}
          setToastTextState={setToastTextState}
        />
        <Toast ref={toast}>
                {toastTextState}
        </Toast>
    </>
  );
}
