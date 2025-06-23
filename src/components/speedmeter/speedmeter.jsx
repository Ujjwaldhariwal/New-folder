import { useEffect, useState } from 'react';
import './speedmeter.css';
import { Card } from '@mui/material';

const SpeedMeter = ({ elementID, actualValue, percentValue, incrementSpeed, timeSpeed, title, circlecolor = '#f00',
    cirlcleboxshadow = '0 0 15px #f00,0 0 30px #f00', color = 'primary', sx, ...other }) => {


    const startMeter = () => {
        const rating = document.getElementById(elementID);
        if (typeof (rating) === 'undefined' || rating === undefined) {
            return;
        }

        const block = rating?.getElementsByClassName('block');
        if (typeof (rating) === 'undefined' || rating === undefined) {
            return;
        }
        const targetVal = percentValue;

        for (let i = 0; i < 100; i++) {
            if (block.length < 100)
                rating.innerHTML += `<div id={${elementID}block${i}} className="block" />`;
            if (i <= (targetVal - 1)) {
                block[i].setAttribute("style", `transform:rotate(${3.6 * i}deg);animation-delay: ${i / 40}s;
                    background-color:${circlecolor};box-shadow: ${cirlcleboxshadow};`);
            }
            else {
                block[i].setAttribute("style", `transform:rotate(${3.6 * i}deg);animation-delay: ${i / 40}s;`);
            }
        }

        // -------------------------
        // Set Percentage value with increment
        // const counter = document.querySelector('.counterPercent');
        const counter = document.getElementById(`${elementID}counterPercent`);
        // const target = +counter.getAttribute('data-target');
        const target = percentValue;
        counter.textContent = 0;

        const NumberCounter = () => {
            const value = +counter.textContent;
            if (value < target) {
                counter.textContent = Math.ceil(value + 1);
                // --------------------
                // recall Counter Method
                setTimeout(() => {
                    NumberCounter();
                }, 20)
            }
        }
        // -------------------------
        // call number Counter Method
        NumberCounter();
    }

    const loopMeter = () => {

        const rating = document.getElementById(elementID);
        if (typeof (rating) === 'undefined' || rating === undefined || rating === null) {
            return;
        }
        const block = rating.getElementsByClassName('block');

        for (let i = 0; i < 100; i++) {
            if (block.length < 100)
                rating.innerHTML += `<div id={${elementID}block${i}} className="block" />`;
            // block[i].setAttribute("style", `transform:rotate(${3.6 * i}deg);animation-delay: ${i / 40}s;`);
            block[i].style.transform = `rotate(${3.6 * i}deg)`;
            // block[i].style.animationDelay = `${i / 40}s`;
        }

        // -------------------------
        // Set Percentage value with increment
        const counter = document.getElementById(`${elementID}counterPercent`);
        const target = +counter.getAttribute('data-target');
        counter.textContent = 0;

        const NumberCounter = () => {
            const value = +counter.textContent;
            if (value < target) {
                counter.textContent = Math.ceil(value + 1);
                // --------------------
                // recall Counter Method
                setTimeout(() => {
                    NumberCounter();
                }, 20)
            }

        }
        NumberCounter();
        // -------------------------

        const counterValueEl = document.getElementById(`${elementID}counter`);
        const linejump = 2;
        // let noofline = 25;
        let start = 0;
        let end = 25;
        // -------------------------
        // run circle
        const running = (firstLoop = true) => {

            if (!firstLoop) {
                start += linejump;
                end += linejump;
            }
            // ---------------------
            for (let k = start; k >= 0; k--) {
                // block[k].classList.remove('meter-ring')
                block[k].style.backgroundColor = '';
                block[k].style.boxShadow = '';
            }

            // ---------------------
            // if (noofline >= 99) {
            //     noofline = 0;
            // }
            if (end >= 99) {
                // ---------------------
                for (let k = 99; k >= 0; k--) {
                    block[k].style.backgroundColor = '';
                    block[k].style.boxShadow = '';
                }
                start = 0;
                end = 25;
                
            }

            // ---------------------
            for (let j = start; j < end; j++) {
                // block[j].classList.add('meter-ring')
                block[j].style.backgroundColor = circlecolor;
                block[j].style.boxShadow = cirlcleboxshadow;
            }

            // ---------------------
            setTimeout(() => {
                if (actualValue !== (+counterValueEl.innerText)) {
                    running(false);
                }
                else {
                    removeFilledCircle();
                }
            }, 35)
            // ---------------------
        }
        running();
        // -------------------------

    }

    const getZeroInitialVal = (val) => {
        let retVal = '0';
        let valLength = 0;
        if (typeof (val) === 'string') {
            valLength = val.length;
        }
        else if (typeof (val) === 'bigint' || typeof (val) === 'number') {
            valLength = val.toString().length;
        }
        // --------------------
        // Reset initial value as Blank
        if (valLength > 0)
            retVal = '';
        for (let i = 0; i < valLength; i++) {
            retVal += '0';
        }
        return retVal;
    }

    const [Initialvalue, setInitialValue] = useState(getZeroInitialVal(actualValue))

    const loopMeter2 = () => {
        setInitialValue(getZeroInitialVal(actualValue));

        const rating = document.getElementById(elementID);
        if (typeof (rating) === 'undefined' || rating === undefined || rating === null) {
            return;
        }
        const counterEl = document.getElementById(`${elementID}counter`);
        counterEl.innerText = Initialvalue;

        const block = rating.getElementsByClassName('block');

        for (let i = 0; i < 100; i++) {
            if (block.length < 100)
                rating.innerHTML += `<div id={${elementID}block${i}} className="block" />`;
            // block[i].setAttribute("style", `transform:rotate(${3.6 * i}deg);animation-delay: ${i / 40}s;`);
            block[i].style.transform = `rotate(${3.6 * i}deg)`;
            // block[i].style.animationDelay = `${i / 40}s`;
        }

        // -------------------------
        // Set Percentage value with increment
        const counter = document.getElementById(`${elementID}counterPercent`);
        // const target = +counter.getAttribute('data-target');
        const target = percentValue;
        counter.textContent = 0;

        const NumberCounter = () => {
            const value = +counter.textContent;
            if (value < target) {
                counter.textContent = Math.ceil(value + 1);
                // --------------------
                // recall Counter Method
                setTimeout(() => {
                    NumberCounter();
                }, 50)
            }

        }
        NumberCounter();
        // -------------------------

        const counterValueEl = document.getElementById(`${elementID}counter`);
        
        const linejump = 2;
        let start = 0;
        let end = 25;
        let recall = true;
        // -------------------------
        // run circle
        const running = (firstLoop = true) => {

            if (!firstLoop) {
                start += linejump;
                end += linejump;
            }
            // ---------------------
            for (let k = start; k >= 0; k--) {
                // block[k].classList.remove('meter-ring')
                block[k].style.backgroundColor = '';
                block[k].style.boxShadow = '';
            }

            // ---------------------
            // if (noofline >= 99) {
            //     noofline = 0;
            // }
            if (end >= 99) {
                // ---------------------
                for (let k = 99; k >= 0; k--) {
                    block[k].style.backgroundColor = '';
                    block[k].style.boxShadow = '';
                }
                start = 0;
                end = 25;
                if (actualValue !== (+counterValueEl.innerText)) {
                    recall = true;
                }
                else {
                    recall = false;
                }
            }

            // ---------------------
            for (let j = start; j < end; j++) {
                // block[j].classList.add('meter-ring')
                block[j].style.backgroundColor = circlecolor;
                block[j].style.boxShadow = cirlcleboxshadow;
            }

            // ---------------------
            setTimeout(() => {
                if (recall) {
                    running(false);
                }
                else {
                    removeFilledCircle();
                }
            }, 35)
            // ---------------------
        }
        if(percentValue>0){
            running();
        }
        else{
            removeFilledCircle(false);
        }
        
        // -------------------------

    }

    const fillCirclePercentold = () => {
        const rating = document.getElementById(elementID);
        if (typeof (rating) === 'undefined' || rating === undefined || rating === null) {
            return;
        }
        const block = rating.getElementsByClassName('block');
        const targetVal = percentValue;

        for (let i = 0; i < 100; i++) {
            if (block.length < 100)
                rating.innerHTML += `<div id={${elementID}block${i}} className="block" />`;
            if (i <= (targetVal - 1)) {
                // block[i].style.transform = `rotate(${3.6 * i}deg)`;
                block[i].setAttribute("style", `transform:rotate(${3.6 * i}deg);animation-delay: ${i / 40}s;
              background-color:${circlecolor};box-shadow: ${cirlcleboxshadow};`);
            }
            else {
                block[i].setAttribute("style", `transform:rotate(${3.6 * i}deg);animation-delay: ${i / 40}s;`);
            }
        }
    }

    const fillCirclePercent = () => {
        const rating = document.getElementById(elementID);
        if (typeof (rating) === 'undefined' || rating === undefined || rating === null) {
            return;
        }
        const block = rating.getElementsByClassName('block');
        const targetVal = percentValue;

        for (let i = 0; i < 100; i++) {
            if (block.length < 100)
                rating.innerHTML += `<div id={${elementID}block${i}} className="block" />`;
            if (i <= (targetVal - 1)) {
                block[i].style.transform = `rotate(${3.6 * i}deg)`;
                block[i].style.animationDelay = `${i / 40}s`
                block[i].style.backgroundColor = circlecolor;
                block[i].style.boxShadow = cirlcleboxshadow;
                //  block[i].setAttribute("style", `transform:rotate(${3.6 * i}deg);animation-delay: ${i / 40}s;
                //  background-color:${circlecolor};box-shadow: ${cirlcleboxshadow};`);
            }
            else {
                // block[i].setAttribute("style", `transform:rotate(${3.6 * i}deg);animation-delay: ${i / 40}s;`);
                block[i].style.transform = `rotate(${3.6 * i}deg)`;
                if(percentValue>0)
                    block[i].style.animationDelay = `${i / 40}s`
            }
        }
    }


    const removeFilledCircle = (fillCircle=true) => {
        const rating = document.getElementById(elementID);
        if (typeof (rating) === 'undefined' || rating === undefined || rating === null) {
            return;
        }
        const block = rating.getElementsByClassName('block');
        // ---------------------
        for (let k = 99; k >= 0; k--) {
            // block[k].classList.remove('meter-ring')
            block[k].style.backgroundColor = '';
            block[k].style.boxShadow = '';
        }
        if(fillCircle){
            fillCirclePercent();
        }
    }

    const UpdateCounter = () => {

        const counters = document.querySelectorAll(".counter");
        counters.forEach((counter) => {
            setTimeout(() => {
                const updateCounter = () => {
                    const target = +counter.getAttribute("data-target");
                    // const target = actualValue;
                    const count = +counter.innerText;
                    const increment = target / incrementSpeed;
                    if (count < target) {
                        counter.innerText = getNumberWithSuffixZero(target, Math.ceil(count + increment));
                        setTimeout(updateCounter, timeSpeed);
                    }
                    else {
                        counter.innerText = target;
                    }
                };
                updateCounter();
            }, 250)
        });
    }

    /**
     * used to return number with suffix zero to equle the length of max val
     * @param {number} maxVal 
     * @param {number} runningVal 
     */
    const getNumberWithSuffixZero = (maxVal, runningVal) => {
        let retVal = '';
        const diffLength = maxVal.toString().length - runningVal.toString().length;
        for (let i = 0; i < diffLength; i++) {
            retVal += `0`;
        }
        return `${retVal}${runningVal}`;
    }

    useEffect(() => {
        // startMeter();
        loopMeter2();
        // generateCircle();
        UpdateCounter();
    }, [])

    useEffect(() => {
        removeFilledCircle(false);
        loopMeter2();
        UpdateCounter();
    }, [actualValue])


    return (
        <Card
            style={{ boxShadow: '0 2px 20px rgba(0,0,0,.12),0 0px 1px rgba(0,0,0,.22)', backgroundColor: '#fff' }}
            sx={{
                // py: 1,
                boxShadow: 0,
                textAlign: 'center',
                // color: (theme) => theme.palette[color].darker,
                // bgcolor: (theme) => theme.palette[color].lighter,
                ...sx,
            }}
            {...other}
        >
            <div className='speed-container' >
                <div className="speed-card">
                    <div id={elementID} className='rating'>
                        <h2><span id={`${elementID}counterPercent`} className='counterPercent' data-target={percentValue}>0</span>
                            <sup>%</sup><br />
                            {/* {title} */}
                        </h2>
                        <div id={`${elementID}block`} className='block' />
                    </div>
                </div>
            </div>

            <div className="digital-clock">
                <div id={`${elementID}counter`} className="counter" data-target={actualValue}>
                    {Initialvalue}
                </div>
            </div>
            {/* '#3b7299' */}
            <div style={{ color: '#fff', backgroundColor: circlecolor, padding: '8px', fontSize: '18px', fontWeight: '600' }}>
                {title}
            </div>
        </Card>
    )

}

export default SpeedMeter;