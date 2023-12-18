import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import * as React from 'react';
import { useState } from 'react';
import { Resizable } from 'react-resizable';
import { TableComponents, TableVirtuoso } from 'react-virtuoso';

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

const initColumns: ColumnData[] = [
    {
        width: 100,
        label: '序号',
        dataKey: 'id',
    },
    {
        width: 100,
        label: 'Dessert',
        dataKey: 'dessert',
    },
    {
        width: 70,
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
        width: 70,
        label: 'Carbs\u00A0(g)',
        dataKey: 'carbs',
        numeric: true,
    },
    {
        width: 70,
        label: 'Protein\u00A0(g)',
        dataKey: 'protein',
        numeric: true,
    },
];

const rows: Data[] = Array.from({ length: 2000 }, (_, index) => {
    const randomSelection = sample[Math.floor(Math.random() * sample.length)];
    return createData(index, ...randomSelection);
});





export default function ReactVirtualizedTable() {
    const [columns, setColumns] = useState<ColumnData[]>(initColumns);

    const handleResize = (index: number, newWidth: number) => {
        const newColumns = [...columns];
        newColumns[index] = {
            ...newColumns[index],
            width: newWidth,
        };
        setColumns(newColumns);
    };

    const VirtuosoTableComponents: TableComponents<Data> = {
        Scroller: React.forwardRef<HTMLDivElement>((props, ref) => (
            <TableContainer component={Paper} {...props} ref={ref} />
        )),
        Table: (props) => (
            <Table {...props} sx={{ borderCollapse: 'separate', tableLayout: 'fixed' }} />
        ),
        TableHead,
        TableRow: ({ item: _item, ...props }) => <TableRow {...props} />,
        TableBody: React.forwardRef<HTMLTableSectionElement>((props, ref) => (
            <TableBody {...props} ref={ref} />
        )),
    };

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

    const fixedHeaderContent = () => {
        console.log(163, columns)
        return (
            <TableRow>
                {columns.map((column, index) => (
                    // <TableCell
                    //     key={column.dataKey}
                    //     variant="head"
                    //     align={column.numeric || false ? 'right' : 'left'}
                    //     style={{ width: column.width }}
                    //     sx={{
                    //         backgroundColor: 'background.paper',
                    //     }}
                    // >
                    //     {column.label}
                    // </TableCell>
                    <Resizable
                        height={0}
                        key={column.dataKey}
                        width={column.width}
                        onResize={(e, { size }) => {
                            handleResize(index, size.width)
                        }}
                    >
                        {/* <th>{column.label}</th> */}
                        <TableCell
                            key={column.dataKey}
                            variant="head"
                            align={column.numeric || false ? 'right' : 'left'}
                            style={{ width: column.width }}
                            sx={{
                                backgroundColor: 'background.paper',
                            }}
                        >
                            {column.label}
                        </TableCell>
                    </Resizable>
                ))}
            </TableRow>
        );
    }

    return (
        <Paper style={{ height: 400, width: '100%', maxWidth: '100%' }}>
            <TableVirtuoso
                data={rows}
                components={VirtuosoTableComponents}
                fixedHeaderContent={fixedHeaderContent}
                itemContent={rowContent}
            />
        </Paper>
    );
}