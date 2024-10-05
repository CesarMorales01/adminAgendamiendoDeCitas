import React from 'react'
import Select from 'react-select'
import { useState, useEffect } from 'react';

const SelectCars = (params) => {
    const [options, setOptions] = useState([])

    useEffect(() => {
        cargarDatos()
    }, [])

    function cargarDatos() {
        if (options.length == 0) {
            let opts = []
            for (let i = 0; i < params.cars.length; i++) {
                let item = new OptionsAuto(params.cars[i].id, params.cars[i].placa)
                opts.push(item)
            }
            setOptions(opts)
        }
    }

    function getChange(e) {
        document.getElementById('inputValueCar').value = e.label
        document.getElementById('inputValueCar').click()
    }

    return (
        <div>
            <input type='hidden' id='inputValueCar' onClick={params.getCar} />
            <Select onChange={getChange} options={options} />
        </div>
    )
}

export default SelectCars

class OptionsAuto {
    constructor(codigo, label) {
        this.codigo = codigo;
        this.label = label;
    }

}