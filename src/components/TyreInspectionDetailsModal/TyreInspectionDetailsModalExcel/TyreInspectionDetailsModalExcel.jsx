import React, { useState } from "react";
import ExcelJS from "exceljs";
import { Button } from "@mui/joy";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/free-solid-svg-icons";

const TyreInspectionDetailsModalExcel = ({
  inspectionData,
  category,
  batchIdDataTyre,
}) => {
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
    const month = months[date.getUTCMonth()];
    const year = date.getUTCFullYear() % 100;
    return `${day}-${month}-${year}`;
  }

  const exportToExcelWithoutImages = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(`Tyre_branch`);

    // tyre

    worksheet.addRow([]);
    const newHeaderRow = worksheet.addRow([
      "Tyre Size",
      "Fresh",
      "RTD",
      "Total",
    ]);

    newHeaderRow.eachCell({ includeEmpty: false }, (cell, colNumber) => {
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFD966" },
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

    batchIdDataTyre?.forEach((item) => {
      const newRow = worksheet.addRow([
        item.tyre_size,
        item.Fresh,
        item.RTD,
        item.Fresh + item.RTD,
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

    const newRow = worksheet.addRow([
      "Total",
      batchIdDataTyre
        ?.map((type) => type.Fresh)
        .reduce((accumulator, currentValue) => accumulator + currentValue, 0),
      batchIdDataTyre
        ?.map((type) => type.RTD)
        .reduce((accumulator, currentValue) => accumulator + currentValue, 0),
      batchIdDataTyre?.reduce(
        (total, type) => total + type.Fresh + type.RTD,
        0
      ),
    ]);

    newRow.font = { bold: true };
    newRow.alignment = { horizontal: "center", vertical: "middle" };
    newRow.eachCell((cell, colNumber) => {
      const desiredWidth = Math.max(cell.value.toString().length, 10);
      const currentWidth = worksheet.getColumn(colNumber).width || 10;

      if (desiredWidth > currentWidth) {
        worksheet.getColumn(colNumber).width = desiredWidth;
      }
    });
    worksheet.getColumn(2).width = 20;

    // tyre

    worksheet.addRow([]);
    worksheet.addRow([]);
    let indexNo = 1;
    const headerRow = worksheet.addRow([
      "S.No",
      "Type Serial No",
      "Brand",
      "Size",
      "Model",
      "User Category",
      "Construction Type",
      "Product Category",
      "Tyre Amount",
      "Description",
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

    inspectionData.forEach((item) => {
      const newRow = worksheet.addRow([
        indexNo++,
        item.tyre_serial_number,
        item.tyre_brand_name,
        item.tyre_size,
        item.tyre_model_name,
        item.user_category_name,
        item.tyre_construction_type,
        item.product_category,
        item.supplier_name !== "Regrip"
          ? item.system_user_tyre_amount
          : item.user_tyre_price,
        item.tyre_description,
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
    link.download = `${inspectionData[0]?.supplier_brand_name}_${
      inspectionData[0]?.fleet_name
    }${category !== "" ? "_" + category : ""}${
      inspectionData.length > 0
        ? "_" + DateFormat(inspectionData[0]?.entrytime)
        : ""
    }.xlsx`;
    document.body.appendChild(link);
    link.click();

    URL.revokeObjectURL(blobUrl);
  };

  return (
    <Button className="apply-button" onClick={exportToExcelWithoutImages}>
      <p>
        {" "}
        Download Tyre{" "}
        <FontAwesomeIcon style={{ height: 15 }} icon={faDownload} />
      </p>
    </Button>
  );
};

export default TyreInspectionDetailsModalExcel;
