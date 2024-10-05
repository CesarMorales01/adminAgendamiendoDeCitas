import React from 'react'
import { useState, useEffect } from 'react';
import GlobalFunctions from '../services/GlobalFunctions'
import SelectCategoriesNewIncome from '../Income/SelectCategoriesNewIncome';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import Swal from 'sweetalert2'

const NewProvider = (params) => {
    const glob = new GlobalFunctions()
    const [provider, setProvider] = useState({
        id: '',
        nombre: '',
        descripcion: '',
        direccion: '',
        telefono: '',
        email: ''
    })

    useEffect(() => {
        if (params.editarProveedor.id != provider.id) {
            setParamsProveedor()
        }
    })

    function setParamsProveedor() {
        setProvider((valores) => ({
            ...valores,
            id: params.editarProveedor.id,
            nombre: params.editarProveedor.nombre,
            descripcion: params.editarProveedor.descripcion,
            direccion: params.editarProveedor.direccion,
            telefono: params.editarProveedor.telefono,
            email: params.editarProveedor.email
        }))
    }

    function confirmarBorrar() {
        if (params.editarProveedor.productosEnInventario.length > 0) {
            sweetAlert('No puedes borrar este proveedor porque tiene unidades en inventario!')
        } else {
            Swal.fire({
                title: '¿Eliminar proveedor ' + provider.nombre +' ?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
                confirmButtonText: 'Si, eliminar!'
            }).then((result) => {
                if (result.isConfirmed) {
                    loadingOn()
                    document.getElementById('btnEliminar').click()
                }
            })
        }
    }

    function validar() {
        if (provider.nombre != '') {
            loadingOn()
            if (provider.id != '') {
                const form = document.getElementById("formCrear")
                form.setAttribute("method", "GET")
                form.action = route('provider.edit', provider.id)
                form.submit()
            } else {
                document.getElementById('formCrear').submit()
            }
        } else {
            sweetAlert('Ingresa nombre del proveedor!')
        }

    }

    function sweetAlert(mensaje) {
        Swal.fire({
            title: mensaje,
            icon: 'warning',
            timer: 1500,
        })
    }

    function cambioNombre(e) {
        setProvider((valores) => ({
            ...valores,
            nombre: e.target.value
        }))
    }

    function cambioComentario(e) {
        setProvider((valores) => ({
            ...valores,
            descripcion: e.target.value
        }))
    }

    function cambioDireccion(e) {
        setProvider((valores) => ({
            ...valores,
            direccion: e.target.value
        }))
    }

    function cambioTelefono(e) {
        setProvider((valores) => ({
            ...valores,
            telefono: e.target.value
        }))
    }

    function cambioEmail(e) {
        setProvider((valores) => ({
            ...valores,
            email: e.target.value
        }))
    }

    function loadingOn() {
        document.getElementById('btnAgregarIngreso').style.display = 'none'
        document.getElementById('btnAgregarIngresoLoading').style.display = ''
    }

    return (
        <div style={{ padding: '1em' }} className="modal fade bd-example-modal-lg" id='dialogoNewProvider' tabIndex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true">
            <div className="modal-dialog modal-lg">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title titulo" id="exampleModalLabel">{params.editarProveedor.id != '' ? 'Editar' : 'Nuevo'} proveedor</h5>
                        <button onClick={confirmarBorrar} id='btnDialogoEliminar' style={{ marginTop: '0.5em', display: params.editarProveedor.id == '' ? 'none' : '', backgroundColor: 'red' }} className="btn btn-danger" type="button">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash" viewBox="0 0 16 16">
                                <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" />
                                <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z" />
                            </svg>
                        </button>
                        <a id='btnEliminar' style={{ display: 'none' }} href={route('provider.show', provider.id == undefined ? '1' : provider.id)}></a>
                    </div>
                    <div className='container' style={{ margin: '0.2em' }}>
                        <form method="POST" id="formCrear" action={route('provider.store')} >
                            <input type="hidden" name='_token' value={params.token} />
                            <input type="hidden" name='id' value={provider.id} />
                            <br />
                            <label>Nombre proveedor:</label>
                            <input name='nombre' onChange={cambioNombre} className='form-control border rounded' type="text" placeholder='Nombre' value={provider.nombre} />
                            <br />
                            <label>Descripción (Opcional):</label>
                            <textarea name='descripcion' onChange={cambioComentario} className='form-control border rounded' placeholder='Descripcion' value={provider.descripcion}></textarea>
                            <br />
                            <br />
                            <label>Dirección (Opcional):</label>
                            <textarea name='direccion' onChange={cambioDireccion} className='form-control border rounded' placeholder='Direccion' value={provider.direccion}></textarea>
                            <br />
                            <label>Télefono (Opcional):</label>
                            <input name='telefono' onChange={cambioTelefono} placeholder='Télefono' className='form-control border rounded' type="text" value={provider.telefono} />
                            <br />
                            <br />
                            <label>E-mail (Opcional):</label>
                            <input name='email' onChange={cambioEmail} placeholder='E-mail' className='form-control border rounded' type="text" value={provider.email} />
                            <br />
                        </form>
                        <div style={{ marginTop: '1em', marginBottom: '1em' }} className="col text-center">
                            <div className="modal-footer">
                                <SecondaryButton type="button" style={{ backgroundColor: '#d22c21' }} data-dismiss="modal">Cancelar</SecondaryButton>
                                <PrimaryButton id='btnAgregarIngreso' onClick={validar} type="button" style={{ backgroundColor: '#228b22' }}>{params.editarProveedor.id != '' ? 'Editar' : 'Registrar'} proveedor</PrimaryButton>
                                <button id='btnAgregarIngresoLoading' style={{ display: 'none', backgroundColor: 'red' }} className="btn btn-primary" type="button" disabled>
                                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                    Loading...
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default NewProvider