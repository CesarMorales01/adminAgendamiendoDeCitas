import React from 'react'
import { useState, useEffect } from 'react';
import GlobalFunctions from '../services/GlobalFunctions'
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import Swal from 'sweetalert2'

const DialogoListaMovimientosCaja = (params) => {
    const glob = new GlobalFunctions()
    const [movimientos, setMovimientos] = useState([])

    useEffect(() => {
        if (params.listaMovimientos.length>0) {
            if(movimientos.length==0){
                setMovimientos(params.listaMovimientos)
            }else{
                if(movimientos[0].id!=params.listaMovimientos[0].id){
                    setMovimientos(params.listaMovimientos)
                }
            }
        }
    })

    function confirmarEliminar(item){
        Swal.fire({
            title: '¿Eliminar '+item.tipo_movimiento+ ' caja de '+glob.formatNumber(item.valor)+'?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Si, eliminar!'
        }).then((result) => {
            if (result.isConfirmed) {
                document.getElementById('btnLoadingOn').click()
                window.location=params.url+"caja/delete/"+item.id
            }
        })
    }

    return (
        <div className="modal fade" id='dialogoListaMovimientosCaja' tabIndex="-1" >
            <div className="modal-dialog modal-lg modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 style={{ fontWeight: 'bold' }} className="modal-title" id="exampleModalLabel">Lista {movimientos.length > 0 ? movimientos[0].tipo_movimiento : ''} caja</h5>
                    </div>
                    <button id='btnLoadingOn' onClick={params.loadingOn} style={{ display: 'none' }}></button>
                    <div className="modal-body">
                        <div className='container table-responsive'>
                            <table className="table">
                                <thead>
                                    <tr className='align-middle'>
                                        <th scope="col">Fecha</th>
                                        <th scope="col">Valor</th>
                                        <th scope="col">Autor registro</th>
                                        <th scope="col">Comentario</th>
                                        <th scope="col">Eliminar</th>
                                    </tr>
                                </thead>
                                <tbody style={{ whiteSpace: 'nowrap' }}>
                                    {movimientos.map((item, index) => {
                                        return (
                                            <tr scope="row" key={index}>
                                                <th>{item.fecha}</th>
                                                <th>$ {glob.formatNumber(item.valor)}</th>
                                                <th>{item.usuario.name}</th>
                                                <th>{item.observacion}</th>
                                                <th>
                                                    <button onClick={()=>confirmarEliminar(item)} className='btn btn-danger btn-sm' type="button"  style={{ backgroundColor: 'red' }}>
                                                        <svg style={{ padding: '0.2em' }} xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" className="bi bi-trash" viewBox="0 0 16 16">
                                                            <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" />
                                                            <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z" />
                                                        </svg>
                                                    </button>
                                                </th>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <PrimaryButton id='btnCancelarDialogoMovimientosCaja' type="button" data-dismiss="modal">Close</PrimaryButton>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DialogoListaMovimientosCaja