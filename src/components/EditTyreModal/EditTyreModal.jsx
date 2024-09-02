import React, { useState, useEffect } from 'react';
import './EditTyreModal.css';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import Updatemodal from '../updateImageModal/updateImageModal';
import { API_URL } from '../Config/index';

const EditTyreModal = ({ setEditTyreModal, editTyreData }) => {
    const [suppName] = useState(editTyreData?.supplier_name || '');

    const [tyreSerialNo, setTyreSerialNo] = useState(
        editTyreData?.tyre_serial_number || ''
    );

    const [availableTyreSizes, setAvailableTyreSizes] = useState([]);

    const [tyreCategory, setTyreCategory] = useState(
        editTyreData?.user_category_name || ''
    );
    const [productCategory, setProductCategory] = useState(
        editTyreData?.product_category || ''
    );
    const [constructionType, setConstructionType] = useState(
        editTyreData?.tyre_construction_type || ''
    );
    const [showUpdateImageModal, setShowUpdateImageModal] = useState(false);
    const [imageDefectId, setImageDefectId] = useState([]);
    const [defectImg, setDefectImg] = useState([]);
    const [imgNames, setImageNames] = useState([]);
    const [defects, setDefects] = useState([]);
    const [tyreDefectImg] = useState(
        editTyreData?.tyre_defects_images || ''
    );
    const [defectTypeId, setDefectTypeId] = useState([]);
    const [updatedImagesData, setUpdatedImagesData] = useState([]);
    const [updatedDescription, setUpdatedDescription] = useState("");
    // const [defectId, setDefectId] = useState([])

    useEffect(() => {
        const imageNames = tyreDefectImg.map((item) => item.link);
        setImageNames(imageNames)
        const imageDefectIds = tyreDefectImg.map((item) => item.defect_id);
        const DefectTypeIds = tyreDefectImg.map((item) => item.defect_type_id);
        // const DefectIds = tyreDefectImg.map((item) => item.defect_id);
        // setDefectId(DefectIds)

        setDefectTypeId(DefectTypeIds);

        const result = imageNames.map(
            (imageName, index) => `${API_URL}/upload/readimageurl?imagename=${imageName}&folder=${imageDefectIds[index]}`
        );

        setDefectImg(result);
        setImageDefectId(imageDefectIds);
        getDefects(imageDefectIds);
        getTyreSizes();
    }, [tyreDefectImg]);

    const getDefects = async (imageDefectIds) => {
        try {
            const { data } = await axios.get(`${API_URL}/defect/getdata`);
            const filteredDefects = data.defects.filter((defect) =>
                imageDefectIds.includes(defect.tyre_defect_id)
            );
            setDefects(filteredDefects);
        } catch (error) {
            console.error('Error retrieving defects:', error);
        }
    };

    const getTyreSizes = async () => {
        try {
            const { data } = await axios.get(`${API_URL}/tyresize/getdata`);
            const sizes = data.sizes.map((size) => ({
                value: size.tyre_size_id,
                text: size.tyre_size,
            }));
            setAvailableTyreSizes(sizes);
        } catch (error) {
            console.error('Error retrieving tyre sizes:', error);
        }
    };

    const handleTyreCategoryChange = (e) => {
        setTyreCategory(e.target.value);
    };

    const handleTyreProductCategoryChange = (e) => {
        setProductCategory(e.target.value);
    };

    const handleConstructionType = (e) => {
        setConstructionType(e.target.value);
    };

    const UpdatedImagesData = (tyre_defects_images, description) => {
        setUpdatedImagesData(tyre_defects_images);
        setUpdatedDescription(description);
    }

    const UpdateEditTyreData = async (e) => {


        var cat;

        if (tyreCategory === "A") {
            cat = 1;
        } else if (tyreCategory === "B") {
            cat = 2;
        } else if (tyreCategory === "C") {
            cat = 3;
        } else if (tyreCategory === "C+") {
            cat = 4;
        } else if (tyreCategory === "D") {
            cat = 5;
        }

        const useTyreDefectImg = !updatedImagesData || updatedImagesData.length === 0;
        e.preventDefault();
        let data = {
            tyre_construction_type: constructionType,
            product_category: productCategory,
            user_tyre_category: cat,
            tyre_defects_images: useTyreDefectImg ? tyreDefectImg : updatedImagesData,
            tyre_inspection_id: editTyreData?.tyre_inspection_id || '',
            tyre_description: updatedDescription ? updatedDescription : editTyreData?.tyre_description || '',
        };

        console.log(data)

        let config = {
            method: "PUT",
            maxLengthBody: Infinity,
            url: `${API_URL}/inspection/updateinspection`,
            data: data,
        };
        try {
            const response = await axios.request(config);
            if (response) {
                alert("tyre Update Successfully")
            }
        } catch (error) {
            console.error("Error in API", error);
        }
    }

    return (
        <div className="edit-modal-main-div">
            {showUpdateImageModal && (
                <Updatemodal
                    setShowUpdateImageModal={setShowUpdateImageModal}
                    defectImg={defectImg}
                    imgNames={imgNames}
                    setDefectImg={setDefectImg}
                    defects={defects}
                    descriptionProp={editTyreData?.tyre_description || ''}
                    tyreSizesId={editTyreData?.tyre_size_id || ''}
                    defectTypeId={defectTypeId}
                    productCategory={productCategory}
                    UpdatedImagesData={UpdatedImagesData}
                />
            )}
            <div className="editTyre-container">
                <div className="editTyre-head">
                    <div className="heading">
                        <h2>Update Tyre Details</h2>
                    </div>
                    <div className="close-btn">
                        <button onClick={() => setEditTyreModal(false)}>
                            <FontAwesomeIcon icon={faXmark} style={{ color: '#ffffff' }} />
                        </button>
                    </div>
                </div>
                <form action="" className="update-tyre-form" onSubmit={UpdateEditTyreData}>
                    <div className="editTyre-form-input">
                        <label htmlFor="supplier_name">Supplier name</label>
                        <input
                            type="text"
                            name="supplier_name"
                            id="supplier_name"
                            value={suppName}
                            onChange={(e) => e.preventDefault()}
                            disabled
                        />
                    </div>
                    <div className="editTyre-form-input">
                        <label htmlFor="tyre_serial_number">Tyre Serial no.</label>
                        <input
                            type="text"
                            name="tyre_serial_number"
                            id="tyre_serial_number"
                            value={tyreSerialNo}
                            onChange={(e) => setTyreSerialNo(e.target.value)}
                            disabled
                        />
                    </div>
                    <div className="editTyre-form-input">
                        <label htmlFor="tyre_category">tyre category</label>
                        <select
                            name="tyre_category"
                            id="tyre_category"
                            value={tyreCategory}
                            onChange={handleTyreCategoryChange}
                        >
                            <option value={tyreCategory} selected disabled>
                                {tyreCategory}
                            </option>
                            <option value="A">A</option>
                            <option value="B">B</option>
                            <option value="C">C</option>
                            <option value="D">D</option>
                            <option value="C+">C+</option>
                        </select>
                    </div>
                    <div className="editTyre-form-input">
                        <label htmlFor="product_category">Product category</label>
                        <select
                            name="product_category"
                            id="product_category"
                            value={productCategory}
                            onChange={handleTyreProductCategoryChange}
                        >
                            <option value={productCategory} selected disabled>
                                {productCategory}
                            </option>
                            <option value="Fresh">Fresh</option>
                            <option value="RTD">RTD</option>
                        </select>
                    </div>
                    <div className="editTyre-form-input">
                        <label htmlFor="product_category">Construction Type</label>
                        <select
                            name="product_category"
                            id="product_category"
                            value={constructionType}
                            onChange={handleConstructionType}
                        >
                            <option value={constructionType} selected disabled>
                                {constructionType}
                            </option>
                            <option value="Radial">Radial</option>
                            <option value="Nylon">Nylon</option>
                        </select>
                    </div>
                    <div className="editTyre-form-input">
                        <label htmlFor="product_category">Tyre defected Images</label>
                        <div className="Update-images-div">
                            <div
                                className="img-div"
                                onClick={() => {
                                    setShowUpdateImageModal(true);
                                    setUpdatedImagesData([]);
                                    setUpdatedDescription('')
                                }}
                            >
                                {defectImg.map((dImage, index) => (
                                    <div div key={index}>
                                        {index === 0 && (
                                            <img
                                                src={dImage}
                                                alt=""
                                                width="105"
                                                height="100"
                                                style={{
                                                    border: '1px solid #36363688',
                                                    borderRadius: '5px',
                                                }}
                                            />
                                        )}
                                    </div>
                                ))}
                                <div className="img-length">
                                    <span>+</span>
                                    {defectImg.length - 1}
                                </div>
                            </div>
                            <div className="img-desc-div">
                                <h2>Tyre Defect's Description</h2>
                                <p>{editTyreData?.tyre_description || ''}</p>
                            </div>
                        </div>
                    </div>
                    <button type="submit" className="editTyre-submit-btn">
                        Update
                    </button>
                </form>
            </div>
        </div>
    );
};

export default EditTyreModal;
