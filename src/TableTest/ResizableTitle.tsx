import { TableCell } from "@mui/material";
import { useMemo, useState } from "react";
import { Resizable, ResizeCallbackData } from "react-resizable";
import { StateSnapshot } from "react-virtuoso";

const TABLE_COL_MIN_WIDTH = 50

// 调整table表头
const ResizableTitle = (props: any) => {
    const { onResize, width, className, children, style = {}, tableRef, ...restProps } = props
    // 拖动的宽度(正在拖时才有值 拖完置为0)
    const [offset, setOffset] = useState<number>(0);
    // 拖动列右边列的宽度 用于限制最大宽度不超过下一列
    const [nextColWidth, setNextColWidth] = useState<number>(TABLE_COL_MIN_WIDTH);

    // const translateX = useMemo(() => {
    //     if (offset >= nextColWidth + TABLE_COL_MIN_WIDTH) {
    //         return nextColWidth - TABLE_COL_MIN_WIDTH;
    //     }
    //     return offset;
    // }, [offset, nextColWidth]);

    const translateX = useMemo(() => {
        return offset;
    }, [offset]);

    // 最后一列不让拖
    // if (columns && props.children[1] === columns[columns.length - 1]?.title) return <th {...restProps} />

    // 复选框列 未设置宽度的列 不允许拖动
    if (!onResize || !width || className?.includes('ant-table-selection-column')) {
        return (
            <th className={className} style={style} {...restProps}>
                {children}
            </th>
        );
    }

    // 复选框列 未设置宽度的列 不允许拖动
    // if (!onResize || !width || className?.includes('ant-table-selection-column')) return (
    //     <th className={className} style={{ ...style, width: width + 'px' }}>
    //         <div
    //             style={{ width: "100%" }}
    //             className="ofs-table-cell-wrapper"
    //             title={typeof children?.[1] === 'string' ? children.join('') : ''}
    //         >
    //             <div {...restProps} className="ofs-table-cell">
    //                 {children}
    //             </div>
    //         </div>
    //     </th>
    // );

    return (
        <Resizable
            width={width + offset}
            // width={width}
            height={0}
            // onResize={onResize}
            // 操作手柄
            handle={
                <span
                    className={`react-resizable-handle ${offset ? 'active' : ''}`}
                    style={{ transform: `translateX(${translateX}px)` }}
                    onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                    }}
                />
            }
            draggableOpts={{
                enableUserSelectHack: true, // 在调整大小期间不能选择元素内部的文本内容
                minConstraints: [TABLE_COL_MIN_WIDTH, 0],
                // maxConstraints: [width + nextColWidth, 0],
            }}
            onResizeStop={(...arg: any[]) => {
                // console.log("58-onResizeStop", arg)
                setOffset(0);
                onResize(...arg);
                // tableRef.current?.getState((state: StateSnapshot) => {
                //     console.log(81, state?.scrollTop)
                //     setTimeout(() => {
                //         tableRef.current.scrollTo({
                //             top: state?.scrollTop,
                //             // behavior: 'smooth',
                //         })
                //     }, 0)
                // })
            }}
            onResizeStart={() => {
                // console.log(81, tableRef.current?.getState())
                tableRef.current?.getState((state: StateSnapshot) => {
                    console.log(83, state)
                })
                // tableRef.current?.scrollTo?.({
                //     top: 300,
                //     // behavior: 'smooth',
                // })
            }}
            // onResizeStart={(e: any) => {
            //     const _nextWidth = e.target.parentNode.nextSibling.getBoundingClientRect().width;
            //     setNextColWidth(_nextWidth);
            // }}
            onResize={(e: any, { size }: ResizeCallbackData) => {
                // console.log(87, size.width, width)
                const currentOffset = size.width - width;
                // 限制拖动的最小宽度
                if (size.width < TABLE_COL_MIN_WIDTH) return setOffset(TABLE_COL_MIN_WIDTH - width)
                // 限制拖动的最大宽度
                // if (currentOffset > nextColWidth - TABLE_COL_MIN_WIDTH) return setOffset(nextColWidth - TABLE_COL_MIN_WIDTH);
                setOffset(currentOffset);
            }}
        >
            <TableCell
                className={className}
                style={{ ...style, width: width, minWidth: width }}
                {...restProps}
                onClick={(e) => {
                    // @ts-ignore
                    if (!e.target?.className?.includes?.('react-resizable-handle')) restProps.onClick?.()
                }}
                sx={{
                    backgroundColor: 'background.paper'
                }}
            >
                <div
                    style={{ width: "100%" }}
                    className="ofs-table-cell-wrapper"
                    title={typeof children?.[1] === 'string' ? children.join?.('') : ''}
                >
                    <div className="ofs-table-cell">
                        {children}
                    </div>
                </div>
            </TableCell>
        </Resizable >
    )
}

export default ResizableTitle
