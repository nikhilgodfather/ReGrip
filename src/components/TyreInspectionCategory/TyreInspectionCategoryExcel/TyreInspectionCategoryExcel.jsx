import React, { useState } from "react";
import ExcelJS from "exceljs";
import { Button } from "@mui/joy";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/free-solid-svg-icons";

const TyreInspectionCategoryExcel = ({category, setShowFleetWarning, allDataForDownloadTyreInspection, selectedFleet }) => {


    const getCategoryLetter = (category) => {
        switch (category) {
            case 1:
                return "A";
            case 2:
                return "B";
            case 3:
                return "C";
            case 4:
                return "C+";
            case 5:
                return "D";
            default:
                return "";
        }
    };

    const exportToExcelWithoutImages = async () => {
        if (!selectedFleet) {
            setShowFleetWarning(true)
        } else {
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet(`Tyre_branch`);

            let indexNo = 1;
            const headerRow = worksheet.addRow([
                "S.No",
                "Type Serial No",
                "Brand",
                "Fleet Name",
                "Size",
                "Model",
                "Construction Type",
                "Product Category",
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
                column.width = 25
            });


            allDataForDownloadTyreInspection.forEach((item) => {
                const newRow = worksheet.addRow([
                    indexNo++,
                    item.tyre_serial_number,
                    item.tyre_brand_name,
                    `${item.fleet_name}, ${item.fleet_branch_location}`,
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

            const categoryLetter = getCategoryLetter(category);
            const blob = await workbook.xlsx.writeBuffer();
            const blobUrl = URL.createObjectURL(
                new Blob([blob], {
                    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                })
            );

            const link = document.createElement("a");
            link.href = blobUrl;
            link.download = `Tyre_${selectedFleet.fleet_name}_${categoryLetter}.xlsx`;
            document.body.appendChild(link);
            link.click();

            URL.revokeObjectURL(blobUrl);
        };

    }







    return (

        <Button className='apply-button' onClick={exportToExcelWithoutImages}>
            <p> Download Tyre <FontAwesomeIcon style={{ height: 15 }} icon={faDownload} /></p>
        </Button>
    );
};

export default TyreInspectionCategoryExcel;
