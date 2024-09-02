import React, { useState, useEffect } from "react";
import ExcelJS from "exceljs";
import ExcelTable from "mr-excel";
// import { saveAs } from 'file-saver';
// import { Buffer } from 'buffer';
import { useDispatch, useSelector } from "react-redux";
import { REGRIP_SUPPLIER } from "../../../redux/constants/Constant";
import { API_URL } from "../../Config/index";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/free-solid-svg-icons";
import { REGRIP_ROLE_ID } from "../../../redux/constants/Constant";

const ExcelWithImages = ({
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
  console.log(batchIdDataTyre);
  const [supplierName, setSupplierName] = useState("null");
  useEffect(() => {
    if (s_name) {
      setSupplierName(s_name.supplier_name);
    }
  }, [s_name]);

  const currentUser = useSelector((state) => state.getCurrentUser.role_id);
  const [downloadButtonText, setDownloadButtonText] = useState(
    "Download Excel With Images"
  );
  const okimage64 = {
    image_64:
      "data:image/jpeg;base64,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",
  };

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

  const exportToExcelWithImages = async () => {
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
        "Serial Number Image",
        "Size",
        "Brand",
        "Model",
        "Type",
        "Category",
        "Supplier Name",
        "Supplier Code",
        "User Category",
        "Crown Area Defect",
        "Crown Area Defect Image",
        "Sidewall Area Defect",
        "Sidewall Area Defect Image",
        "Inner Crown Defect",
        "Inner Crown Defect Image",
        "Bead Defect",
        "Bead Defect Image",
        "Remarks",
      ]);

      newHeaderRow.getCell(12).font = { bold: true, color: { argb: "000000" } };
      newHeaderRow.getCell(12).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "F8CBAD" },
      };
      newHeaderRow.getCell(12).alignment = {
        vertical: "middle",
        horizontal: "center",
      };
      // newHeaderRow.getColumn(11).width = 15;
      newHeaderRow.getCell(12).border = {
        top: { style: "thin", color: { argb: "000000" } },
        left: { style: "thin", color: { argb: "000000" } },
        bottom: { style: "thin", color: { argb: "000000" } },
        right: { style: "thin", color: { argb: "000000" } },
      };
      newHeaderRow.getCell(13).font = { bold: true, color: { argb: "000000" } };
      newHeaderRow.getCell(13).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "F8CBAD" },
      };
      newHeaderRow.getCell(13).alignment = {
        vertical: "middle",
        horizontal: "center",
      };
      // newHeaderRow.getCell(13).width = 145;
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
        fgColor: { argb: "FFD966" },
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
      newHeaderRow.getCell(15).font = { bold: true, color: { argb: "000000" } };
      newHeaderRow.getCell(15).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFD966" },
      };
      newHeaderRow.getCell(15).alignment = {
        vertical: "middle",
        horizontal: "center",
      };
      // newHeaderRow.getCell(15).width = 25;
      newHeaderRow.getCell(15).border = {
        top: { style: "thin", color: { argb: "000000" } },
        left: { style: "thin", color: { argb: "000000" } },
        bottom: { style: "thin", color: { argb: "000000" } },
        right: { style: "thin", color: { argb: "000000" } },
      };
      newHeaderRow.font = { bold: true };
      newHeaderRow.getCell(16).font = { bold: true, color: { argb: "000000" } };
      newHeaderRow.getCell(16).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "B4C6E7" },
      };
      newHeaderRow.getCell(16).alignment = {
        vertical: "middle",
        horizontal: "center",
      };
      newHeaderRow.getCell(16).border = {
        top: { style: "thin", color: { argb: "000000" } },
        left: { style: "thin", color: { argb: "000000" } },
        bottom: { style: "thin", color: { argb: "000000" } },
        right: { style: "thin", color: { argb: "000000" } },
      };
      newHeaderRow.font = { bold: true };
      newHeaderRow.getCell(17).font = { bold: true, color: { argb: "000000" } };
      newHeaderRow.getCell(17).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "B4C6E7" },
      };
      newHeaderRow.getCell(17).alignment = {
        vertical: "middle",
        horizontal: "center",
      };
      // newHeaderRow.getCell(17).width = 25;
      newHeaderRow.getCell(17).border = {
        top: { style: "thin", color: { argb: "000000" } },
        left: { style: "thin", color: { argb: "000000" } },
        bottom: { style: "thin", color: { argb: "000000" } },
        right: { style: "thin", color: { argb: "000000" } },
      };
      newHeaderRow.font = { bold: true };
      newHeaderRow.getCell(18).font = { bold: true, color: { argb: "000000" } };
      newHeaderRow.getCell(18).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "A9D08E" },
      };
      newHeaderRow.getCell(18).alignment = {
        vertical: "middle",
        horizontal: "center",
      };
      newHeaderRow.getCell(18).border = {
        top: { style: "thin", color: { argb: "000000" } },
        left: { style: "thin", color: { argb: "000000" } },
        bottom: { style: "thin", color: { argb: "000000" } },
        right: { style: "thin", color: { argb: "000000" } },
      };
      newHeaderRow.font = { bold: true };
      newHeaderRow.getCell(19).font = { bold: true, color: { argb: "000000" } };
      newHeaderRow.getCell(19).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "A9D08E" },
      };
      newHeaderRow.getCell(19).alignment = {
        vertical: "middle",
        horizontal: "center",
      };
      // newHeaderRow.getCell(19).width = 25;
      newHeaderRow.getCell(19).border = {
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

      worksheet.getColumn(3).width = 25;
      worksheet.getColumn(13).width = 25;
      worksheet.getColumn(15).width = 25;
      worksheet.getColumn(17).width = 25;
      worksheet.getColumn(19).width = 25;
    } else {
      const newHeaderRow = worksheet.addRow([
        "S No.",
        "Tyre Number",
        "Serial Number Image",
        "Size",
        "Model",
        "Type",
        "Category",
        "User Category",
        "Crown Area Defect",
        "Crown Area Defect Image",
        "Sidewall Area Defect",
        "Sidewall Area Defect Image",
        "Inner Crown Defect",
        "Inner Crown Defect Image",
        "Bead Defect",
        "Bead Defect Image",
        "Remarks",
      ]);

      newHeaderRow.getCell(9).font = { bold: true, color: { argb: "000000" } };
      newHeaderRow.getCell(9).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "F8CBAD" },
      };
      newHeaderRow.getCell(9).alignment = {
        vertical: "middle",
        horizontal: "center",
      };
      // newHeaderRow.getColumn(11).width = 15;
      newHeaderRow.getCell(9).border = {
        top: { style: "thin", color: { argb: "000000" } },
        left: { style: "thin", color: { argb: "000000" } },
        bottom: { style: "thin", color: { argb: "000000" } },
        right: { style: "thin", color: { argb: "000000" } },
      };
      newHeaderRow.getCell(10).font = { bold: true, color: { argb: "000000" } };
      newHeaderRow.getCell(10).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "F8CBAD" },
      };
      newHeaderRow.getCell(10).alignment = {
        vertical: "middle",
        horizontal: "center",
      };
      // newHeaderRow.getColumn(11).width = 15;
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
        fgColor: { argb: "FFD966" },
      };
      newHeaderRow.getCell(11).alignment = {
        vertical: "middle",
        horizontal: "center",
      };
      // newHeaderRow.getColumn(12).width = 15;
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
        fgColor: { argb: "B4C6E7" },
      };
      newHeaderRow.getCell(14).alignment = {
        vertical: "middle",
        horizontal: "center",
      };
      // newHeaderRow.getColumn(13).width = 15;
      newHeaderRow.getCell(14).border = {
        top: { style: "thin", color: { argb: "000000" } },
        left: { style: "thin", color: { argb: "000000" } },
        bottom: { style: "thin", color: { argb: "000000" } },
        right: { style: "thin", color: { argb: "000000" } },
      };
      newHeaderRow.font = { bold: true };
      newHeaderRow.getCell(15).font = { bold: true, color: { argb: "000000" } };
      newHeaderRow.getCell(15).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "A9D08E" },
      };
      newHeaderRow.getCell(15).alignment = {
        vertical: "middle",
        horizontal: "center",
      };
      newHeaderRow.getCell(15).border = {
        top: { style: "thin", color: { argb: "000000" } },
        left: { style: "thin", color: { argb: "000000" } },
        bottom: { style: "thin", color: { argb: "000000" } },
        right: { style: "thin", color: { argb: "000000" } },
      };
      newHeaderRow.font = { bold: true };
      newHeaderRow.getCell(16).font = { bold: true, color: { argb: "000000" } };
      newHeaderRow.getCell(16).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "A9D08E" },
      };
      newHeaderRow.getCell(16).alignment = {
        vertical: "middle",
        horizontal: "center",
      };
      newHeaderRow.getCell(16).border = {
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

      worksheet.getColumn(3).width = 25;
      worksheet.getColumn(10).width = 25;
      worksheet.getColumn(12).width = 25;
      worksheet.getColumn(14).width = 25;
      worksheet.getColumn(16).width = 25;
    }

    excelData.forEach((item) => {
      const serial_no_image = workbook.addImage({
        base64: item.tyre_serial_number_image_url_64,
        extension: "jpeg",
      });

      const crown_area_defect_image = workbook.addImage({
        base64:
          item.crown_area_defect === "ok"
            ? okimage64.image_64
            : item.crown_area_image_64,
        extension: "jpeg",
      });

      const sidewall_area_defect_image = workbook.addImage({
        base64:
          item.sidewall_area_defect === "ok"
            ? okimage64.image_64
            : item.sidewall_area_image_64,
        extension: "jpeg",
      });

      const inner_crown_defect_image = workbook.addImage({
        base64:
          item.inner_crown_defect === "ok"
            ? okimage64.image_64
            : item.inner_crown_image_64,
        extension: "jpeg",
      });

      const bead_defect_image = workbook.addImage({
        base64:
          item.bead_defect === "ok" ? okimage64.image_64 : item.bead_image_64,
        extension: "jpeg",
      });

      if (currentUser === REGRIP_ROLE_ID) {
        const newRow = worksheet.addRow([
          indexNo++,
          item.tyre_serial_number,
          null,
          item.tyre_size,
          item.tyre_brand_name,
          item.tyre_model_name,
          item.tyre_category_name,
          item.product_category,
          item.supplier_name,
          item.supplier_code,
          item.user_category_name,
          item.crown_area_defect,
          null,
          item.sidewall_area_defect,
          null,
          item.inner_crown_defect,
          null,
          item.bead_defect,
          null,
          item.tyre_description,
        ]);

        newRow.height = 75;

        worksheet.addImage(serial_no_image, {
          tl: { col: 2, row: newRow.number - 1 },
          br: { col: 3, row: newRow.number - 0.000000000001 },
          // ext: { width: 166, height: 80 },
          // alignment: {
          //     horizontal: 'center',
          //     vertical: 'middle',
          // },
        });

        worksheet.addImage(crown_area_defect_image, {
          tl: { col: 12, row: newRow.number - 1 },
          br: { col: 13, row: newRow.number - 0.000000000001 },
        });

        worksheet.addImage(sidewall_area_defect_image, {
          tl: { col: 14, row: newRow.number - 1 },
          br: { col: 15, row: newRow.number - 0.000000000001 },
        });

        worksheet.addImage(inner_crown_defect_image, {
          tl: { col: 16, row: newRow.number - 1 },
          br: { col: 17, row: newRow.number - 0.000000000001 },
        });

        worksheet.addImage(bead_defect_image, {
          tl: { col: 18, row: newRow.number - 1 },
          br: { col: 19, row: newRow.number - 0.000000000001 },
        });

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
          null,
          item.tyre_size,
          item.tyre_model_name,
          item.tyre_category_name,
          item.product_category,
          item.user_category_name,
          item.crown_area_defect,
          null,
          item.sidewall_area_defect,
          null,
          item.inner_crown_defect,
          null,
          item.bead_defect,
          null,
          item.tyre_description,
        ]);

        newRow.height = 75;

        worksheet.addImage(serial_no_image, {
          tl: { col: 2, row: newRow.number - 1 },
          br: { col: 3, row: newRow.number - 0.000000000001 },
        });

        worksheet.addImage(crown_area_defect_image, {
          tl: { col: 9, row: newRow.number - 1 },
          br: { col: 10, row: newRow.number - 0.000000000001 },
        });

        worksheet.addImage(sidewall_area_defect_image, {
          tl: { col: 11, row: newRow.number - 1 },
          br: { col: 12, row: newRow.number - 0.000000000001 },
        });

        worksheet.addImage(inner_crown_defect_image, {
          tl: { col: 13, row: newRow.number - 1 },
          br: { col: 14, row: newRow.number - 0.000000000001 },
        });

        worksheet.addImage(bead_defect_image, {
          tl: { col: 15, row: newRow.number - 1 },
          br: { col: 16, row: newRow.number - 0.000000000001 },
        });

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
        ? `${supplierName}_${fleetName}_${inspectionDate}_With_images`
        : `${fleetName}_${inspectionDate}_With_images`;
    document.body.appendChild(link);
    link.click();

    URL.revokeObjectURL(blobUrl);
  };

  return (
    // <button className="download-button" onClick={exportToExcelWithImages}>
    //     {downloadButtonText}
    // </button>
    <p onClick={exportToExcelWithImages}>
      <span
        style={{
          display: "flex",
          justifyContent: "space-between",
          color: "#39532f",
          width: "100%",
          cursor: "pointer",
        }}
      >
        <span> With Images </span>{" "}
        <FontAwesomeIcon icon={faDownload} style={{ color: "#39532f" }} />
      </span>
    </p>
  );
};

export default ExcelWithImages;
