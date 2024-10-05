import React from 'react'
import { useState, useEffect } from 'react';
import GlobalFunctions from '../services/GlobalFunctions'
import Swal from 'sweetalert2'
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';

const DialogoNuevoMovimientoCaja = (params) => {
    const glob = new GlobalFunctions()
    const [movimiento, setMovimiento] = useState({
        fecha: '',
        tipoMovimiento: params.tipoMovimiento,
        valor: 0,
        comentario: ''
    })

    useEffect(() => {
        setFecha()
    }, [])

    useEffect(() => {
        if (params.tipoMovimiento != movimiento.tipoMovimiento) {
            setMovimiento((valores) => ({
                ...valores,
                tipoMovimiento: params.tipoMovimiento,
                valor: 0,
                comentario: ''
            }))
        }
    })

    function setFecha() {
        var fecha = new Date(); //Fecha actual
        var mes = fecha.getMonth() + 1; //obteniendo mes
        var dia = fecha.getDate(); //obteniendo dia
        var ano = fecha.getFullYear(); //obteniendo año
        if (dia < 10)
            dia = '0' + dia; //agrega cero si el menor de 10
        if (mes < 10)
            mes = '0' + mes //agrega cero si el menor de 10
        document.getElementById('fecha').value = ano + "-" + mes + "-" + dia
        setTimeout(() => {
            setMovimiento((valores) => ({
                ...valores,
                fecha: ano + "-" + mes + "-" + dia
            }))
        }, 100);
    }

    function validarCampos(e) {
        e.preventDefault()
        if(movimiento.valor==0 || movimiento.valor==''){
            sweetAlertWarning('Ingresa un valor!')
        }else{
            loadingOn()
            document.getElementById('formCrear').submit()
        }
    }

    function sweetAlertWarning(mensaje) {
        Swal.fire({
            title: mensaje,
            icon: 'warning',
            timer: 1500,
        })
    }

    function cambioFecha(e) {
        setMovimiento((valores) => ({
            ...valores,
            fecha: e.target.value
        }))
    }

    function cambioValor(e) {
        setMovimiento((valores) => ({
            ...valores,
            valor: e.target.value
        }))
    }

    function cambioComentario(e) {
        setMovimiento((valores) => ({
            ...valores,
            comentario: e.target.value
        }))
    }

    function loadingOn(){
        document.getElementById('btnIngresar').style.display='none'
        document.getElementById('btnLoading').style.display=''
    }

    return (
        <div className="modal fade bd-example-modal-lg" id='dialogoMovimientoCaja' tabIndex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h1 style={{ fontSize: '1.5em', marginLeft: '0.5em' }} className="modal-title">{movimiento.tipoMovimiento == 1 ? 'Ingreso a caja' : 'Retiro de caja'}</h1>
                    </div>
                    <div className='container' style={{ margin: '0.2em' }}>
                        <form method="POST" id="formCrear" onSubmit={validarCampos} action={route('caja.store')} encType="multipart/form-data">
                            <input type="hidden" name='_token' value={params.token} />
                            <input type="hidden" name='tipo_movimiento' value={movimiento.tipoMovimiento} />
                            <input id='fecha' name='fecha' onChange={cambioFecha} className='form-control rounded' type="date" value={movimiento.fecha} />
                            <br />
                            Valor:
                            <input name='valor' onChange={cambioValor} className='form-control rounded' type="number" value={movimiento.valor} />
                            <br />
                            Comentario:
                            <textarea name='comentario' onChange={cambioComentario} className='form-control rounded' type="text" value={movimiento.comentario} />

                            <div className="modal-footer">
                                <SecondaryButton type="button" className="btn btn-secondary" data-dismiss="modal">Cancelar</SecondaryButton>
                                <PrimaryButton type='submit' id="btnIngresar" style={{ display: 'inline' }} className="btn btn-success">{movimiento.tipoMovimiento == 1 ? 'Registrar ingreso a caja' : 'Registrar retiro de caja'}</PrimaryButton>
                                <PrimaryButton id='btnLoading' style={{ display: 'none', backgroundColor: 'red' }} className="btn btn-primary" type="button" disabled>
                                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                    Loading...
                                </PrimaryButton>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DialogoNuevoMovimientoCaja