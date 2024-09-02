import { Button, CircularProgress, Input } from '@mui/joy';
import React, { useState } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import { API_URL } from '../../Config';
import axios from 'axios';

const AddOtherBrandTyre = ({setAddBrandTyreModal,getAllBrands}) => {
    const [loading, setLoading] = useState(false)

    const [showBrandWarning, setShowBrandWarning] = useState(false);
    const [brand, setBrand] = useState('')
;

    const handleSubmitButton = async () => {

        console.log(brand);
        try {

            if (!brand) {
                !brand && setShowBrandWarning(true);
                return;
            }


            const data = {
                tyre_brand_name: brand,
            };
            setLoading(true)
            await axios.post(`${API_URL}/tyrebrand/add-other-brand`, data);
            setLoading(false)
            getAllBrands()
            setAddBrandTyreModal(false)
            setBrand("")

            toast.success("Brand Added successfully", {
                position: toast.POSITION.TOP_CENTER,
                autoClose: 2000,
            })
        } catch (error) {
            console.error('Error Meeting Person:', error);
            setLoading(false)
            toast.error("Error While Adding Brand Name", {
                position: toast.POSITION.TOP_CENTER,
                autoClose: 2000,
            })
        }
    }


    return (
        <div>
            <div className='addBranch-customer-main'>
                <ToastContainer className="custom-toast-container" />
                <div className='scrolling-view'>
                    <div>
                        <h3 style={{ fontSize: 20, color: 'grey' }}>Add Tyre Brand</h3>
                    </div>

                    <div className='field-align' style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div className='add-customer-field-container' style={{ width: '100%' }}>
                            <h5>Brand</h5>
                            <Input
                                style={{ border: showBrandWarning ? ' 1px solid red' : ' 1px solid #ccc', width: '100%' }}
                                className='field-addBranch'
                                placeholder="Enter Brand Name"
                                value={brand}
                                onChange={(event) => {
                                    setShowBrandWarning(false)
                                    setBrand(event.target.value);
                                }}
                            />
                        </div>
                    </div>
                    <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'center' }}>
                        {

                            loading ?
                                <Button className='addBranch-btn'>
                                    <CircularProgress variant="solid" />
                                </Button>
                                :
                                <Button className='addBranch-btn'
                                    onClick={() => handleSubmitButton()}
                                >
                                    Add Brand
                                </Button>
                        }
                    </div>
                </div>
            </div>

        </div>
    )
}

export default AddOtherBrandTyre