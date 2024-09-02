import './GenerateRequestExcel.css'
import React, { useState, useEffect } from "react";
import ExcelJS from "exceljs";
// import ExcelTable from "mr-excel";
// import { saveAs } from 'file-saver';
// import { Buffer } from 'buffer';
// import { REGRIP_ROLE_ID } from "../../../redux/constants/Constant";
// import { JK_ROLE_ID } from "../../../redux/constants/Constant";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload, faFileExcel } from "@fortawesome/free-solid-svg-icons";
import { Button } from "@mui/joy";
import axios from 'axios';
import { API_URL } from '../../Config';

const GenerateRequestExcel = ({ inside, tyres }) => {

    const exportToExcel = async () => {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Sheet1");

        worksheet.properties.defaultRowHeight = 20;

        const newHeaderRow = worksheet.addRow([
            "serial number",
            "tyre size",
            "tyre model",
            "construction type",
            "product category"
        ]);

        // newHeaderRow.eachCell({ includeEmpty: false }, (cell, colNumber) => {
        //     cell.fill = {
        //         type: 'pattern',
        //         pattern: 'solid',
        //         fgColor: { argb: 'c0ced4' },
        //     };
        //     cell.border = {
        //         top: { style: "thin", color: { argb: "000000" } },
        //         left: { style: "thin", color: { argb: "000000" } },
        //         bottom: { style: "thin", color: { argb: "000000" } },
        //         right: { style: "thin", color: { argb: "000000" } },
        //     };
        // });

        // newHeaderRow.font = { bold: true };
        newHeaderRow.alignment = { horizontal: "center", vertical: "middle" };
        newHeaderRow.eachCell((cell, colNumber) => {
            const desiredWidth = Math.max(cell.value.toString().length, 10);
            const currentWidth = worksheet.getColumn(colNumber).width || 10;

            if (desiredWidth > currentWidth) {
                worksheet.getColumn(colNumber).width = desiredWidth;
            }
        });

        tyres.forEach((item) => {
            const newRow = worksheet.addRow([
                item.tyre_serial_number,
                item.tyre_size,
                item.tyre_model_name,
                item.tyre_construction_type,
                item.product_category,
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
        link.download = "Excel"
        document.body.appendChild(link);
        link.click();

        URL.revokeObjectURL(blobUrl);
    }

    return (
        <div onClick={exportToExcel} className='generate-request-excel'>
            <div
                style={{
                    // width: "100%",
                    // cursor: "pointer",
                }}
            >
                <button className='download-uploaded-excel'>
                    Download Uploaded Excel
                </button>
            </div>
        </div>
    );
};

export default GenerateRequestExcel;
