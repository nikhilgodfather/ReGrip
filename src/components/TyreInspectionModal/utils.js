const formFields = {
  supplierId: {
    type: "text",
    id: "supplierId",
    text: "Supplier Id : ",
    name: "supplier_id",
  },
  tyreSerialNo: {
    type: "text",
    id: "tyreSerialNo",
    text: "Tyre Serial No. : ",
    name: "tyre_serial_number",
  },
  tyreSerialNoImageUrl: {
    type: "modal",
    id: "tyreSerialNoImageUrl",
    text: "Tyre Serial No. Image : ",
    name: "tyre_serial_number_image_url",
  },
  tyreConstructionType: {
    type: "select",
    id: "tyreConstructionType",
    text: "Tyre Construction Type : ",
    name: "tyre_construction_type",
    options: [
      { value: "nylon", text: "nylon" },
      { value: "radial", text: "radial" },
    ],
  },
  tyreBrand: {
    type: "select",
    id: "tyreBrand",
    text: "Tyre Brand : ",
    name: "tyre_brand_id",
    options: [],
  },
  tyreSize: {
    type: "select",
    id: "tyreSize",
    text: "Tyre Size : ",
    name: "tyre_size_id",
    options: [],
  },
  tyreModel: {
    type: "select",
    id: "tyreModel",
    text: "Tyre Model : ",
    name: "tyre_model_id",
    options: [],
  },
  productCategory: {
    type: "select",
    id: "productCategory",
    text: "Product Category : ",
    name: "product_category",
    options: [
      { value: "Fresh", text: "Fresh" },
      { value: "RTD", text: "RTD" },
    ],
  },
  tyreCategory: {
    type: "select",
    id: "tyreCategory",
    text: "tyre Category : ",
    name: "tyre_category",
    options: [
      { value: "A", text: "A" },
      { value: "B", text: "B" },
      { value: "C", text: "C" },
      { value: "D", text: "D" },
    ],
  },
  tyreDefectImages: {
    type: "modal",
    id: "tyreDefectImages",
    text: "Tyre Defect Images :",
    name: "tyre_defects_images",
  },
  tyreDescription: {
    type: "text",
    id: "tyreDescription",
    text: "Tyre Description",
    name: "tyre_description",
  },
};

export { formFields };
