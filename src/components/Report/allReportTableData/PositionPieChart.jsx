import React from "react";

import CanvasJSReact from "@canvasjs/react-charts";

var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSChart = CanvasJSReact.CanvasJSChart;

const PositionPieChart = ({ getPositionPieChartData }) => {
  const transformedData = getPositionPieChartData.map((item) => ({
    y: parseFloat(item.percentage),
    label: item.defect_type_name,
  }));

  const options = {
    exportEnabled: false,
    animationEnabled: true,

    title: {
      text: "Position Chart",
      fontSize: 14,
      fontWeight: "800",
      fontFamily: "monospace",
      fontColor: "#65a143",
    },

    data: [
      {
        type: "pie",
        startAngle: 1,
        toolTipContent: "<b>{label}</b>: {y}%",
        legendText: "{label}",
        indexLabelFontSize: 12,
        indexLabel: "{label} - {y}%",
        dataPoints: transformedData,
      },
    ],
  };

  return (
    <div style={{ width: "100%" }}>
      <CanvasJSChart options={options} />
    </div>
  );
};

export default PositionPieChart;
