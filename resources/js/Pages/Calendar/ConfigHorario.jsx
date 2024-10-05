import React from 'react'
import { useState, useEffect } from 'react';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';

const ConfigHorario = (params) => {
    const [horas, setHoras] = useState([])
    const [mins, setMins] = useState([])
    const [configHorario, setConfigHorario] = useState({
        lista: []
    })

    useEffect(() => {
        cargarConfigHorario()
        cargarHoras()
    }, [])

    function cargarHoras() {
        const horas = []
        for (let i = 0; i < 24; i++) {
            let h = i
            if (i < 10) {
                h = '0' + i
            }
            horas.push(h)
        }
        setHoras(horas)
        const minutos = []
        for (let i = 0; i < 51; i += 10) {
            let h = i
            if (i < 10) {
                h = '0' + i
            }
            minutos.push(h)
        }
        setMins(minutos)
    }

    function cargarConfigHorario() {
        const array = []
        params.configHorario.forEach(element => {
            const objeto = {
                id: element.id,
                dia: element.dia,
                inicio: element.inicio,
                fin: element.fin
            }
            array.push(objeto)
        })
        setConfigHorario((valores) => ({
            ...valores,
            lista: array
        }))
    }

    function cambioActivarHorario(event, item) {
        const config = configHorario.lista
        config.forEach(element => {
            if (element.id == item.id) {
                if (event.target.checked) {
                    element.inicio = '08:00:00'
                    element.fin = '17:00:00'

                } else {
                    element.inicio = '00:00:00'
                    element.fin = '00:00:00'
                }
            }
        })
        actualizarConfigHorario(config)
    }

    function cambioConfigHoraInicio(ev, item) {
        const config = configHorario.lista
        config.forEach(element => {
            if (element.id == item.id) {
                const hour = item.inicio.split(":")
                element.inicio = ev.target.value + ":" + hour[1] + ":00"
            }
        })
        actualizarConfigHorario(config)
    }

    function actualizarConfigHorario(array) {
        setConfigHorario((valores) => ({
            ...valores,
            lista: array
        }))
    }

    function cambioConfigMinutosInicio(ev, item) {
        const config = configHorario.lista
        config.forEach(element => {
            if (element.id == item.id) {
                const hour = item.inicio.split(":")
                element.inicio = hour[0] + ":" + ev.target.value + ":00"
            }
        })
        actualizarConfigHorario(config)
    }

    function getValueSelectHora(hora) {
        const hour = hora.split(":")
        return hour[0]
    }

    function getValueSelectMinuto(hora) {
        const hour = hora.split(":")
        return hour[1]
    }

    function cambioConfigHoraFin(ev, item) {
        const config = configHorario.lista
        config.forEach(element => {
            if (element.id == item.id) {
                const hour = item.inicio.split(":")
                element.fin = ev.target.value + ":" + hour[1] + ":00"
            }
        })
        actualizarConfigHorario(config)
    }

    function cambioConfigMinutosFin(ev, item) {
        const config = configHorario.lista
        config.forEach(element => {
            if (element.id == item.id) {
                const hour = item.inicio.split(":")
                element.fin = hour[0] + ":" + ev.target.value + ":00"
            }
        })
        actualizarConfigHorario(config)
    }

    return (
        <div className="modal fade bd-example-modal-lg" id='dialogoConfigHorario' tabIndex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true">
            <div className="modal-dialog modal-lg">
                <div className="modal-content">
                    <div className="modal-header">
                        <h1 style={{ fontSize: '1.5em', marginLeft: '0.5em' }} className="modal-title">Configurar horario de citas</h1>
                    </div>
                    <div className='container' style={{ margin: '0.2em' }}>
                        <div style={{ textAlign: 'center' }} className='table-responsive'>
                            <table className="table table-striped">
                                <thead>
                                    <tr>
                                        <th >Dia</th>
                                        <th colSpan='4'>Horario</th>
                                    </tr>
                                    <tr>
                                        <th></th>
                                        <th colSpan='2'>Apertura</th>
                                        <th colSpan='2'>Cierre</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {configHorario.lista.map((item, index) => {
                                        return (
                                            <tr key={index}>
                                                <th>
                                                    <span>{item.dia}</span>
                                                    <br />
                                                    <input style={{ height: '1.3em', width: '1.3em' }} onChange={(ev) => cambioActivarHorario(ev, item)} checked={item.inicio == '00:00:00' && item.fin == '00:00:00' ? false : true} type='checkbox' className='rounded' />
                                                </th>
                                                <td >
                                                    <span style={{ display: index == 0 ? '' : 'none', fontWeight: 'bold' }}>Hora</span>
                                                    <br style={{ display: index == 0 ? '' : 'none' }} />
                                                    <select style={{ marginTop: index == 0 ? '0em' : '0.3em' }} onChange={(event) => cambioConfigHoraInicio(event, item)} value={getValueSelectHora(item.inicio)} className='rounded'>
                                                        {horas.map((item) => {
                                                            return (
                                                                <option key={item}>{item}</option>
                                                            )
                                                        })}
                                                    </select>
                                                </td>
                                                <td>
                                                    <span style={{ display: index == 0 ? '' : 'none', fontWeight: 'bold' }}>Minutos</span>
                                                    <br style={{ display: index == 0 ? '' : 'none' }} />
                                                    <select style={{ marginTop: index == 0 ? '0em' : '0.3em' }} onChange={(event) => cambioConfigMinutosInicio(event, item)} value={getValueSelectMinuto(item.inicio)} className='rounded'>
                                                        {mins.map((item) => {
                                                            return (
                                                                <option key={item}>{item}</option>
                                                            )
                                                        })}
                                                    </select>
                                                </td>
                                                <td>
                                                    <span style={{ display: index == 0 ? '' : 'none', fontWeight: 'bold' }}>Hora</span>
                                                    <br style={{ display: index == 0 ? '' : 'none' }} />
                                                    <select style={{ marginTop: index == 0 ? '0em' : '0.3em' }} onChange={(event) => cambioConfigHoraFin(event, item)} value={getValueSelectHora(item.fin)} className='rounded'>
                                                        {horas.map((item) => {
                                                            return (
                                                                <option key={item}>{item}</option>
                                                            )
                                                        })}
                                                    </select>
                                                </td>
                                                <td>
                                                    <span style={{ display: index == 0 ? '' : 'none', fontWeight: 'bold' }}>Minutos</span>
                                                    <br style={{ display: index == 0 ? '' : 'none' }} />
                                                    <select style={{ marginTop: index == 0 ? '0em' : '0.3em' }} onChange={(event) => cambioConfigMinutosFin(event, item)} value={getValueSelectMinuto(item.fin)} className='rounded'>
                                                        {mins.map((item) => {
                                                            return (
                                                                <option key={item}>{item}</option>
                                                            )
                                                        })}
                                                    </select>
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <SecondaryButton type="button" className="btn btn-secondary" data-dismiss="modal">Cancelar</SecondaryButton>
                        <PrimaryButton type='button' onClick={()=>params.fetchSaveConfigHorario(configHorario.lista)} data-dismiss="modal" id="btnIngresar" style={{ display: 'inline' }} className="btn btn-success">Guardar cambios</PrimaryButton>
                        <PrimaryButton id='btnLoading' style={{ display: 'none', backgroundColor: 'red' }} className="btn btn-primary" type="button" disabled>
                            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                            Loading...
                        </PrimaryButton>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ConfigHorario