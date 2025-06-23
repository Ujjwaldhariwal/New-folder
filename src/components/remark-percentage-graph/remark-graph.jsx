import { useEffect, useState } from 'react';
import { Card } from 'react-bootstrap';
import { isArray } from 'lodash';
import './remark-graph.css';

export default function RemarkGraph({ RemarkList,title,headerBackGroundColor='rgb(238 65 158)' }) {

    // --------------------------
    // Check RemarkList 
    if (!isArray(RemarkList)) {
        throw new TypeError(`RemarkList must be an Array`);
    }

    // --------------------------
    // Check Object keys in Array
    // if (RemarkList.length > 0) {
    //     const keys = Object.keys(RemarkList[0]);
    // }

    const [_remarkList, _setRemarkList] = useState([])

    // -------------------------
    // Handle data on Remark-List Change
    useEffect(() => {
        // sort data 
        const _sortedList = RemarkList.sort((a, b) => { return a.count - b.count });

        // get sum of count
        const sum = RemarkList.reduce((a, b) => a + b.count, 0);

        const data = RemarkList.map((val) => {
            let percentVal = 0;
            if (sum > 0) {
                percentVal = (val.count / sum) * 100;
                const intVal = parseInt(percentVal,10);
                if (percentVal === 0) {
                    percentVal = '0';
                } else if (percentVal < 1) {
                    percentVal = '<1';
                }
                else if (percentVal > intVal) {
                    percentVal = percentVal.toFixed(2);
                }
                else {
                    percentVal = percentVal.toString();
                }
            }
            return {
                remarks:val.remark,
                count:val.count,
                // percent:percentVal
                percent:val.percent
            }
        });
        
        _setRemarkList(data);

    }, [RemarkList])

    return (
        <>
            <div style={{ color: '#fff', backgroundColor: '#ff7722', padding: '10px', fontSize: '18px', fontWeight: '600' }}>
                {title}
            </div>
            <div style={{padding:'0.5rem'}}>
            {_remarkList.map((val) => (
                <>
                    <div className="contain">
                        <div className="legend-container">{val.remarks}</div>
                        <div className="bar-container">
                            <div style={{'--width':val.percent,'--backgroundcolor':'#c2ac35'}} className="skills" />
                            {/* <div className="skills" /> */}
                            {val.percent}%
                        </div>
                        <div className="value-container">{val.count}</div>
                    </div>
                </>
            ))}
            </div>
        </>
    )
}