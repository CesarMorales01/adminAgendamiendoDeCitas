import React from 'react'
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import { useState, useEffect } from 'react';
import Swal from 'sweetalert2'
import SelectClientes from '../Shopping/SelectClientes';

const NewCitaModal = (params) => {

    const [newCita, setNewCita] = useState({
        fecha: '',
        hora: '',
        cliente: '',
        idCliente: '',
        email: '',
        telefono: '',
        comentario: '',
        profesional_selected: '',
        nombre_profesional_selected: '',
        profesionales_disponibles: []
    })

    useEffect(() => {
        if (newCita.hora != params.datosCita.hora || newCita.fecha != params.datosCita.fecha || params.datosCita.profesionales_disponibles!=newCita.profesionales_disponibles) {
            setNewCita((valores) => ({
                ...valores,
                fecha: params.datosCita.fecha,
                hora: params.datosCita.hora,
                profesionales_disponibles: params.datosCita.profesionales_disponibles
            }))
        }
    })

    function getNombreProfesional(id) {
        let nombre = null;
        newCita.profesionales_disponibles.forEach(element => {
            if (id == element.id) {
                nombre = element.nombre
            }
        })
        return nombre
    }

    function cambioNombre(e) {
        setNewCita((valores) => ({
            ...valores,
            cliente: e.target.value
        }))
        if (newCita.profesional_selected == "") {
            setNewCita((valores) => ({
                ...valores,
                profesional_selected: newCita.profesionales_disponibles[0].id,
                nombre_profesional_selected: getNombreProfesional(newCita.profesionales_disponibles[0].id)
            }))
        }
    }

    function cambioTelefono(e) {
        setNewCita((valores) => ({
            ...valores,
            telefono: e.target.value
        }))
    }

    function cambioEmail(e) {
        setNewCita((valores) => ({
            ...valores,
            email: e.target.value
        }))
    }

    function cambioComentario(e) {
        setNewCita((valores) => ({
            ...valores,
            comentario: e.target.value
        }))
    }

    function cambioProfesional(e) {
        setNewCita((valores) => ({
            ...valores,
            profesional_selected: e.target.value,
            nombre_profesional_selected: getNombreProfesional(e.target.value)
        }))
    }

    function loadingOn() {
        document.getElementById('btnConfirmarCita').style.display = 'none'
        document.getElementById('btnLoadingConfirmarCita').style.display = ''
    }

    function sweetAlert(mensaje) {
        Swal.fire({
            title: mensaje,
            icon: 'warning',
            timer: 1000,
        })
    }

    function validarInfo() {
        if (newCita.nombre == "" || newCita.email == "") {
            sweetAlert("Ingresa nombre y/o email")
        } else {
            loadingOn()
            fetchAgendarCita()
        }
    }

    function fetchAgendarCita() {
        const url = params.url + 'calendar/registrarcita?_token=' + params.datosCita.token
        fetch(url, {
            method: 'POST',
            body: JSON.stringify(newCita),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then((response) => {
            return response.json()
        }).then((json) => {
            if (json) {
                Swal.fire({
                    title: "La cita para " + newCita.cliente + " ha sido agendada.",
                    html: params.datosCita.fechaFormatoCo + `,
                        <br>
                        a las `+ newCita.hora + `,
                        <br>
                        con el profesional `+ newCita.nombre_profesional_selected + `.
                        <br>
                         `,
                    icon: "success",
                    confirmButtonText: "Ok",
                }).then((result) => {
                    window.location = params.url + 'calendar'
                })
            } else {
                sweetAlert("Ha habido un error en el registro...")
            }
        })
    }

    function getCliente(e) {
        let cliente = null
        for (let i = 0; i < params.clientes.length; i++) {
            if (e.target.value == params.clientes[i].id) {
                cliente = params.clientes[i]
            }
        }
        let nombreCliente = ''
        if (cliente) {
            nombreCliente = cliente.nombre
            if (cliente.apellidos != undefined) {
                nombreCliente = cliente.nombre + " " + cliente.apellidos
            }
        }
        setNewCita((valores) => ({
            ...valores,
            cliente: nombreCliente,
            idCliente: cliente.id,
            email: cliente.keys.email != null ? cliente.keys.email : '',
            telefono: cliente.telefonos.length > 0 ? cliente.telefonos[0].telefono : ''
        }))
        if (newCita.profesional_selected == "") {
            setNewCita((valores) => ({
                ...valores,
                profesional_selected: newCita.profesionales_disponibles[0].id,
                nombre_profesional_selected: getNombreProfesional(newCita.profesionales_disponibles[0].id)
            }))
        }
    }

    return (
        <div className="modal fade bd-example-modal-lg" id='dialogoNuevaCita' tabIndex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true">
            <div className="modal-dialog modal-lg modal-dialog-centered">
                <div className="modal-content">
                    <input type="hidden" name='_token' defaultValue={params.datosCita.token} />
                    <h1 style={{ fontSize: '1.2em', textAlign: 'center', marginTop: '1em', fontWeight: 'bold' }}>Agendar cita</h1>
                    <div className='container' style={{ margin: '0.2em' }}>
                        <div className='row'>
                            <div className='col-12'>
                                <div style={{ display: "flex", marginTop: '0.5em' }} className="card-title">
                                    <svg style={{ marginTop: '0.2em', marginRight: '0.5em' }} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-calendar3" viewBox="0 0 16 16">
                                        <path d="M14 0H2a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2M1 3.857C1 3.384 1.448 3 2 3h12c.552 0 1 .384 1 .857v10.286c0 .473-.448.857-1 .857H2c-.552 0-1-.384-1-.857z" />
                                        <path d="M6.5 7a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2m-9 3a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2m-9 3a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2" />
                                    </svg>
                                    <span>Dia: {params.datosCita.fechaFormatoCo}</span>
                                </div>
                            </div>
                            <div className='col-12'>
                                <div style={{ display: "flex", marginTop: '0.5em' }} className="card-title">
                                    <svg style={{ marginTop: '0.2em', marginRight: '0.5em' }} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-alarm" viewBox="0 0 16 16">
                                        <path d="M8.5 5.5a.5.5 0 0 0-1 0v3.362l-1.429 2.38a.5.5 0 1 0 .858.515l1.5-2.5A.5.5 0 0 0 8.5 9z" />
                                        <path d="M6.5 0a.5.5 0 0 0 0 1H7v1.07a7.001 7.001 0 0 0-3.273 12.474l-.602.602a.5.5 0 0 0 .707.708l.746-.746A6.97 6.97 0 0 0 8 16a6.97 6.97 0 0 0 3.422-.892l.746.746a.5.5 0 0 0 .707-.708l-.601-.602A7.001 7.001 0 0 0 9 2.07V1h.5a.5.5 0 0 0 0-1zm1.038 3.018a6 6 0 0 1 .924 0 6 6 0 1 1-.924 0M0 3.5c0 .753.333 1.429.86 1.887A8.04 8.04 0 0 1 4.387 1.86 2.5 2.5 0 0 0 0 3.5M13.5 1c-.753 0-1.429.333-1.887.86a8.04 8.04 0 0 1 3.527 3.527A2.5 2.5 0 0 0 13.5 1" />
                                    </svg>
                                    <span>Hora: {params.datosCita.hora}:00</span>
                                </div>
                            </div>
                            <div className='col-12'>
                                <div style={{ display: "flex", marginTop: '0.5em' }} className="card-title">
                                    <svg style={{ marginTop: '0.2em', marginRight: '0.5em' }} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-person-check-fill" viewBox="0 0 16 16">
                                        <path fillRule="evenodd" d="M15.854 5.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 0 1 .708-.708L12.5 7.793l2.646-2.647a.5.5 0 0 1 .708 0" />
                                        <path d="M1 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6" />
                                    </svg>
                                    Profesional:
                                </div>
                                {newCita.profesionales_disponibles.length > 0 ?
                                    <select id='selectProfesional' value={newCita.profesional_selected} onClick={cambioProfesional} onChange={cambioProfesional} style={{ marginBottom: '1em', width: '60%' }} name='profesional' className="form-select rounded" >
                                        {newCita.profesionales_disponibles.map((item, index) => {
                                            return (
                                                <option key={index} value={item.id} >{item.nombre}</option>
                                            )
                                        })}
                                    </select>
                                    :
                                    ''
                                }
                            </div>
                            <h1 style={{ textAlign: 'center', marginTop: '0.5em', fontWeight: 'bold' }}>Datos de cliente:</h1>
                            <div className="col-12" >
                                <p style={{ textAlign: 'justify', color: 'black', marginTop: '0.4em' }}>Seleccionar cliente (Opcional)</p>
                                <SelectClientes getCliente={getCliente} clientes={params.clientes}></SelectClientes>
                            </div>

                            <div className="col-lg-6 col-sm-6" >
                                <p style={{ textAlign: 'justify', color: 'black', marginTop: '0.5em' }}>Nombre</p>
                                <input type="text" name='nombre' onChange={cambioNombre} className="form-control rounded" value={newCita.cliente == '' ? '' : newCita.cliente} />
                            </div>
                            <div className="col-lg-6 col-sm-6" >
                                <p style={{ textAlign: 'justify', color: 'black', marginTop: '0.5em' }}>telefono</p>
                                <input type="text" name='telefono' onChange={cambioTelefono} className="form-control rounded" value={newCita.telefono == '' ? '' : newCita.telefono} />
                            </div>
                            <div className="col-lg-6 col-sm-12" >
                                <p style={{ textAlign: 'justify', color: 'black', marginTop: '0.5em' }}>E-mail</p>
                                <input type="email" name='email' onChange={cambioEmail} className="form-control rounded" value={newCita.email == '' ? '' : newCita.email} />
                            </div>
                            <div className="col-lg-6 col-sm-12" >
                                <p style={{ textAlign: 'justify', color: 'black', marginTop: '0.5em' }}>Comentarios</p>
                                <textarea name='comentario' onChange={cambioComentario} rows="2" className="form-control" value={newCita.comentario == '' ? '' : newCita.comentario}></textarea>
                            </div>
                        </div>
                    </div>
                    <div style={{ textAlign: 'center', margin: '1.5em' }} >
                        <SecondaryButton style={{ marginRight: '1em' }} type="button" className="btn btn-secondary" data-dismiss="modal">Cancelar</SecondaryButton>
                        <PrimaryButton onClick={validarInfo} id="btnConfirmarCita" style={{ marginLeft: '1em' }} className="btn btn-success">Confirmar</PrimaryButton>
                        <PrimaryButton id='btnLoadingConfirmarCita' style={{ display: 'none', backgroundColor: 'red', marginLeft: '1em' }} className="btn btn-primary" type="button" disabled>
                            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                            Loading...
                        </PrimaryButton>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default NewCitaModal