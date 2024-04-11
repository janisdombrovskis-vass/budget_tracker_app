import React, { useState, useEffect } from "react";
import {
    Form,
    FormItem,
    Input,
    Dialog,
    Bar,
    Button,
    ComboBox,
    ComboBoxItem
} from "@ui5/webcomponents-react";
import "@ui5/webcomponents/dist/features/InputElementsFormSupport.js";
export default function TransactionDialog({ orderCreationDialogState, setOrderCreationDialogState, fetchOrders, toast, setToastTextState }) {
    const initalOrderCreationFormData = {
        title: "",
        soldTo_email: ""
    }
    const [orderCreationFormDataState, setOrderCreationFormDataState] = useState(initalOrderCreationFormData)
    const [customerSelectionState, setCustomersSelectionState] = useState([]);
    useEffect(() => {
        setCustomers();
        setOrderCreationFormDataState(initalOrderCreationFormData)
      }, [orderCreationDialogState]);
    async function setCustomers() {
        try {
            const response = await fetch("/odata/v4/sales/Customers");
            if (!response.ok) {
                throw new Error("Failed to fetch customers");
            }
            const customers = await response.json();
            console.log(customers)
            setCustomersSelectionState(customers.value);
            console.log(customerSelectionState);
        } catch (error) {
            console.error(error);
        }
    }
    async function handleInputChanges(key, value) {
        let newState = orderCreationFormDataState
        newState[key] = value
        setOrderCreationFormDataState(newState);
    }
    async function onSaveClick() {
        if(!orderCreationFormDataState.title){
            setToastTextState("Please enter a tile")
            toast.current.show();
            return;
        }
        const response = await addTransaction();
        if(!response.ok){
            console.log(response)
            setToastTextState("Order creation failed")
            toast.current.show();
            return;
        }
        setOrderCreationDialogState(false);
        setToastTextState("Order created")
        toast.current.show();
        fetchOrders();
    }
    async function addTransaction() {
        const response = await fetch("/odata/v4/sales/Orders",{
            method: "post",
            body: JSON.stringify({
                title: orderCreationFormDataState.title,
                soldTo_email : orderCreationFormDataState.soldTo_email
            }),
            headers: {
                "Content-type": "application/json"
            }
        })
        return response
    }
    return (
        <Dialog
            headerText="Create New Order"
            resizable="true"
            open={orderCreationDialogState}
            onAfterClose={() => {
                setOrderCreationDialogState(false);
            }}
            footer={
                <Bar
                    endContent={
                        <>
                            <Button
                                icon="sys-cancel"
                                onClick={() => {
                                    setOrderCreationDialogState(false);
                                }}
                            >
                                Cancel
                            </Button>
                            <Button icon="save" onClick={onSaveClick}>
                                Save
                            </Button>
                        </>
                    }
                />
            }
        >
            <Form>
                <FormItem label="Title">
                    <Input
                        required="true"
                        value={orderCreationFormDataState.title}
                        onInput={(event) => handleInputChanges("title", event.target.value)}
                    />
                </FormItem>
                <FormItem label="Customer">
                    <ComboBox
                        value={orderCreationFormDataState.soldTo_email}
                        onSelectionChange={(event) => handleInputChanges("soldTo_email", event.target.value)}
                    >
                        {customerSelectionState.map((item) => (
                            <ComboBoxItem text={item.email} key={item.email} />
                        ))}
                    </ComboBox>
                </FormItem>
            </Form>
        </Dialog>
    )
}
