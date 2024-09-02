import React from "react";
import "./Orders.css";
import { Table } from "@mui/joy";
const Orders = ({ orderData }) => {
  return (
    <div className="lead-details">
      <div className="main-container-lead">
        <div className="detail">
          <span>Customer</span>
          {orderData.customer_name ? (
            orderData.customer_name
          ) : (
            <span>--/--</span>
          )}{" "}
          - {orderData.branch}
        </div>

        <div className="detail">
          <span>Sales Person</span>
          {orderData.sales_person_name ? (
            orderData.sales_person_name
          ) : (
            <span>--/--</span>
          )}
        </div>
        <div className="detail">
          <span>Meeting Person</span>
          {orderData.meeting_person_name ? (
            orderData.meeting_person_name
          ) : (
            <span>--/--</span>
          )}
          , {orderData.meeting_person_designation}
        </div>
        <div className="detail">
          <span>Date</span>
          {new Date(orderData.created_at).toLocaleDateString("en-IN")}
        </div>
      </div>

      <div className="line"></div>
      <div className="main-container-lead-2">
        <div className="detail">
          <span>Order Data</span>

          <Table
            aria-label="basic table"
            style={{
              marginTop: 10,
              border: "1px solid #E4E9FF",
              padding: "10px",
            }}
          >
            <thead>
              <tr className="">
                <th>Tyre SKU</th>
                <th>Tyre Quantity</th>
              </tr>
            </thead>
            <tbody>
              {/* {orderData?.order_data?.map((item, index) => (
                <tr key={index} className="">
                  <td>{item.SKU}</td>
                  <td>{item.Quantity}</td>
                </tr>
              ))} */}

              {orderData?.order_data?.map(
                (item, index) =>
                  Object?.keys(item)?.length !== 0 && (
                    <tr key={index} className="">
                      <td>{item?.SKU}</td>
                      <td>{item?.Quantity}</td>
                    </tr>
                  )
              )}
            </tbody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default Orders;
