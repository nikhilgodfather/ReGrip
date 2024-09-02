import React, { useState } from "react";
import ExcelJS from "exceljs";
import { Button } from "@mui/joy";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/free-solid-svg-icons";

const TyreClaimsExcel = ({ tyreClaims, category, batchIdDataTyre }) => {
  // console.log(DateFormat())

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  function DateFormat(inputDateTime) {
    const date = new Date(inputDateTime);
    const day = date.getUTCDate();
    const month = date.getUTCMonth()+1;
    const year = date.getUTCFullYear();
    return `${day}/${month}/${year}`;
  }

  const exportToExcelWithoutImages = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(`Tyre_branch`);

    // tyre

    // worksheet.addRow([]);
    // const newHeaderRow = worksheet.addRow([
    //   "Tyre Size",
    //   "Fresh",
    //   "RTD",
    //   "Total",
    // ]);

    // newHeaderRow.eachCell({ includeEmpty: false }, (cell, colNumber) => {
    //   cell.fill = {
    //     type: "pattern",
    //     pattern: "solid",
    //     fgColor: { argb: "FFD966" },
    //   };
    //   cell.border = {
    //     top: { style: "thin", color: { argb: "000000" } },
    //     left: { style: "thin", color: { argb: "000000" } },
    //     bottom: { style: "thin", color: { argb: "000000" } },
    //     right: { style: "thin", color: { argb: "000000" } },
    //   };
    // });

    // newHeaderRow.font = { bold: true };
    // newHeaderRow.alignment = { horizontal: "center", vertical: "middle" };
    // newHeaderRow.eachCell((cell, colNumber) => {
    //   const desiredWidth = Math.max(cell.value.toString().length, 15);
    //   const currentWidth = worksheet.getColumn(colNumber).width || 10;

    //   if (desiredWidth > currentWidth) {
    //     worksheet.getColumn(colNumber).width = desiredWidth;
    //   }
    // });

    // batchIdDataTyre?.forEach((item) => {
    //   const newRow = worksheet.addRow([
    //     item.tyre_size,
    //     item.Fresh,
    //     item.RTD,
    //     item.Fresh + item.RTD,
    //   ]);

    //   newRow.alignment = { horizontal: "center", vertical: "middle" };
    //   newRow.eachCell((cell, colNumber) => {
    //     const desiredWidth = Math.max(cell.value.toString().length, 10);
    //     const currentWidth = worksheet.getColumn(colNumber).width || 10;

    //     if (desiredWidth > currentWidth) {
    //       worksheet.getColumn(colNumber).width = desiredWidth;
    //     }
    //   });
    // });
    // worksheet.getColumn(2).width = 20;

    // const newRow = worksheet.addRow([
    //   "Total",
    //   batchIdDataTyre
    //     ?.map((type) => type.Fresh)
    //     .reduce((accumulator, currentValue) => accumulator + currentValue, 0),
    //   batchIdDataTyre
    //     ?.map((type) => type.RTD)
    //     .reduce((accumulator, currentValue) => accumulator + currentValue, 0),
    //   batchIdDataTyre?.reduce(
    //     (total, type) => total + type.Fresh + type.RTD,
    //     0
    //   ),
    // ]);

    // newRow.font = { bold: true };
    // newRow.alignment = { horizontal: "center", vertical: "middle" };
    // newRow.eachCell((cell, colNumber) => {
    //   const desiredWidth = Math.max(cell.value.toString().length, 10);
    //   const currentWidth = worksheet.getColumn(colNumber).width || 10;

    //   if (desiredWidth > currentWidth) {
    //     worksheet.getColumn(colNumber).width = desiredWidth;
    //   }
    // });
    // worksheet.getColumn(2).width = 20;

    // tyre

    worksheet.addRow([]);
    worksheet.addRow([]);
    let indexNo = 1;
    const headerRow = worksheet.addRow([
      "S.No",
      "Type Serial No",
      "Invoive No",
      "Invoive Date",
      "Current NSD",
      "Standard NSD",
      "Brand",
      "Size",
      "Model",
      "Description",
      "Retreader Status",
      "Status",
    ]);

    headerRow.eachCell((cell) => {
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
      cell.alignment = { horizontal: "center", vertical: "middle" };
      cell.font = { bold: true };
    });
    worksheet.columns.forEach((column) => {
      column.width = 25;
    });

    tyreClaims.forEach((item) => {
      const newRow = worksheet.addRow([
        indexNo++,
        item.tyre_serial_number,
        item.invoice_no,
        item.invoice_date ? DateFormat(item.invoice_date) : "",
        item.current_nsd,
        item.standard_nsd,
        item.tyre_brand_name,
        item.tyre_size,
        item.tyre_model_name,
        item.claim_description,
        item.claim_remark ? item.claim_remark : "Remark Pending",
        item.claim_status == "initiate" ? "Status Pending" : item.claim_status,
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

    const blob = await workbook.xlsx.writeBuffer();
    const blobUrl = URL.createObjectURL(
      new Blob([blob], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      })
    );

    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = `TyreCLaims.xlsx`;
    document.body.appendChild(link);
    link.click();

    URL.revokeObjectURL(blobUrl);
  };

  return (
    <Button className="apply-button" onClick={exportToExcelWithoutImages}>
      <p>
        {" "}
        Download Excel{" "}
        <FontAwesomeIcon style={{ height: 15 }} icon={faDownload} />
      </p>
    </Button>
  );
};

export default TyreClaimsExcel;
