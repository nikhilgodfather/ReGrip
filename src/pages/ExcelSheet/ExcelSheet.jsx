import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API_URL } from '../../components/Config/index';
import { useLocation } from 'react-router-dom';
import ImageDisplay from '../../components/ImageDisplay/ImageDisplay';

const ExcelSheet = () => {
    const [excelData, setExcelData] = useState([]);
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const cmp = params.get('cmp');


    useEffect(() => {
        const getExcelData = async () => {
            let data = {
                "from": null,
                "to": null,
                "fleet_name": null,
                "supplier_name": cmp
            };

            let config = {
                method: 'POST',
                maxLengthBody: Infinity,
                url: `${API_URL}/inspection/getdownloaddata`,
                data: data
            };

            try {
                const response = await axios.request(config);
                if (response) {
                    setExcelData(response.data.data);
                } else {
                    console.log("Unable to get response");
                }
            } catch (error) {
                console.error("Error in API", error);
            }
        };
        getExcelData();
    }, [cmp]);

    return (
        <div>
            <h1>Company: {cmp ? 'JK' : 'Regrip'}</h1>

            <table border="1" cellSpacing="1" cellPadding="2">
                <thead>
                    <tr>
                        <th>Inspection Date</th>
                        <th>Supplier Name</th>
                        <th>Supplier Code</th>
                        <th>Tyre Serial Number</th>
                        <th>Tyre Size</th>
                        <th>Tyre Brand</th>
                        <th>Tyre Modal</th>
                        <th>Product Category</th>
                        <th>Tyre Description</th>
                        <th>Crown Area Defect</th>
                        <th>Crown Area Image</th>
                        <th>SideWall Area Defect</th>
                        <th>SideWall Area Image</th>
                        <th>InnerCrown Defect</th>
                        <th>InnerCrown Image</th>
                        <th>Bead Defect</th>
                        <th>Bead Image</th>
                    </tr>
                </thead>
                <tbody>
                    {excelData.map((ExcelData, i) => {
                        const {
                            inspection_date,
                            supplier_name,
                            supplier_code,
                            tyre_serial_number,
                            tyre_size,
                            tyre_brand_name,
                            tyre_model_name,
                            product_category,
                            tyre_description,
                            crown_area_defect,
                            crown_area_image,
                            sidewall_area_defect,
                            sidewall_area_image,
                            inner_crown_defect,
                            inner_crown_image,
                            bead_defect,
                            bead_image,
                        } = ExcelData;

                        return (
                            <tr className="table-data" key={i}>
                                <td>{inspection_date}</td>
                                <td>{supplier_name}</td>
                                <td>{supplier_code}</td>
                                <td>{tyre_serial_number}</td>
                                <td>{tyre_size}</td>
                                <td>{tyre_brand_name}</td>
                                <td>{tyre_model_name}</td>
                                <td>{product_category}</td>
                                <td>{tyre_description}</td>
                                <td>{crown_area_defect}</td>
                                <td>
                                    <ImageDisplay imageUrl={crown_area_image} />
                                </td>
                                <td>{sidewall_area_defect}</td>
                                <td>
                                    <ImageDisplay imageUrl={sidewall_area_image} />
                                </td>
                                <td>{inner_crown_defect}</td>
                                <td>
                                    <ImageDisplay imageUrl={inner_crown_image} />
                                </td>
                                <td>{bead_defect}</td>
                                <td>
                                    <ImageDisplay imageUrl={bead_image} />
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default ExcelSheet;
