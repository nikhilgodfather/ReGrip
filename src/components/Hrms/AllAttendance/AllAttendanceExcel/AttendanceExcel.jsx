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

const AttendanceExcel = ({ leadData, startDate, endDate, selectedCustomer, selectedSalesPerson, selectedType, selectedStatus, selectedAgendaOfMeeting }) => {

    let formattedStartDate
    let formattedEndDate

    if (startDate) {
        formattedStartDate = new Date(startDate).toLocaleDateString('en-GB', 'DD/MM/YYYY');
    }
    if (endDate) {
        formattedEndDate = new Date(endDate).toLocaleDateString('en-GB', 'DD/MM/YYYY');
    }

    if (startDate) {

    }

    const exportToExcelWithoutImages = async () => {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Sheet1");

        worksheet.properties.defaultRowHeight = 20;

        worksheet.addRow([]);
        worksheet.addRow([]);

        const headerRow = worksheet.addRow([
            "Filters",
        ]);

        headerRow.getCell(1).font = { bold: true, color: { argb: "000000" } };
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

        const rowArray = [
            "Start Date",
            "End Date",
            selectedCustomer ? "Customer" : null,
            selectedSalesPerson ? "Sales Person Name" : null,
            selectedStatus ? "Lead Status" : null,
            selectedType ? "Visit Type" : null,
            selectedAgendaOfMeeting ? "Agenda of Meeting" : null,
        ].filter(cellValue => cellValue !== null);

        // Add the filtered row to the worksheet
        const secondRow = worksheet.addRow(rowArray);

        secondRow.eachCell({ includeEmpty: false }, (cell, colNumber) => {
            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'B4C6E7' },
            };
            cell.border = {
                top: { style: "thin", color: { argb: "000000" } },
                left: { style: "thin", color: { argb: "000000" } },
                bottom: { style: "thin", color: { argb: "000000" } },
                right: { style: "thin", color: { argb: "000000" } },
            };
            cell.alignment = {
                vertical: "middle",
                horizontal: "center",
            };
        });
        secondRow.eachCell((cell, colNumber) => {
            const desiredWidth = Math.max(cell.value.toString().length, 10);
            const currentWidth = worksheet.getColumn(colNumber).width || 10;

            if (desiredWidth > currentWidth) {
                worksheet.getColumn(colNumber).width = desiredWidth;
            }
        });

        const row = [
            formattedStartDate,
            formattedEndDate,
            selectedCustomer ? selectedCustomer.label : null,
            selectedSalesPerson ? selectedSalesPerson.label : null,
            selectedStatus ? selectedStatus : null,
            selectedType ? selectedType : null,
            selectedAgendaOfMeeting ? selectedAgendaOfMeeting : null,
        ].filter(cellValue => cellValue !== null)


        const thirdRow = worksheet.addRow(row);

        thirdRow.eachCell({ includeEmpty: false }, (cell, colNumber) => {
            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: '84E684' },
            };
            cell.border = {
                top: { style: "thin", color: { argb: "000000" } },
                left: { style: "thin", color: { argb: "000000" } },
                bottom: { style: "thin", color: { argb: "000000" } },
                right: { style: "thin", color: { argb: "000000" } },
            };
            cell.alignment = {
                vertical: "middle",
                horizontal: "center",
            };
        });

        thirdRow.eachCell((cell, colNumber) => {
            const desiredWidth = Math.max(cell.value.toString().length, 10);
            const currentWidth = worksheet.getColumn(colNumber).width || 10;

            if (desiredWidth > currentWidth) {
                worksheet.getColumn(colNumber).width = desiredWidth;
            }
        });

        let indexNo = 1;
        worksheet.addRow([]);
        worksheet.addRow([]);
        worksheet.addRow([]);
        const newHeaderRow = worksheet.addRow([
            "S No",
            "Lead ID",
            "Lead history ID",
            "Customer",
            "Customer Branch",
            "Sales Person",
            "Meeting Person	",
            "Meeting Person Designation",
            "Agenda Of Meeting",
            "Lead Status",
            "Conversation",
            "Minutes of Meeting",
            "Check In",
            "Meeting Time",
            "Next Meeting Date"
        ]);

        newHeaderRow.eachCell({ includeEmpty: false }, (cell, colNumber) => {
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
        });

        newHeaderRow.font = { bold: true };
        newHeaderRow.alignment = { horizontal: "center", vertical: "middle" };
        newHeaderRow.eachCell((cell, colNumber) => {
            const desiredWidth = Math.max(cell.value.toString().length, 10);
            const currentWidth = worksheet.getColumn(colNumber).width || 10;

            if (desiredWidth > currentWidth) {
                worksheet.getColumn(colNumber).width = desiredWidth;
            }
        });

        leadData.forEach((item) => {
            const newRow = worksheet.addRow([
                indexNo++,
                item.lead_id,
                item.lead_history_id,
                item.customer_name,
                item.customer_branch,
                item.sales_person_name,
                item.meeting_person_name,
                item.meeting_person_designation,
                item.agenda_of_meeting,
                item.lead_status,
                item.conversation,
                item.minutes_of_meeting,
                item.check_in_time ? new Date(item.check_in_time).toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                }) : null,
                item.meeting_time ? new Date(item.meeting_time).toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                }) : null,
                item.next_meeting_date ? new Date(item.next_meeting_date).toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                }) : null
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
        link.download = "Report_Excel"
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
                <Button className='apply-button'>
                    <p> <FontAwesomeIcon style={{ height: 20 }} icon={faDownload} /></p>
                </Button>
            </span>
        </p>
    );
};

export default AttendanceExcel;