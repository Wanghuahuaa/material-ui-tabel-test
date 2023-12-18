import { TableHead } from '@mui/material';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import * as React from 'react';
import { useRef, useState } from 'react';
import { Resizable } from 'react-resizable';
// import 'react-resizable/css/styles.css';
import { TableComponents, TableVirtuoso } from 'react-virtuoso';
import ResizableTitle from './ResizableTitle';
import "./index.less";

interface Data {
    calories: number;
    carbs: number;
    dessert: string;
    fat: number;
    id: number;
    protein: number;
}

interface ColumnData {
    dataKey: keyof Data;
    label: string;
    numeric?: boolean;
    width: number;
}

type Sample = [string, number, number, number, number];

const sample: readonly Sample[] = [
    ['Frozen yoghurt', 159, 6.0, 24, 4.0],
    ['Ice cream sandwichIce cream sandwichIce cream sandwichIce cream sandwichIce cream sandwichIce cream sandwichIce cream sandwichIce cream sandwichIce cream sandwichIce cream sandwichIce cream sandwichIce cream sandwichIce cream sandwichIce cream sandwichIce cream sandwichIce cream sandwichIce cream sandwichIce cream sandwichIce cream sandwichIce cream sandwichIce cream sandwichIce cream sandwichIce cream sandwichIce cream sandwichIce cream sandwichIce cream sandwichIce cream sandwichIce cream sandwichIce cream sandwichIce cream sandwich', 237, 9.0, 37, 4.3],
    ['Eclair', 262, 16.0, 24, 6.0],
    ['CupcakeCupcakeCupcakeCupcakeCupcakeCupcakeCupcakeCupcakeCupcakeCupcakeCupcakeCupcakeCupcakeCupcakeCupcakeCupcakeCupcakeCupcakeCupcakeCupcakeCupcakeCupcakeCupcakeCupcakeCupcakeCupcakeCupcakeCupcakeCupcakeCupcake', 305, 3.7, 67, 4.3],
    ['Gingerbread', 356, 16.0, 49, 3.9],
];

function createData(
    id: number,
    dessert: string,
    calories: number,
    fat: number,
    carbs: number,
    protein: number,
): Data {
    return { id, dessert, calories, fat, carbs, protein };
}

const columns: ColumnData[] = [
    {
        width: 80,
        label: '序号',
        dataKey: 'id',
    },
    {
        width: 150,
        label: 'Dessert',
        dataKey: 'dessert',
    },
    {
        width: 90,
        label: 'Calories\u00A0(g)',
        dataKey: 'calories',
        numeric: true,
    },
    {
        width: 100,
        label: 'Fat\u00A0(g)',
        dataKey: 'fat',
        numeric: true,
    },
    {
        width: 90,
        label: 'Carbs\u00A0(g)',
        dataKey: 'carbs',
        numeric: true,
    },
    {
        width: 100,
        label: 'Protein\u00A0(g)',
        dataKey: 'protein',
        numeric: true,
    },
];

const rows: Data[] = Array.from({ length: 200 }, (_, index) => {
    const randomSelection = sample[Math.floor(Math.random() * sample.length)];
    return createData(index, ...randomSelection);
});



function rowContent(_index: number, row: Data) {
    return (
        <React.Fragment>
            {columns.map((column) => (
                <TableCell
                    key={column.dataKey}
                    align={column.numeric || false ? 'right' : 'left'}
                >
                    {row[column.dataKey]}
                </TableCell>
            ))}
        </React.Fragment>
    );
}

export default function ReactVirtualizedTable() {
    const [columnWidths, setColumnWidths] = useState<any>(columns.reduce((prev: any, item: any) => {
        return {
            ...prev,
            [item.dataKey]: item.width
        }
    }, {}));
    const [tableWidth, setTableWidth] = useState<number | string>("100%")
    const tableRef = useRef<any>()

    // React.useEffect(() => {
    //     setTimeout(() => {
    //         setTableWidth("70%")
    //     }, 3000)
    // }, [])

    const handleResize = (dataKey: string, newWidth: number) => {
        setColumnWidths((prevWidths: any) => {
            return ({
                ...prevWidths,
                [dataKey]: newWidth
            })
        });
    };

    const TableHeader = () => {
        return (
            <TableHead>
                <TableRow>
                    {columns.map((column) => (
                        // <TableCell
                        //     key={column.dataKey}
                        //     variant="head"
                        //     align={column.numeric || false ? 'right' : 'left'}
                        //     style={{ width: columnWidths[column.dataKey] }}
                        //     sx={{
                        //         backgroundColor: 'background.paper',
                        //     }}
                        // >
                        //     {column.label}
                        // </TableCell>
                        <Resizable
                            height={0}
                            key={column.dataKey}
                            width={columnWidths[column.dataKey]}
                            onResize={(e, { size }) => {
                                handleResize(column.dataKey, size.width)
                            }}
                        >
                            {/* <th>{column.label}</th> */}
                            <TableCell
                                // key={column.dataKey}
                                // variant="head"
                                // align={column.numeric || false ? 'right' : 'left'}
                                style={{ width: columnWidths[column.dataKey] }}
                            // sx={{
                            //     backgroundColor: 'background.paper',
                            // }}
                            >
                                {column.label}
                            </TableCell>
                        </Resizable>
                    ))}
                </TableRow>
            </TableHead>
        );
    }

    const VirtuosoTableComponents: TableComponents<Data> = React.useMemo(() => {
        return {
            Scroller: React.forwardRef<HTMLDivElement>((props, ref) => (
                <TableContainer component={Paper} {...props} ref={ref} />
            )),
            Table: (props) => (
                <Table {...props} sx={{ borderCollapse: 'separate', tableLayout: 'fixed' }} />
            ),
            // TableHead: TableHeader,
            TableRow: ({ item: _item, ...props }) => <TableRow selected={_item.id === 2} {...props} />,
            TableBody: React.forwardRef<HTMLTableSectionElement>((props, ref) => {
                return (
                    <TableBody {...props} ref={ref} />
                )
            }),
        }
    }, []);

    const fixedHeaderContent = () => {
        return (
            <TableRow>
                {columns.map((column) => (
                    <ResizableTitle
                        tableRef={tableRef}
                        key={column.dataKey}
                        width={columnWidths[column.dataKey]}
                        children={column.label}
                        onResize={(e, { size }) => {
                            console.log(size, e)
                            handleResize(column.dataKey, size.width)
                        }}
                    ></ResizableTitle>
                    // <Resizable
                    //     height={0}
                    //     key={column.dataKey}
                    //     width={columnWidths[column.dataKey]}
                    //     onResizeStart={() => {
                    //         console.log('onResizeStart')
                    //     }}
                    //     onResizeStop={() => {
                    //         console.log('onResizeStop')
                    //     }}
                    //     onResize={(e, { size }) => {
                    //         console.log(size, e)
                    //         handleResize(column.dataKey, size.width)
                    //     }}
                    // >
                    //     <TableCell
                    //         key={column.dataKey}
                    //         variant="head"
                    //         align={column.numeric || false ? 'right' : 'left'}
                    //         style={{ width: columnWidths[column.dataKey] }}
                    //         sx={{
                    //             backgroundColor: 'background.paper',
                    //         }}
                    //     >
                    //         {column.label}
                    //     </TableCell>
                    // </Resizable>
                ))}
            </TableRow>
        );
    }

    // console.log(columnWidths)

    return (
        <div style={{ height: "100%", width: '100%', padding: 100 }}>
            <Paper style={{ height: "100%", width: tableWidth }}>
                <TableVirtuoso
                    className='resize-table'
                    data={rows}
                    components={VirtuosoTableComponents}
                    fixedHeaderContent={fixedHeaderContent}
                    itemContent={rowContent}
                    // atTopThreshold={5}
                    ref={tableRef}
                />
            </Paper>
        </div>
    );
}
