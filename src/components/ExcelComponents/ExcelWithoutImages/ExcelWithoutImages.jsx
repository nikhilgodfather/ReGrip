import React, { useState, useEffect } from "react";
import ExcelJS from "exceljs";
// import ExcelTable from "mr-excel";
// import { saveAs } from 'file-saver';
// import { Buffer } from 'buffer';
import { useDispatch, useSelector } from "react-redux";
import { REGRIP_ROLE_ID } from "../../../redux/constants/Constant";
import { JK_ROLE_ID } from "../../../redux/constants/Constant";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/free-solid-svg-icons";

const ExcelWithoutImages = ({
  excelData,
  cmp,
  batchId,
  inspectionDate,
  fleetName,
  fleetBranch,
  fleetLocation,
  s_name,
  amountData,
  batchIdDataTyre,
}) => {
  const [supplierName, setSupplierName] = useState("null");
  useEffect(() => {
    if (s_name) {
      setSupplierName(s_name.supplier_name);
    }
  }, [s_name]);

  const currentUser = useSelector((state) => state.getCurrentUser.role_id);

  const getPrices = (userTyrePrice) => {
    if (cmp === null) {
      return {
        A: userTyrePrice || 0,
        B: userTyrePrice || 0,
        C: userTyrePrice || 0,
        D: userTyrePrice || 0,
        "C+": userTyrePrice || 0,
      };
    } else {
      return {
        A: 4600,
        B: 4050,
        C: 2000,
        D: 1050,
        "C+": 2000,
      };
    }
  };

  const exportToExcelWithoutImages = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Sheet1");

    // const prices = getPrices(currentUser);

    let prices = {
      A: 0,
      B: 0,
      C: 0,
      D: 0,
      "C+": 0,
    };

    const categoryCounts = {};

    excelData.forEach((item) => {
      const category = item.user_category_name;
      const userTyrePrice = item.user_tyre_price || {};
      const categoryPrices = getPrices(userTyrePrice);

      prices[category] = categoryPrices[category] || prices[category];
      categoryCounts[category] = (categoryCounts[category] || 0) + 1;
    });

    worksheet.properties.defaultRowHeight = 20;

    worksheet.addRow([]);
    worksheet.addRow([]);

    const inspectionDateValue = inspectionDate;
    const fleetNameValue = cmp === null ? "" : fleetName;

    const headerRow = worksheet.addRow([
      "Inspection Date",
      inspectionDateValue,
      "",
      "",
      cmp !== null ? "Fleet Name" : "",
      fleetNameValue,
    ]);

    headerRow.getCell(1).font = { color: { argb: "000000" } };
    headerRow.getCell(1).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "B4C6E7" },
    };
    headerRow.getCell(1).alignment = {
      vertical: "middle",
      horizontal: "center",
    };
    worksheet.getColumn(1).width = 15;
    headerRow.getCell(1).border = {
      top: { style: "thin", color: { argb: "000000" } },
      left: { style: "thin", color: { argb: "000000" } },
      bottom: { style: "thin", color: { argb: "000000" } },
      right: { style: "thin", color: { argb: "000000" } },
    };

    headerRow.getCell(2).font = { color: { argb: "000000" } };
    headerRow.getCell(2).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "B4C6E7" },
    };
    headerRow.getCell(2).alignment = {
      vertical: "middle",
      horizontal: "center",
    };
    worksheet.getColumn(2).width = 15;
    headerRow.getCell(2).border = {
      top: { style: "thin", color: { argb: "000000" } },
      left: { style: "thin", color: { argb: "000000" } },
      bottom: { style: "thin", color: { argb: "000000" } },
      right: { style: "thin", color: { argb: "000000" } },
    };
    if (cmp !== null) {
      headerRow.getCell(5).font = { color: { argb: "000000" } };
      headerRow.getCell(5).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFD966" },
      };
      headerRow.getCell(5).alignment = {
        vertical: "middle",
        horizontal: "center",
      };
      worksheet.getColumn(5).width = 15;
      headerRow.getCell(5).border = {
        top: { style: "thin", color: { argb: "000000" } },
        left: { style: "thin", color: { argb: "000000" } },
        bottom: { style: "thin", color: { argb: "000000" } },
        right: { style: "thin", color: { argb: "000000" } },
      };

      headerRow.getCell(6).font = { color: { argb: "000000" } };
      headerRow.getCell(6).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFD966" },
      };
      headerRow.getCell(6).alignment = {
        vertical: "middle",
        horizontal: "center",
      };
      worksheet.getColumn(6).width = 35;
      headerRow.getCell(6).border = {
        top: { style: "thin", color: { argb: "000000" } },
        left: { style: "thin", color: { argb: "000000" } },
        bottom: { style: "thin", color: { argb: "000000" } },
        right: { style: "thin", color: { argb: "000000" } },
      };
    }

    const supplier = cmp === null ? "Regrip" : "JK";
    const location = cmp === null ? "" : fleetBranch;

    const secondRow = worksheet.addRow([
      "Supplier",
      supplier,
      "",
      "",
      cmp !== null ? "Location" : "",
      location,
    ]);

    secondRow.getCell(1).font = { color: { argb: "000000" } };
    secondRow.getCell(1).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "A9D08E" },
    };
    secondRow.getCell(1).alignment = {
      vertical: "middle",
      horizontal: "center",
    };
    worksheet.getColumn(1).width = 15;
    secondRow.getCell(1).border = {
      top: { style: "thin", color: { argb: "000000" } },
      left: { style: "thin", color: { argb: "000000" } },
      bottom: { style: "thin", color: { argb: "000000" } },
      right: { style: "thin", color: { argb: "000000" } },
    };

    secondRow.getCell(2).font = { color: { argb: "000000" } };
    secondRow.getCell(2).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "A9D08E" },
    };
    secondRow.getCell(2).alignment = {
      vertical: "middle",
      horizontal: "center",
    };
    worksheet.getColumn(2).width = 15;
    secondRow.getCell(2).border = {
      top: { style: "thin", color: { argb: "000000" } },
      left: { style: "thin", color: { argb: "000000" } },
      bottom: { style: "thin", color: { argb: "000000" } },
      right: { style: "thin", color: { argb: "000000" } },
    };

    if (cmp !== null) {
      secondRow.getCell(5).font = { color: { argb: "000000" } };
      secondRow.getCell(5).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "B4C6E7" },
      };
      secondRow.getCell(5).alignment = {
        vertical: "middle",
        horizontal: "center",
      };
      worksheet.getColumn(5).width = 15;
      secondRow.getCell(5).border = {
        top: { style: "thin", color: { argb: "000000" } },
        left: { style: "thin", color: { argb: "000000" } },
        bottom: { style: "thin", color: { argb: "000000" } },
        right: { style: "thin", color: { argb: "000000" } },
      };

      secondRow.getCell(6).font = { color: { argb: "000000" } };
      secondRow.getCell(6).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "B4C6E7" },
      };
      secondRow.getCell(6).alignment = {
        vertical: "middle",
        horizontal: "center",
      };
      worksheet.getColumn(6).width = 35;
      secondRow.getCell(6).border = {
        top: { style: "thin", color: { argb: "000000" } },
        left: { style: "thin", color: { argb: "000000" } },
        bottom: { style: "thin", color: { argb: "000000" } },
        right: { style: "thin", color: { argb: "000000" } },
      };
    }

    const headerRowToAdd = cmp
      ? ["Price", "Category", "Quantity", "Basic", "GST", "Amount"]
      : ["Category", "Quantity", "Amount"];

    const dataRow = worksheet.addRow(headerRowToAdd);
    dataRow.getCell(1).font = { bold: true, color: { argb: "000000" } };
    dataRow.getCell(1).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFD966" },
    };
    dataRow.getCell(1).alignment = { vertical: "middle", horizontal: "center" };
    worksheet.getColumn(1).width = 15;
    dataRow.getCell(1).border = {
      top: { style: "thin", color: { argb: "000000" } },
      left: { style: "thin", color: { argb: "000000" } },
      bottom: { style: "thin", color: { argb: "000000" } },
      right: { style: "thin", color: { argb: "000000" } },
    };
    dataRow.getCell(2).font = { bold: true, color: { argb: "000000" } };
    dataRow.getCell(2).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFD966" },
    };
    dataRow.getCell(2).alignment = { vertical: "middle", horizontal: "center" };
    worksheet.getColumn(2).width = 15;
    dataRow.getCell(2).border = {
      top: { style: "thin", color: { argb: "000000" } },
      left: { style: "thin", color: { argb: "000000" } },
      bottom: { style: "thin", color: { argb: "000000" } },
      right: { style: "thin", color: { argb: "000000" } },
    };
    dataRow.getCell(3).font = { bold: true, color: { argb: "000000" } };
    dataRow.getCell(3).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFD966" },
    };
    dataRow.getCell(3).alignment = { vertical: "middle", horizontal: "center" };
    worksheet.getColumn(3).width = 15;
    dataRow.getCell(3).border = {
      top: { style: "thin", color: { argb: "000000" } },
      left: { style: "thin", color: { argb: "000000" } },
      bottom: { style: "thin", color: { argb: "000000" } },
      right: { style: "thin", color: { argb: "000000" } },
    };
    dataRow.getCell(4).font = { bold: true, color: { argb: "000000" } };
    dataRow.getCell(4).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFD966" },
    };
    dataRow.getCell(4).alignment = { vertical: "middle", horizontal: "center" };
    worksheet.getColumn(4).width = 15;
    dataRow.getCell(4).border = {
      top: { style: "thin", color: { argb: "000000" } },
      left: { style: "thin", color: { argb: "000000" } },
      bottom: { style: "thin", color: { argb: "000000" } },
      right: { style: "thin", color: { argb: "000000" } },
    };
    dataRow.getCell(5).font = { bold: true, color: { argb: "000000" } };
    dataRow.getCell(5).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFD966" },
    };
    dataRow.getCell(5).alignment = { vertical: "middle", horizontal: "center" };
    worksheet.getColumn(5).width = 15;
    dataRow.getCell(5).border = {
      top: { style: "thin", color: { argb: "000000" } },
      left: { style: "thin", color: { argb: "000000" } },
      bottom: { style: "thin", color: { argb: "000000" } },
      right: { style: "thin", color: { argb: "000000" } },
    };
    dataRow.getCell(6).font = { bold: true, color: { argb: "000000" } };
    dataRow.getCell(6).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFD966" },
    };
    dataRow.getCell(6).alignment = { vertical: "middle", horizontal: "center" };
    worksheet.getColumn(6).width = 35;
    dataRow.getCell(6).border = {
      top: { style: "thin", color: { argb: "000000" } },
      left: { style: "thin", color: { argb: "000000" } },
      bottom: { style: "thin", color: { argb: "000000" } },
      right: { style: "thin", color: { argb: "000000" } },
    };
    dataRow.font = { bold: true };

    amountData.forEach((adata) => {
      if (adata.tyre_category_name.toLowerCase() === "total") {
        const totalRowToAdd = cmp
          ? [
              "Total",
              "",
              adata.quantity,
              adata.basic_amount,
              adata.gst_amount,
              adata.total_amount,
            ]
          : ["Total", adata.quantity, adata.total_amount];
        const totalRow = worksheet.addRow(totalRowToAdd);
        totalRow.font = { bold: true };
        totalRow.alignment = { horizontal: "center", vertical: "middle" };

        headerRow.eachCell({ includeEmpty: true }, (cell, colNumber) => {
          const desiredWidth = Math.max(cell.value.toString().length, 15);
          const currentWidth = worksheet.getColumn(colNumber).width || 15;

          if (desiredWidth > currentWidth) {
            worksheet.getColumn(colNumber).width = desiredWidth;
          }
        });

        worksheet.eachRow({ includeEmpty: true }, (row) => {
          row.alignment = { horizontal: "center", vertical: "middle" };
        });

        totalRow.eachCell({ includeEmpty: true }, (cell, colNumber) => {
          const desiredWidth = Math.max(cell.value.toString().length, 10);
          const currentWidth = worksheet.getColumn(colNumber).width || 10;

          if (desiredWidth > currentWidth) {
            worksheet.getColumn(colNumber).width = desiredWidth;
          }
        });
        return;
      }
      const rowToAdd = cmp
        ? [
            adata.price,
            adata.tyre_category_name,
            adata.quantity,
            adata.basic_amount,
            adata.gst_amount,
            adata.total_amount,
          ]
        : [adata.tyre_category_name, adata.quantity, adata.total_amount];
      const row = worksheet.addRow(rowToAdd);
      row.alignment = { horizontal: "center", vertical: "middle" };

      row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
        const desiredWidth = Math.max(cell.value.length, 10);
        const currentWidth = worksheet.getColumn(colNumber).width || 10;

        if (desiredWidth > currentWidth) {
          worksheet.getColumn(colNumber).width = desiredWidth;
        }
      });
    });

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


    // second Table

    let indexNo = 1;
    worksheet.addRow([]);
    worksheet.addRow([]);
    worksheet.addRow([]);
    if (currentUser === REGRIP_ROLE_ID) {
      const newHeaderRow = worksheet.addRow([
        "S No.",
        "Tyre Number",
        "Size",
        "Brand",
        "Model",
        "Type",
        "Category",
        "Supplier Name",
        "Supplier Code",
        "User Category",
        "Crown Area Defect",
        "Sidewall Area Defect",
        "Inner Crown Defect",
        "Bead Defect",
        "Remarks",
      ]);

      newHeaderRow.getCell(11).font = { bold: true, color: { argb: "000000" } };
      newHeaderRow.getCell(11).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "F8CBAD" },
      };
      newHeaderRow.getCell(11).alignment = {
        vertical: "middle",
        horizontal: "center",
      };
      // newHeaderRow.getColumn(11).width = 15;
      newHeaderRow.getCell(11).border = {
        top: { style: "thin", color: { argb: "000000" } },
        left: { style: "thin", color: { argb: "000000" } },
        bottom: { style: "thin", color: { argb: "000000" } },
        right: { style: "thin", color: { argb: "000000" } },
      };
      newHeaderRow.font = { bold: true };
      newHeaderRow.getCell(12).font = { bold: true, color: { argb: "000000" } };
      newHeaderRow.getCell(12).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFD966" },
      };
      newHeaderRow.getCell(12).alignment = {
        vertical: "middle",
        horizontal: "center",
      };
      // newHeaderRow.getColumn(12).width = 15;
      newHeaderRow.getCell(12).border = {
        top: { style: "thin", color: { argb: "000000" } },
        left: { style: "thin", color: { argb: "000000" } },
        bottom: { style: "thin", color: { argb: "000000" } },
        right: { style: "thin", color: { argb: "000000" } },
      };
      newHeaderRow.font = { bold: true };
      newHeaderRow.getCell(13).font = { bold: true, color: { argb: "000000" } };
      newHeaderRow.getCell(13).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "B4C6E7" },
      };
      newHeaderRow.getCell(13).alignment = {
        vertical: "middle",
        horizontal: "center",
      };
      // newHeaderRow.getColumn(13).width = 15;
      newHeaderRow.getCell(13).border = {
        top: { style: "thin", color: { argb: "000000" } },
        left: { style: "thin", color: { argb: "000000" } },
        bottom: { style: "thin", color: { argb: "000000" } },
        right: { style: "thin", color: { argb: "000000" } },
      };
      newHeaderRow.font = { bold: true };
      newHeaderRow.getCell(14).font = { bold: true, color: { argb: "000000" } };
      newHeaderRow.getCell(14).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "A9D08E" },
      };
      newHeaderRow.getCell(14).alignment = {
        vertical: "middle",
        horizontal: "center",
      };
      newHeaderRow.getCell(14).border = {
        top: { style: "thin", color: { argb: "000000" } },
        left: { style: "thin", color: { argb: "000000" } },
        bottom: { style: "thin", color: { argb: "000000" } },
        right: { style: "thin", color: { argb: "000000" } },
      };

      newHeaderRow.font = { bold: true };
      newHeaderRow.alignment = { horizontal: "center", vertical: "middle" };
      newHeaderRow.eachCell((cell, colNumber) => {
        const desiredWidth = Math.max(cell.value.toString().length, 10);
        const currentWidth = worksheet.getColumn(colNumber).width || 10;

        if (desiredWidth > currentWidth) {
          worksheet.getColumn(colNumber).width = desiredWidth;
        }
      });
    } else {
      const newHeaderRow = worksheet.addRow([
        "S No.",
        "Tyre Number",
        "Size",
        "Model",
        "Type",
        "Category",
        "User Category",
        "Crown Area Defect",
        "Sidewall Area Defect",
        "Inner Crown Defect",
        "Bead Defect",
        "Remarks",
      ]);

      newHeaderRow.getCell(8).font = { bold: true, color: { argb: "000000" } };
      newHeaderRow.getCell(8).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "F8CBAD" },
      };
      newHeaderRow.getCell(8).alignment = {
        vertical: "middle",
        horizontal: "center",
      };
      // newHeaderRow.getColumn(11).width = 15;
      newHeaderRow.getCell(8).border = {
        top: { style: "thin", color: { argb: "000000" } },
        left: { style: "thin", color: { argb: "000000" } },
        bottom: { style: "thin", color: { argb: "000000" } },
        right: { style: "thin", color: { argb: "000000" } },
      };
      newHeaderRow.font = { bold: true };
      newHeaderRow.getCell(9).font = { bold: true, color: { argb: "000000" } };
      newHeaderRow.getCell(9).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFD966" },
      };
      newHeaderRow.getCell(9).alignment = {
        vertical: "middle",
        horizontal: "center",
      };
      // newHeaderRow.getColumn(12).width = 15;
      newHeaderRow.getCell(9).border = {
        top: { style: "thin", color: { argb: "000000" } },
        left: { style: "thin", color: { argb: "000000" } },
        bottom: { style: "thin", color: { argb: "000000" } },
        right: { style: "thin", color: { argb: "000000" } },
      };
      newHeaderRow.font = { bold: true };
      newHeaderRow.getCell(10).font = { bold: true, color: { argb: "000000" } };
      newHeaderRow.getCell(10).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "B4C6E7" },
      };
      newHeaderRow.getCell(10).alignment = {
        vertical: "middle",
        horizontal: "center",
      };
      // newHeaderRow.getColumn(13).width = 15;
      newHeaderRow.getCell(10).border = {
        top: { style: "thin", color: { argb: "000000" } },
        left: { style: "thin", color: { argb: "000000" } },
        bottom: { style: "thin", color: { argb: "000000" } },
        right: { style: "thin", color: { argb: "000000" } },
      };
      newHeaderRow.font = { bold: true };
      newHeaderRow.getCell(11).font = { bold: true, color: { argb: "000000" } };
      newHeaderRow.getCell(11).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "A9D08E" },
      };
      newHeaderRow.getCell(11).alignment = {
        vertical: "middle",
        horizontal: "center",
      };
      newHeaderRow.getCell(14).border = {
        top: { style: "thin", color: { argb: "000000" } },
        left: { style: "thin", color: { argb: "000000" } },
        bottom: { style: "thin", color: { argb: "000000" } },
        right: { style: "thin", color: { argb: "000000" } },
      };

      newHeaderRow.font = { bold: true };
      newHeaderRow.alignment = { horizontal: "center", vertical: "middle" };
      newHeaderRow.eachCell((cell, colNumber) => {
        const desiredWidth = Math.max(cell.value.toString().length, 10);
        const currentWidth = worksheet.getColumn(colNumber).width || 10;

        if (desiredWidth > currentWidth) {
          worksheet.getColumn(colNumber).width = desiredWidth;
        }
      });
    }

    excelData.forEach((item) => {
      if (currentUser === REGRIP_ROLE_ID) {
        const newRow = worksheet.addRow([
          indexNo++,
          item.tyre_serial_number,
          item.tyre_size,
          item.tyre_brand_name,
          item.tyre_model_name,
          item.tyre_category_name,
          item.product_category,
          item.supplier_name,
          item.supplier_code,
          item.user_category_name,
          item.crown_area_defect,
          item.sidewall_area_defect,
          item.inner_crown_defect,
          item.bead_defect,
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
      } else {
        const newRow = worksheet.addRow([
          indexNo++,
          item.tyre_serial_number,
          item.tyre_size,
          item.tyre_model_name,
          item.tyre_category_name,
          item.product_category,
          item.user_category_name,
          item.crown_area_defect,
          item.sidewall_area_defect,
          item.inner_crown_defect,
          item.bead_defect,
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
      }
    });

    const blob = await workbook.xlsx.writeBuffer();
    const blobUrl = URL.createObjectURL(
      new Blob([blob], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      })
    );

    const link = document.createElement("a");
    link.href = blobUrl;
    link.download =
      currentUser === REGRIP_ROLE_ID
        ? `${supplierName}_${fleetName}_${inspectionDate}_Without_images`
        : `${fleetName}_${inspectionDate}_Without_images`;
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
        <span> Without Images </span>{" "}
        <FontAwesomeIcon icon={faDownload} style={{ color: "#39532f" }} />
      </span>
    </p>
  );
};

export default ExcelWithoutImages;
