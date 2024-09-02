import React from "react";
import Skeleton from "react-loading-skeleton";
import { Controls, Player } from "@lottiefiles/react-lottie-player";
import nodata from "../../../lotties/nodata1.json";

const CasingRatio = ({ getCasingRatioData, loadingCasingRatio }) => {
  const dummyArray = [1, 2, 3, 4, 5];

  return (
    <div className="table-container-for-report">
      <h5 className="heading-report">Casing Ratio - High to Low - Client Wise</h5>
      <table className="report-chart-all-table">
        <thead>
          <tr>
            <th className="table-chart-th">Row Labels</th>
            <th className="table-chart-th">A</th>
            <th className="table-chart-th">B</th>
            <th className="table-chart-th">C</th>
            <th className="table-chart-th">C+</th>
            <th className="table-chart-th">D</th>
            <th className="table-chart-th">Grand Total</th>
          </tr>
        </thead>
        <tbody style={{ textAlign: "center" }}>
          {loadingCasingRatio === true
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
            : getCasingRatioData?.map((data, i) => (
                <tr key={i}>
                  <td className="table-chart-td">{data.fleet_name}</td>
                  <td className="table-chart-td">{data["a%"]}%</td>
                  <td className="table-chart-td">{data["b%"]}%</td>
                  <td className="table-chart-td">{data["c%"]}%</td>
                  <td className="table-chart-td">{data["c+%"]}%</td>
                  <td className="table-chart-td">{data["d%"]}%</td>
                  <td className="table-chart-td">{data.total}</td>
                </tr>
              ))}
        </tbody>
      </table>

      {getCasingRatioData?.length === 0 && !loadingCasingRatio && (
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

export default CasingRatio;
