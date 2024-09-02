import { Input } from "@mui/joy"
import { useState } from "react"
import './TyreCountModal.css'

const TyreCountModal = ({ maxTyres, setShowTyreCountModal, type, setTyreCount, tyreCount }) => {

    const [showTyreCountWarning, setShowTyreCountWarning] = useState(false)

    const handleSubmit = () => {
        if (tyreCount > maxTyres) {
            return;
        }
        setShowTyreCountModal()
    }

    return (
        <div className="tyre-count-modal">
            <div className="heading" style={{ width: '100%' }}>
                <h2 style={{ color: "#53a336", fontSize: "25px", textTransform: 'capitalize', textAlign: 'center' }}>{type}</h2>
            </div>
            <div className="info">
                Enter number of tyres you want to {type === "lifting" ? "Lift" : type === "approve" ? "Approve" : "upload Invoice for"}.
            </div>
            <div className="input-field">
                <label htmlFor="tyre_count" style={{ fontSize: '0.9vw', fontWeight: 700, marginBottom: 10 }}>Tyre Count (Max : {maxTyres})</label>
                <Input
                    placeholder="Tyre Count"
                    style={{ border: showTyreCountWarning ? ' 1px solid red' : ' 1px solid #ccc' }}
                    className='background-color'
                    type="number"
                    value={tyreCount}
                    InputProps={{
                        inputProps: { min: 0 }
                    }}
                    onChange={(e) => {
                        if (e.target.value > maxTyres) {
                            setShowTyreCountWarning(true)
                        }
                        else {
                            setShowTyreCountWarning(false)
                        }

                        if (e.target.value < 0) {
                            setTyreCount(0)
                        }
                        else {
                            setTyreCount(e.target.value)
                        }
                    }}
                />
            </div>
            <button className="submit-button" onClick={() => handleSubmit()}>
                {
                    type === 'approve' ?
                        "Approve" : type === 'invoice' ?
                            "Invoice" : "Pick Up"
                }
            </button>

        </div>
    )
}

export default TyreCountModal