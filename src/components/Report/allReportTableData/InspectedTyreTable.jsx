import React from "react";
import { Controls, Player } from "@lottiefiles/react-lottie-player";
import nodata from "../../../lotties/nodata1.json";
import Skeleton from "react-loading-skeleton";
const InspectedTyreTable = ({ getInspectedTyreData, loadingInspected }) => {
  const dummyArray = [1, 2, 3, 4, 5, 6, 7];
  return (
    <div className="table-container-for-report" >
      <h5 className="heading-report">Total Inspected Tyres by Regrip</h5>
      <table className="report-chart-all-table"> 
        <thead>
          <tr>
            <th className="table-chart-th">Row Labels</th>
            <th className="table-chart-th">Grand Total</th>
            <th className="table-chart-th">A</th>
            <th className="table-chart-th">B</th>
            <th className="table-chart-th">C</th>
            <th className="table-chart-th">C+</th>
            <th className="table-chart-th">D</th>
          </tr>
        </thead>
        <tbody>
          {loadingInspected === true
            ? dummyArray.map((i) => (
                <tr>
                  <td className="table-chart-td">
                    <Skeleton />
                  </td>
                  <td className="table-chart-td">
                    <Skeleton />
                  </td>
                  <td className="table-chart-td">
                    <Skeleton />
                  </td>
                  <td className="table-chart-td">
                    <Skeleton />
                  </td>
                  <td className="table-chart-td">
                    <Skeleton />
                  </td>
                  <td className="table-chart-td">
                    <Skeleton />
                  </td>
                  <td className="table-chart-td">
                    <Skeleton />
                  </td>
                </tr>
              ))
            : getInspectedTyreData?.map((data, i) => (
                <tr key={i}>
                  <td className="table-chart-td">{data?.fleet_name}</td>
                  <td className="table-chart-td">{data?.total}</td>
                  <td className="table-chart-td" style={{ padding: "0px" }}>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "3px",
                        height: "100%",
                        width: "100%",
                        padding: "5px 0px",
                      }}
                    >
                      <span>{data.a}</span>
                      <span style={{ border: "1px solid #000" }}></span>
                      <span style={{ fontWeight: "normal" }}>
                        {data["a%"]}%
                      </span>
                    </div>
                  </td>
                  <td className="table-chart-td" style={{ padding: "0px" }}>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "3px",
                        height: "100%",
                        width: "100%",
                        padding: "5px 0px",
                      }}
                    >
                      <span>{data.b}</span>
                      <span style={{ border: "1px solid #000" }}></span>
                      <span style={{ fontWeight: "normal" }}>
                        {data["b%"]}%
                      </span>
                    </div>
                  </td>
                  <td className="table-chart-td" style={{ padding: "0px" }}>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "3px",
                        height: "100%",
                        width: "100%",
                        padding: "5px 0px",
                      }}
                    >
                      <span>{data.c}</span>
                      <span style={{ border: "1px solid #000" }}></span>
                      <span style={{ fontWeight: "normal" }}>
                        {data["c%"]}%
                      </span>
                    </div>
                  </td>
                  <td className="table-chart-td" style={{ padding: "0px" }}>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "3px",
                        height: "100%",
                        width: "100%",
                        padding: "5px 0px",
                      }}
                    >
                      <span>{data["c+"]}</span>
                      <span
                        style={{
                          border: "1px solid #000",
                        }}
                      ></span>
                      <span style={{ fontWeight: "normal" }}>
                        {data["c+%"]}%
                      </span>
                    </div>
                  </td>
                  <td className="table-chart-td" style={{ padding: "0px" }}>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "3px",
                        height: "100%",
                        width: "100%",
                        padding: "5px 0px",
                      }}
                    >
                      <span>{data.d}</span>
                      <span style={{ border: "1px solid #000" }}></span>
                      <span style={{ fontWeight: "normal" }}>
                        {data["d%"]}%
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
        </tbody>
      </table>

      {getInspectedTyreData?.length === 0 && !loadingInspected && (
        <div className="empty-data">
          <Player
            autoplay
            loop
            src={nodata}
            style={{ height: "150px", width: "150px" }}
          >
            <Controls buttons={["repeat", "frame", "debug"]} />
          </Player>
        </div>
      )}
    </div>
  );
};

export default InspectedTyreTable;
