import { StyleSheet } from "@react-pdf/renderer";

const regripStyles = StyleSheet.create({
    page: {
        fontSize: 6,
        margin: 7,
        padding: 7,
        flexGrow: 1,
    },
    table: {
        display: "table",
        borderStyle: "solid",
        borderTopWidth: 1,
        borderLeftWidth: 1,
        borderRightWidth: 0,
        borderBottomWidth: 0,
    },
    row: {
        flexDirection: "row",
    },
    cell: {
        width: "13%",
        padding: 2,
        borderStyle: "solid",
        borderWidth: 1,
        height: 30,
        borderLeftWidth: 1,
        borderTopWidth: 1,
        flexDirection: "column",
        flexWrap: "wrap",
        overflow: "hidden",
        textTransform: 'capitalize',
    },

    header: {
        fontWeight: 'bold',
        backgroundColor: '#FFD966',
        width: "13%",
        padding: 2,
        height: 30,
        borderStyle: "solid",
        textTransform: 'capitalize',
        flexDirection: "column",
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: "center",
        fontSize: '8'
    },

    imageCell: {
        width: "13%",
        padding: 2,
        height: 30,
        borderStyle: "solid",
        borderWidth: 1,
        borderLeftWidth: 0,
        borderTopWidth: 1,
        flexDirection: "row",
        overflow: "hidden",
    },
    heading: {
        fontSize: 20,
        textAlign: 'center',
        marginBottom: 20,
        fontWeight: 'bold'
    },
    head: {
        fontSize: 11,
        textAlign: 'left',
        marginBottom: 20,
        fontWeight: 'bold',
        flexDirection: 'column',
        alignItems: 'flex-start',

    },

    cellHead: {
        width: "100%",
        padding: 2,
        borderWidth: 0,
        borderLeftWidth: 0,
        borderTopWidth: 0,
        flexDirection: "column",
        overflow: "hidden",
    },

});

export default regripStyles;