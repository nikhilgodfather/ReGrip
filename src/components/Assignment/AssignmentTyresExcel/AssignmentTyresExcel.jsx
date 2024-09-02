import React from "react";
import ExcelJS from "exceljs";
import { Button } from "@mui/joy";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/free-solid-svg-icons";
import './AssignmentTyresExcel.css'

const AssignmentTyresExcel = ({ checkedData, selectedFleetName }) => {



    const exportToExcelWithoutImages = async () => {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet(`${checkedData[0]?.supplier_name}-${selectedFleetName}_TyreAction`); // Use selectedMonth for naming the file

        let indexNo = 1;
        const headerRow = worksheet.addRow([
            "S.No",
            "Tyre Serial Number",
            "Construction Type",
            "Size",
            "Fleet",

        ]);
        headerRow.eachCell(cell => {
            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'c0ced4' },
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
        worksheet.columns.forEach(column => {
            column.width = 20
        });




        checkedData.forEach((item) => {
            const newRow = worksheet.addRow([
                indexNo++,
                item.tyre_serial_number,
                item.tyre_construction_type,
                item.tyre_size,
                selectedFleetName,
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
        link.download = `${checkedData[0]?.supplier_name}-${selectedFleetName}_TyreAction.xlsx`;
        document.body.appendChild(link);
        link.click();

        URL.revokeObjectURL(blobUrl);
    };

    return (
        <button className='apply-button' onClick={exportToExcelWithoutImages}>
            <p> 
                Download 
                {/* <FontAwesomeIcon style={{ height: 15 }} icon={faDownload} /> */}
            </p>
        </button>

    );
};

export default AssignmentTyresExcel;
