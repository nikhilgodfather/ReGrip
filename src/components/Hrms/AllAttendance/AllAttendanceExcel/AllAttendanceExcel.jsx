import React from "react";
import ExcelJS from "exceljs";
import { Button } from "@mui/joy";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/free-solid-svg-icons";

const AllAttendanceExcel = ({ attendance, allAttendanceData, selectedMonth }) => {

    const getStatus = (holiday_name, is_weekend, isCurrentDate, check_in_time, check_out_time) => {
        if (holiday_name) {
            return holiday_name;
        } else if (isCurrentDate) {
            return "--/--";
        } else if (is_weekend) {
            return "Weekend";
        } else if (!check_in_time) {
            return "Absent";
        } else {
            return `${check_in_time.substring(0, 5)} | ${check_out_time ? check_out_time.substring(0, 5) : "--/--"}`;
        }
    };

    const exportToExcelWithoutImages = async () => {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet(`Attendance_Report_${selectedMonth}`); // Use selectedMonth for naming the file

        const headerRow = worksheet.addRow(["Name", ...attendance.map(col => new Date(col.attendance_date).toLocaleDateString('en-IN'))]);
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
            column.width = 15
        });




        allAttendanceData.forEach((item) => {
            const newRow = worksheet.addRow([item.employee_name,
            ...item.attendance.map(data => getStatus(data.holiday_name, data.is_weekend, new Date(data.attendance_date).toLocaleDateString('en-IN') === new Date().toLocaleDateString('en-IN'), data.check_in_time, data.check_out_time))]);
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
        link.download = `Attendance_Report_${selectedMonth}.xlsx`;
        document.body.appendChild(link);
        link.click();

        URL.revokeObjectURL(blobUrl);
    };

    return (
        <Button onClick={exportToExcelWithoutImages} className='apply-button'>
            <FontAwesomeIcon icon={faDownload} />
        </Button>
    );
};

export default AllAttendanceExcel;
