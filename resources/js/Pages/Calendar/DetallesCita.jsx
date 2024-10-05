import React from 'react'
import { useState, useEffect } from 'react';
import Swal from 'sweetalert2'
import SecondaryButton from '@/Components/SecondaryButton';

const DetallesCita = (params) => {

    function abrirDialogoEliminar() {
        Swal.fire({
            title: '¿Eliminar esta cita?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Si, eliminar!'
        }).then((result) => {
            if (result.isConfirmed) {
                document.getElementById("btnEliminar").click()
                document.getElementById("btnCancelarDialogoDetalleCita").click()
            }
        })
    }

    function goClient() {
        if (params.cita.idCliente != '') {
            const url=params.url+'customer/amend/'+params.cita.idCliente+'/nothing'
            window.open(url, "nuevo", "directories=no, location=no, menubar=no, scrollbars=yes, statusbar=no, tittlebar=no, width=600, height=600");
        }
    }

    function getClassName(){
        let classN=''
        if(params.cita.idCliente!=''){
            classN="btn btn-link"
        }
        return classN
    }

    return (
        <div className="modal fade bd-example-modal-lg" id='dialogoDetallesCita' tabIndex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true">
            <div className="modal-dialog modal-lg modal-dialog-centered">
                <div style={{ backgroundColor: params.cita.background }} className="modal-content">
                    <div className="modal-header">
                        <h1 style={{ fontSize: '1.2em', textAlign: 'center', fontWeight: 'bold' }}>Detalles cita</h1>
                        <button onClick={abrirDialogoEliminar} id='btnDialogoEliminar' style={{ marginTop: '0.5em', backgroundColor: 'red' }} className="btn btn-danger" type="button">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash" viewBox="0 0 16 16">
                                <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" />
                                <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z" />
                            </svg>
                        </button>
                        <a id='btnEliminar' onClick={() => params.eliminarCita(params.cita)} style={{ display: 'none' }} ></a>
                    </div>
                    <div className='container'>
                        <div className='row'>
                            <div className='col-lg-6 col-md-6 col-sm-12 col-12'>
                                <div style={{ display: "flex", marginTop: '0.5em' }} className="card-title">
                                    <svg style={{ marginTop: '0.2em', marginRight: '0.5em' }} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-calendar3" viewBox="0 0 16 16">
                                        <path d="M14 0H2a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2M1 3.857C1 3.384 1.448 3 2 3h12c.552 0 1 .384 1 .857v10.286c0 .473-.448.857-1 .857H2c-.552 0-1-.384-1-.857z" />
                                        <path d="M6.5 7a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2m-9 3a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2m-9 3a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2" />
                                    </svg>
                                    <span>Dia: {params.cita.fecha}</span>
                                </div>
                            </div>
                            <div className='col-lg-6 col-md-6 col-sm-12 col-12'>
                                <div style={{ display: "flex", marginTop: '0.5em' }} className="card-title">
                                    <svg style={{ marginTop: '0.2em', marginRight: '0.5em' }} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-alarm" viewBox="0 0 16 16">
                                        <path d="M8.5 5.5a.5.5 0 0 0-1 0v3.362l-1.429 2.38a.5.5 0 1 0 .858.515l1.5-2.5A.5.5 0 0 0 8.5 9z" />
                                        <path d="M6.5 0a.5.5 0 0 0 0 1H7v1.07a7.001 7.001 0 0 0-3.273 12.474l-.602.602a.5.5 0 0 0 .707.708l.746-.746A6.97 6.97 0 0 0 8 16a6.97 6.97 0 0 0 3.422-.892l.746.746a.5.5 0 0 0 .707-.708l-.601-.602A7.001 7.001 0 0 0 9 2.07V1h.5a.5.5 0 0 0 0-1zm1.038 3.018a6 6 0 0 1 .924 0 6 6 0 1 1-.924 0M0 3.5c0 .753.333 1.429.86 1.887A8.04 8.04 0 0 1 4.387 1.86 2.5 2.5 0 0 0 0 3.5M13.5 1c-.753 0-1.429.333-1.887.86a8.04 8.04 0 0 1 3.527 3.527A2.5 2.5 0 0 0 13.5 1" />
                                    </svg>
                                    <span>Hora: {params.cita.hora}</span>
                                </div>
                            </div>
                            <div className='col-lg-6 col-md-6 col-sm-12 col-12'>
                                <div style={{ display: "flex", marginTop: '0.5em' }} className={getClassName()}>
                                    <svg style={{ marginTop: '0.2em', marginRight: '0.5em' }} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-person-arms-up" viewBox="0 0 16 16">
                                        <path d="M8 3a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3" />
                                        <path d="m5.93 6.704-.846 8.451a.768.768 0 0 0 1.523.203l.81-4.865a.59.59 0 0 1 1.165 0l.81 4.865a.768.768 0 0 0 1.523-.203l-.845-8.451A1.5 1.5 0 0 1 10.5 5.5L13 2.284a.796.796 0 0 0-1.239-.998L9.634 3.84a.7.7 0 0 1-.33.235c-.23.074-.665.176-1.304.176-.64 0-1.074-.102-1.305-.176a.7.7 0 0 1-.329-.235L4.239 1.286a.796.796 0 0 0-1.24.998l2.5 3.216c.317.316.475.758.43 1.204Z" />
                                    </svg>
                                    <span onClick={goClient}>Cliente: {params.cita.cliente}</span>
                                </div>
                            </div>
                            <div className='col-lg-6 col-md-6 col-sm-12 col-12'>
                                <div style={{ display: "flex", marginTop: '0.5em' }} className="card-title">
                                    <svg style={{ marginTop: '0.2em', marginRight: '0.5em' }} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-telephone-fill" viewBox="0 0 16 16">
                                        <path fillRule="evenodd" d="M1.885.511a1.745 1.745 0 0 1 2.61.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.68.68 0 0 0 .178.643l2.457 2.457a.68.68 0 0 0 .644.178l2.189-.547a1.75 1.75 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.6 18.6 0 0 1-7.01-4.42 18.6 18.6 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877z" />
                                    </svg>
                                    <span>Telefono: {params.cita.telefono}</span>
                                </div>
                            </div>
                            <div className='col-lg-6 col-md-6 col-sm-12 col-12'>
                                <div style={{ display: "flex", marginTop: '0.5em' }} className="card-title">
                                    <svg style={{ marginTop: '0.2em', marginRight: '0.5em' }} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-envelope" viewBox="0 0 16 16">
                                        <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1zm13 2.383-4.708 2.825L15 11.105zm-.034 6.876-5.64-3.471L8 9.583l-1.326-.795-5.64 3.47A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.741M1 11.105l4.708-2.897L1 5.383z" />
                                    </svg>
                                    <span>Email: {params.cita.email}</span>
                                </div>
                            </div>
                            <div className='col-lg-6 col-md-6 col-sm-12 col-12'>
                                <div style={{ display: "flex", marginTop: '0.5em' }} className="card-title">
                                    <svg style={{ marginTop: '0.2em', marginRight: '0.5em' }} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-person-check-fill" viewBox="0 0 16 16">
                                        <path fillRule="evenodd" d="M15.854 5.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 0 1 .708-.708L12.5 7.793l2.646-2.647a.5.5 0 0 1 .708 0" />
                                        <path d="M1 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6" />
                                    </svg>
                                    <span>Profesional: {params.cita.profesional_selected.nombre}</span>
                                </div>
                            </div>
                            <div className='col-lg-6 col-md-6 col-sm-12 col-12'>
                                <div style={{ display: "flex", marginTop: '0.5em' }} className="card-title">
                                    <svg style={{ marginTop: '0.2em', marginRight: '0.5em' }} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-dash" viewBox="0 0 16 16">
                                        <path d="M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8" />
                                    </svg>
                                    <span>Cita: {params.cita.estado_cita}</span>
                                </div>
                            </div>
                            <div className='col-12'>
                                <p style={{ textAlign: 'justify' }}>
                                    {params.cita.comentario}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div style={{ textAlign: 'center', margin: '1.5em' }} >
                        <SecondaryButton id="btnCancelarDialogoDetalleCita" style={{ marginRight: '1em' }} type="button" className="btn btn-secondary" data-dismiss="modal">Cancelar</SecondaryButton>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DetallesCita