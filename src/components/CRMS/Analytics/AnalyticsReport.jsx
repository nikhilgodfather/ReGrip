import React, { useState, useEffect } from "react";
import ExcelJS from "exceljs";
// import ExcelTable from "mr-excel";
// import { saveAs } from 'file-saver';
// import { Buffer } from 'buffer';
import { useDispatch, useSelector } from "react-redux";
// import { REGRIP_ROLE_ID } from "../../../redux/constants/Constant";
// import { JK_ROLE_ID } from "../../../redux/constants/Constant";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/free-solid-svg-icons";
import { Button } from "@mui/joy";

const AnalyticsReportExcel = ({
  startDate,
  endDate,
  analyticsTitle,
  analyticsDataKey,
  runSpecificApi,
}) => {
  let modifiedTitle = analyticsTitle;

  if (analyticsTitle.includes(">")) {
    modifiedTitle = analyticsTitle.replace(">", "greater-than-");
  } else if (analyticsTitle.includes("<")) {
    modifiedTitle = analyticsTitle.replace("<", "less-than-");
  }

  const exportToExcelWithoutImages = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Sheet1");

    let indexNo = 1;
    const newHeaderRow = worksheet.addRow([
      "S No",
      "Lead ID",
      "Lead history ID",
      "Date",
      "Visit Type",
      "Lead Assigned To",
      "Lead Assigned By",
      "Customer",
      "Customer Branch",
      "Meeting Person	",
      "Meeting Person Designation",
      "Agenda Of Meeting",
      "Lead Status",
      "Conversation",
      runSpecificApi === "acheivement-data" && "Order ID",
      runSpecificApi === "acheivement-data" && "Ordered Data",
      "Product Category",
      "Check In",
      "Meeting Time",
      "Next Meeting Date",
    ]);

    newHeaderRow.eachCell({ includeEmpty: false }, (cell, colNumber) => {
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "c0ced4" },
      };
      cell.border = {
        top: { style: "thin", color: { argb: "000000" } },
        left: { style: "thin", color: { argb: "000000" } },
        bottom: { style: "thin", color: { argb: "000000" } },
        right: { style: "thin", color: { argb: "000000" } },
      };
    });

    newHeaderRow.font = { bold: true };
    newHeaderRow.alignment = { horizontal: "center", vertical: "middle" };
    newHeaderRow.eachCell((cell, colNumber) => {
      const desiredWidth = Math.max(cell.value.toString().length, 15);
      const currentWidth = worksheet.getColumn(colNumber).width || 10;

      if (desiredWidth > currentWidth) {
        worksheet.getColumn(colNumber).width = desiredWidth;
      }
    });

    analyticsDataKey?.forEach((item) => {
      const newRow = worksheet.addRow([
        indexNo++,
        item.lead_id,
        item.lead_history_id,
        item.meeting_time
          ? new Date(item.meeting_time).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            })
          : null,
        item.visit_type,
        item.sales_person_name,
        item.assigned_by_employee_name,
        item.customer_name,
        item.customer_branch_name,
        item.meeting_person_name,
        item.meeting_person_designation,
        item.agenda_of_meeting,
        item.lead_status,
        item.conversation,
        runSpecificApi === "acheivement-data" && item?.order_id,
        runSpecificApi === "acheivement-data" &&
          item?.order_data
            ?.filter((order) => order?.SKU)
            ?.map((order) => `${order?.SKU}: ${order?.Quantity}`)
            .join(", "),
        item.product_category
          ? item?.product_category
              ?.filter((category) => category?.is_interested === true)
              ?.map((category) => category?.name)
              .join(", ")
          : "",
        item.check_in_time
          ? new Date(item.check_in_time).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })
          : null,
        item.meeting_time
          ? new Date(item.meeting_time).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })
          : null,
        item.next_meeting_date
          ? new Date(item.next_meeting_date).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            })
          : null,
      ]);
      newRow.alignment = { horizontal: "center", vertical: "middle" };
      newRow.eachCell((cell, colNumber) => {
        const desiredWidth = Math.max(cell.value.toString().length, 10);
        const currentWidth = worksheet.getColumn(colNumber).width || 10;

        if (desiredWidth > currentWidth) {
          worksheet.getColumn(colNumber).width = desiredWidth;
        }
      });
    });
    worksheet.getColumn(2).width = 20;

    const blob = await workbook.xlsx.writeBuffer();
    const blobUrl = URL.createObjectURL(
      new Blob([blob], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      })
    );

    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = `${startDate}_${endDate}/${modifiedTitle}`;

    document.body.appendChild(link);
    link.click();

    URL.revokeObjectURL(blobUrl);
  };

  return (
    <p onClick={exportToExcelWithoutImages}>
      <span
        style={{
          display: "flex",
          justifyContent: "space-between",
          color: "#39532f",
          width: "100%",
          cursor: "pointer",
        }}
      >
        {/* <span> Without Images </span>{" "} */}
        <Button className="apply-button">
          <p>
            {" "}
            <FontAwesomeIcon style={{ height: 20 }} icon={faDownload} />
          </p>
        </Button>
      </span>
    </p>
  );
};

export default AnalyticsReportExcel;
