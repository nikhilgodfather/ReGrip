import React, { useEffect, useRef, useState } from "react";
import "./TyreInspectionModal.css";
import CaptureSerialNoImageModal from "../CaptureSerialNoImageModal/CaptureSerialNoImageModal";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { formFields } from "./utils";
import CaptureImageModal from "../CaptureImageModal/CaptureImageModal";
import Uploading from "./../Uploading/Uploading";
import { API_URL } from "../Config/index"

const TyreInspectionModal = ({ setShowModal }) => {
  // =============================  STATES ==================================//
  const [showImageModal, setShowImageModal] = useState(false);
  const [defects, setDefects] = useState([]);
  const [tyreSizes, setTyreSizes] = useState([]);
  const [tyreModels, setTyreModels] = useState([]);
  const [tyreBrands, setTyreBrands] = useState([]);
  const [showSerialNoImageModal, setShowSerialNoImageModal] = useState(false);
  const [serialNoImage, setSerialNoImage] = useState(null);
  const [serialNoImageURL, setSerialNoImageURL] = useState(null);
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [constructionType, setConstructionType] = useState(null);
  const serialNumberRef = useRef();
  const navigate = useNavigate();
  // const inspection_url = "http://35.154.105.171/api/inspection/postdata";

  const getDefects = async () => {
    const { data } = await axios.get(
      `${API_URL}/defect/getdata`
    );
    setDefects(data.defects);
  };

  const getModels = async (brand, construction) => {
    let brandName;
    tyreBrands.forEach((br) => {
      if (br.value === brand) brandName = br.text;
    });
    const { data } = await axios.get(
      `${API_URL}/tyremodel/getdata?brand=${brandName}&construction=${construction}`
    );
    const models = data.models.map((model) => {
      return {
        text: model.tyre_model_name,
        value: model.tyre_model_id,
      };
    });
    setTyreModels(models);
  };

  const getTyreBrands = async () => {
    const { data } = await axios.get(
      `${API_URL}/tyrebrand/getdata`
    );
    let brands = data.brands.map((brand) => {
      return {
        value: brand.tyre_brand_id,
        text: brand.tyre_brand_name,
      };
    });
    setTyreBrands(brands);
  };

  const getTyreSizes = async () => {
    const { data } = await axios.get(
      `${API_URL}/tyresize/getdata`
    );
    let sizes = data.sizes.map((size) => {
      return {
        value: size.tyre_size_id,
        text: size.tyre_size,
      };
    });
    setTyreSizes(sizes);
  };

  useEffect(() => {
    getTyreSizes();
    getDefects()
  }, []);

  //========================== IMAGE UPLOADER ==============================//
  const uploadImages = (links) => {
    return Promise.all(
      links.map((link, i) => {

        const uploadURL = link.data.uploadURL;
        const file = images[i].image_file;
        const fileType = encodeURIComponent(file.type);
        return axios.put(uploadURL, file, {
          headers: { "Content-Type": fileType },
        });

      })
    );
  };

  //========================== IMAGE LINKS GET ==============================//

  const getLinks = async () => {
    return Promise.all(
      images.map((images) => {
        const file = images.image_file;
        const fileType = encodeURIComponent(file.type);
        return axios.get(
          `${API_URL}/upload/imageurl?fileType=${fileType}`
        );
      })
    );
  };
  //========================== IMAGE PROCESSOR ==============================//

  const processImages = async (images, send_data) => {
    if (!serialNoImageURL) return alert("Please add serialNoImage");
    send_data["tyre_serial_number_image_url"] = serialNoImageURL;
    const links = await getLinks();
    await uploadImages(links);
    const images_json = {};
    images.forEach((image, i) => {
      const imageKey = `image_${i + 1}`;
      images_json[imageKey] = {
        link: links[i].data.uploadURL,
        defect_id: image.image_defect_id,
        defect_name: image.image_defect_name,
      };
    });
    send_data["tyre_defects_images"] = JSON.stringify(images_json);
    postForm(send_data);
  };

  //========================== FORM POSTER ==============================//

  const postForm = async (send_data) => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/");
    const bearer_token = "bearer " + JSON.parse(token);
    try {
      const res = await axios.post(`${API_URL}/inspection/postdata`, { data: [send_data] }, {
        headers: {
          Authorization: bearer_token,
        },
      });
      if (res.data.error) return alert(res.data.error);
      setUploading(false);
      setShowModal(false);
    } catch (err) {
      setUploading(false);
      console.log(err);
    }
  };

  //========================== FORM SUBMIT ==============================//

  const formSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    const send_data = {};
    Object.keys(formFields).forEach((col) => {
      const field = formFields[col];
      if (
        field.name !== "tyre_defects_images" &&
        field.name !== "tyre_serial_number_image_url"
      ) {
        send_data[field.name] = e.target[field.name].value;
      }
    });
    await processImages(images, send_data);
  };




  //========================== JSX RETURN ==============================//

  return (
    <div className="tyre-inspection-modal">
      {uploading && <Uploading />}
      {showSerialNoImageModal && (
        <CaptureSerialNoImageModal
          serialNumberRef={serialNumberRef}
          setShowSerialNoImageModal={setShowSerialNoImageModal}
          setSerialNoImage={setSerialNoImage}
          serialNoImage={serialNoImage}
          setSerialNoImageURL={setSerialNoImageURL}
        />
      )}
      {showImageModal && (
        <CaptureImageModal
          setShowImageModal={setShowImageModal}
          images={images}
          setImages={setImages}
          defects={defects}
        />
      )}
      <button
        className="inspection-close-button"
        onClick={() => {
          setShowModal(false);
        }}
      >
        X
      </button>
      <form action="submit" className="inspection-form" onSubmit={formSubmit} onClick={() => { console.log(images) }}>
        {Object.keys(formFields).map((col, i) => {
          const field = formFields[col];
          if (field.id === "tyreDefectImages") {
            return (
              <div className={`inspection-input ${field.name}-input`} key={i}>
                <label htmlFor={`${field.id}`}>{field.text}</label>
                {images.length > 0 && (
                  <>
                    <span className="remove-images" style={{ color: "gray", border: "2px solid grey", padding: "0 5px", }} onClick={() => { setImages([]); }}>
                      X
                    </span>
                    <span className="number-images">{`${images.length} images`}</span>
                  </>
                )}
                <button id={field.id} onClick={(e) => { e.preventDefault(); setShowImageModal(true); }}>
                  Add Images
                </button>
              </div>
            );
          } else if (field.id === "tyreSerialNoImageUrl") {
            return (
              <div className={`inspection-input ${field.name}-input`} key={i}>
                <label htmlFor={`${field.id}`}>{field.text}</label>
                {serialNoImage && <p>{serialNoImage}</p>}
                <button
                  id={field.id}
                  onClick={(e) => {
                    e.preventDefault();
                    setShowSerialNoImageModal(true);
                  }}
                >
                  Add Image
                </button>
              </div>
            );
          } else if (field.type === "text") {
            return (
              <div className={`inspection-input ${field.name}-input`} key={i}>
                <label htmlFor={`${field.id}`}>{field.text}</label>
                <input type="text" name={field.name} id={field.id} />
              </div>
            );
          } else if (field.type === "select") {
            if (field.id === "tyreBrand") field.options = tyreBrands;
            else if (field.id === "tyreSize") field.options = tyreSizes;
            else if (field.id === "tyreModel") field.options = tyreModels;
            return (
              <div className={`inspection-input ${field.name}-input`} key={i}>
                <label htmlFor={field.id}>{field.text}</label>
                <select
                  type="text"
                  name={field.name}
                  id={field.id}
                  disabled={field.options.length === 0}
                  onChange={(e) => {
                    if (field.id === "tyreConstructionType") {
                      setConstructionType(e.target.value);
                      getTyreBrands();
                      getDefects();
                    } else if (field.id === "tyreBrand") {
                      getModels(e.target.value, constructionType);
                    }
                  }}
                >
                  <option value="" disabled selected>
                    Select a value
                  </option>
                  {field.options.map((c, ii) => {
                    return (
                      <option value={c.value} key={ii}>
                        {c.text}
                      </option>
                    );
                  })}
                </select>
              </div>
            );
          }
        })}
        <button className="inspection-submit-button" type={"submit"}>
          Submit
        </button>
      </form>
    </div>
  );
};

export default TyreInspectionModal;
