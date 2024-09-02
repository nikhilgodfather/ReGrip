import React, { useState, useEffect } from 'react';
import "./updateImageModal.css";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, } from "@fortawesome/free-solid-svg-icons";
import { API_URL } from '../Config/index';

const UpdateImageModal = ({
    setShowUpdateImageModal,
    defectImg,
    setDefectImg,
    defects,
    descriptionProp,
    tyreSizesId,
    defectTypeId,
    productCategory,
    UpdatedImagesData,
    imgNames }) => {
    const [allDefects, setAllDefects] = useState([]);
    const [selectedDefects, setSelectedDefects] = useState([]);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [filePreviews, setFilePreviews] = useState([]);
    const [description, setDescription] = useState(descriptionProp);
    const [newDefects, setNewDefects] = useState([])

    if (productCategory === 'Fresh') {
        var ProductCatId = "1";
    } else {
        ProductCatId = "2";
    }

    useEffect(() => {
        setDescription(descriptionProp);
    }, [descriptionProp]);

    const handleDescriptionChange = (event) => {
        setDescription(event.target.value);
    };

    const getDefects = async () => {
        try {
            const { data } = await axios.get(`${API_URL}/defect/getdata`);
            setAllDefects(data.defects);
        } catch (error) {
            console.log("Error while getting defects", error)
        }
    };

    const handleSelectChange = (index, e) => {
        setSelectedDefects((prevSelectedDefects) => {
            const newSelectedDefects = [...prevSelectedDefects];
            newSelectedDefects[index] = e.target.value;
            return newSelectedDefects;
        });
    };

    const getImageFileType = (file) => {
        const fileType = file.type.split('/')[1];
        const fType = `image/${fileType}`;
        return fType;
    };


    const getLinks = async (fileType) => {
        try {
            const response = await axios.get(`${API_URL}/upload/imageurl?fileType=${fileType}`);
            return response.data;
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    };

    const handleImageChange = (index, e) => {
        const newSelectedFiles = [...selectedFiles];
        newSelectedFiles[index] = e.target.files[0];
        setSelectedFiles(newSelectedFiles);

        const reader = new FileReader();
        reader.onload = async () => {
            const newFilePreviews = [...filePreviews];
            newFilePreviews[index] = reader.result;
            setFilePreviews(newFilePreviews);

            const fileType = getImageFileType(e.target.files[0]);
            const file_type = encodeURIComponent(fileType);
            const linkResponse = await getLinks(file_type);
            const link = linkResponse.data.key;
        };

        if (e.target.files[0]) {
            reader.readAsDataURL(e.target.files[0]);
        }
    };

    const getCatId = (tyreDefectId) => {
        let foundTyreCategoryId = null;

        for (const newDefect of newDefects) {
            if (!Array.isArray(newDefect)) {
                console.error("Invalid data structure. Expected an array.");
                return null;
            }

            for (const defectObject of newDefect) {
                if (defectObject.tyre_defect_id === tyreDefectId) {
                    foundTyreCategoryId = defectObject.tyre_category_id;
                    break;
                }
            }
            if (foundTyreCategoryId !== null) {
                break;
            }
        }

        return foundTyreCategoryId;
    };


    const handleCloseModal = () => {
        setSelectedFiles([]);
        setFilePreviews([]);
        setSelectedDefects(new Array(defectImg.length).fill(''));
        setShowUpdateImageModal(false);
    };


    const handleSaveChanges = async () => {
        const tyre_defects_images = [];

        const readFileAsDataURL = (file) => {
            return new Promise((resolve) => {
                const reader = new FileReader();
                reader.onload = () => resolve(reader.result);
                reader.readAsDataURL(file);
            });
        };

        const getDataURLForSelectedFiles = async () => {
            const dataURLPromises = selectedFiles.map((file) =>
                file ? readFileAsDataURL(file) : null
            );
            return Promise.all(dataURLPromises);
        };

        try {
            const dataURLs = await getDataURLForSelectedFiles();

            imgNames.forEach(async (image, index) => {
                const isSelectedImage = selectedFiles[index] !== undefined;
                const isSelectedDefect = selectedDefects[index] !== '';

                const dataURL = isSelectedImage ? dataURLs[index] : null;

                const fileType = isSelectedImage ? getImageFileType(selectedFiles[index]) : null;
                const file_type = isSelectedImage ? encodeURIComponent(fileType) : null;
                const linkResponse = isSelectedImage ? await getLinks(file_type) : null;
                const link = isSelectedImage ? linkResponse.data.key : image;

                tyre_defects_images.push({
                    link: link,
                    defect_type_id: isSelectedDefect ? parseInt(selectedDefects[index].split(',')[0]) : (defects[index]?.defect_type_id || null),
                    tyre_category_id: isSelectedDefect ? parseInt(selectedDefects[index].split(',')[1]) : getCatId(defects[index]?.tyre_defect_id) || null,
                });
            });

            // console.log("Updated Data:", tyre_defects_images);
            // console.log("Description:", description);
            UpdatedImagesData(tyre_defects_images, description);
            handleCloseModal();
        } catch (error) {
            console.error("Error reading files:", error);
        }
    };

    const imageApiData = defectImg.map((_, index) => ({
        defectTypeId: defectTypeId[index],
    }));

    const getDefectData = async () => {
        const defectDataPromises = defectImg.map(async (image, index) => {
            try {
                const apiData = imageApiData[index];
                const response = await axios.get(`${API_URL}/defect/getdata?construction=radial&defecttypeid=${apiData.defectTypeId}&tyresizeid=${tyreSizesId}&productcategoryid=${ProductCatId}`);
                return response.data.defects;
            } catch (error) {
                console.error('Error for index', index, ':', error);
                return [];
            }
        });

        const defectDataArray = await Promise.all(defectDataPromises);
        setNewDefects(defectDataArray);
    };



    useEffect(() => {
        getDefectData();
        getDefects();
        setSelectedDefects(new Array(defectImg.length).fill(''));
    }, []);

    const headingTexts = [
        "Crown Area",
        "Sidewall Area",
        "Inner Crown",
        "Bead Separation",
    ];


    return (
        <div className="img-main-div">
            <div className="update-modal">
                <div className="img-modal-header">
                    <div className="heading">
                        <h2>Update Defected Images</h2>
                    </div>
                    <div className="close-btn">
                        <button onClick={handleCloseModal}>
                            <FontAwesomeIcon icon={faXmark} style={{ color: "#ffffff", }} />
                        </button>
                    </div>
                </div>
                <div className="update-modal-body">
                    <div className="img-upload">
                        {defectImg.map((image, index) => (
                            <div key={index}>
                                {/* {getDefectData(index)} */}
                                <div className="image-div">
                                    <div className="def-types">
                                        <h1>{headingTexts[index] || "Default Heading"}</h1>
                                    </div>
                                    <div className='defect-names'>
                                        <select value={selectedDefects[index]} onChange={(e) => handleSelectChange(index, e)} className='defect-selection-field'>
                                            <option value="" selected>{selectedDefects[index] ? (
                                                allDefects.length > 0 ? (
                                                    allDefects.find((defect) => defect.tyre_defect_id === parseInt(selectedDefects[index], 10))?.tyre_defect_name || <p>Defect name is undefined</p>
                                                ) : (
                                                    <p>Loading defects...</p>
                                                )
                                            ) : (
                                                <>
                                                    {defects[index]?.tyre_defect_name || <p>Defect name is undefined</p>}
                                                </>
                                            )}</option>
                                            {newDefects[index] ? (
                                                newDefects[index].map((defect) => (
                                                    <option key={defect.tyre_defect_id} value={`${defect.defect_type_id},${defect.tyre_category_id},${defect.tyre_defect_id}`}>
                                                        {defect.tyre_defect_name}
                                                    </option>
                                                ))
                                            ) : (
                                                <option value="" disabled>Loading defects...</option>
                                            )}
                                        </select>

                                    </div>
                                    <div className="imgs">
                                        <label htmlFor={`fileInput-${index}`}>
                                            {filePreviews[index] ? (
                                                <img src={filePreviews[index]} alt="" width="385" height="180" />
                                            ) : (
                                                <img src={image} alt="" width="385" height="180" />
                                            )}
                                            <input
                                                id={`fileInput-${index}`}
                                                type="file"
                                                style={{ display: "none" }}
                                                onChange={(e) => handleImageChange(index, e)}
                                            />
                                        </label>
                                    </div>
                                </div>
                            </div>
                        ))}
                        <div className="description-div">
                            <h2>Description</h2>
                            <textarea
                                rows="4"
                                cols="4"
                                value={description}
                                onChange={handleDescriptionChange}
                            ></textarea>
                        </div>
                        <div className="modal-footer">
                            <button onClick={handleCloseModal} style={{ backgroundColor: '#39532f' }}>Close</button>
                            <button onClick={handleSaveChanges}>Save</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UpdateImageModal;
