import React from "react";
import Skeleton from "react-loading-skeleton";
import { Controls, Player } from "@lottiefiles/react-lottie-player";
import nodata from "../../../lotties/nodata1.json";

const ScrapRatioTable = ({ getScrapRatioData, loadingScrapRatio }) => {
  const dummyArray = [1, 2, 3, 4, 5];

  return (
    <div className="table-container-for-report">
      <h5 className="heading-report">
        Scrap Ratio - High to Low - Client Wise
      </h5>
      <table className="report-chart-all-table">
        <thead>
          <tr>
            <th className="table-chart-th" style={{ width: "50%" }}>Row Labels</th>
            <th className="table-chart-th" style={{ width: "50%" }}>D</th>
          </tr>
        </thead>

        <tbody>
          {loadingScrapRatio === true
            ? dummyArray.map((i) => (
                <tr>
                  <td className="table-chart-td">
                    <Skeleton />
                  </td>
                  <td className="table-chart-td">
                    <Skeleton />
                  </td>
                </tr>
              ))
            : getScrapRatioData?.map((data, i) => (
                <tr key={i}>
                  <td className="table-chart-td">{data?.fleet_name}</td>
                  <td className="table-chart-td">{data["d%"]}%</td>
                </tr>
              ))}
        </tbody>
      </table>
      {getScrapRatioData?.length === 0 && !loadingScrapRatio && (
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

export default ScrapRatioTable;
