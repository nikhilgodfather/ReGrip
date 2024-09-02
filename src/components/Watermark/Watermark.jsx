import React from 'react'
import {
    Page,
    Text,
    View,
    Document,
    StyleSheet,
    Image,
    PDFDownloadLink,
} from "@react-pdf/renderer";

const Watermark = () => {
    const watermarkCount = 26;

    return (
        <>
            <View
                style={{
                    position: 'absolute',
                    opacity: 0.6,
                    fontSize: 32,
                    fontWeight: 'normal',
                    color: '#D3D3D3',
                    zIndex: 1,
                    width: '100%',
                    height: '100%',
                    textAlign: 'center',
                    display: 'flex',
                    flexDirection: 'row',
                    flexWrap: "wrap",
                    rowGap: "130px",
                    columnGap: "150px",
                    justifyContent: 'center',
                    alignItems: 'center',
                    paddingTop: "50px",
                }}
            >
                {Array.from({ length: watermarkCount }, (_, index) => (
                    <Text key={index} style={{ transform: `rotate(-45deg)` }}

                    >REGRIP</Text>
                ))}
            </View>
        </>
    )
}

export default Watermark
