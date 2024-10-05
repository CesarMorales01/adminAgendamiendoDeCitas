import React from 'react'
import GlobalFunctions from '../services/GlobalFunctions';
import { useState, useEffect } from 'react'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import PrimaryButton from '@/Components/PrimaryButton';
import Swal from 'sweetalert2'
import '../../../css/general.css'
import SelectClientes from '../Shopping/SelectClientes';

const NewCar = (params) => {

    const glob = new GlobalFunctions()
    const [newCar, setCar] = useState({
        tipo: 1,
        placa: '',
        marca: '',
        year: '',
        modelo: '',
        color: '',
        cliente: '',
        nombreCliente: ''
    })
    const [tipos] = useState([{ 'id': 1, 'tipo': 'Automovil' }, { 'id': 2, 'tipo': 'Camioneta' }, { 'id': 3, 'tipo': 'Camion' }])

    useEffect(() => {
        if (params.estado != '') {
            Swal.fire({
                title: params.estado,
                icon: 'warning',
                timer: 1000,
            })
        }
        if (params.car.id != '') {
            cargarDatos()
        }
    }, [])

    function cargarDatos() {
        setCar((valores) => ({
            ...valores,
            tipo: validarTipo(params.car.tipo_vehiculo),
            placa: params.car.placa,
            marca: params.car.marca,
            year: params.car.year,
            modelo: params.car.modelo,
            color: params.car.color,
            cliente: params.car.cliente == undefined ? "" : params.car.cliente.id,
            nombreCliente: params.car.cliente == undefined ? "" : params.car.cliente.nombre
        }))
    }

    function validarTipo(item){
        let tipo=1;
        if(item=="Camioneta"){
            tipo=2
        }
        if(item=="Camion"){
            tipo=3
        }
        return tipo
    }

    function cambioTipo(e) {
        setCar((valores) => ({
            ...valores,
            tipo: e.target.value
        }))
    }

    function cambioPlaca(e) {
        setCar((valores) => ({
            ...valores,
            placa: e.target.value
        }))
    }

    function cambioMarca(e) {
        setCar((valores) => ({
            ...valores,
            marca: e.target.value
        }))
    }

    function cambioYear(e) {
        setCar((valores) => ({
            ...valores,
            year: e.target.value
        }))
    }

    function cambioModelo(e) {
        setCar((valores) => ({
            ...valores,
            modelo: e.target.value
        }))
    }

    function cambioColor(e) {
        setCar((valores) => ({
            ...valores,
            color: e.target.value
        }))
    }

    function loadingOn() {
        document.getElementById('btnModificarUsuario').style.display = 'none'
        document.getElementById('btnLoadingUsuario').style.display = 'inline'
    }

    function loadingOff() {
        document.getElementById('btnModificarUsuario').style.display = 'inline'
        document.getElementById('btnLoadingUsuario').style.display = 'none'
    }

    function validarInfoDivUsuario(e) {
        e.preventDefault()
        if (newCar.tipo == '' || newCar.placa == '') {
            alertDatosFaltantes('Ingresa placa del vehiculo!')
        } else {
            loadingOn()
            // id vacio, crear nuevo
            if (params.car.id == '') {
                let placa = newCar.placa
                // LLenar variables porque con vacio el servidor da error
                if (placa == '') {
                    placa = "vacio"
                }
                const url = params.globalVars.myUrl + 'car/' + placa
                fetch(url)
                    .then((response) => {
                        return response.json()
                    }).then((json) => {
                        if (json == undefined) {
                            loadingOff()
                            alertDatosFaltantes('Ya existe un vehiculo con la placa ingresada!')
                        } else {
                            document.getElementById('formCrear').submit()
                        }
                    })
            } else {
                update()
            }
        }
    }

    function update() {
        const form = document.getElementById("formCrear")
        form.action = route('car.actualizar', params.car.id)
        form.submit()
    }

    function alertDatosFaltantes(mensaje) {
        Swal.fire({
            title: mensaje,
            icon: 'warning',
            showCancelButton: false,
            showConfirmButton: false,
            timer: 1500,
        })
    }

    function enviarBorrar() {
        document.getElementById('btnEliminar').click()
        loadingOn()
    }

    function abrirDialogoEliminar() {
        Swal.fire({
            title: '¿Eliminar este vehiculo?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Si, eliminar!'
        }).then((result) => {
            if (result.isConfirmed) {
                enviarBorrar()
            }
        })
    }

    function getCliente(e) {
        let nombre = ''
        let id = ''
        for (let i = 0; i < params.clientes.length; i++) {
            if (e.target.value == params.clientes[i].id) {
                let nom = params.clientes[i].nombre
                if (params.clientes[i].apellidos != null) {
                    nom = params.clientes[i].nombre + " " + params.clientes[i].apellidos
                }
                nombre = nom
                id = params.clientes[i].id
            }
        }
        setCar((valores) => ({
            ...valores,
            cliente: id,
            nombreCliente: nombre
        }))
    }

    return (
        <AuthenticatedLayout
            user={params.auth} globalVars={params.globalVars}
        >
            <Head title="Nuevo vehiculo" />
            <div className="container">
                <h1 style={{ marginTop: '0.5em', fontSize: '1.5em' }} id="titulo" className="text-center"> {params.car.id == '' ? 'Nuevo vehiculo' : 'Editar vehiculo'}</h1>
                <a id='btnEliminar' style={{ display: 'none' }} href={params.car.id != '' ? route('car.edit', params.car.id) : ''}></a>
                <form action={route('car.store')} id='formCrear' method='post' onSubmit={validarInfoDivUsuario} >
                    <input type="hidden" name='_token' value={params.token} />
                    <input type="hidden" name='cliente' value={newCar.cliente} />
                    <div id="div_datos_personales" style={{ backgroundColor: '#f4f4f4', padding: '0.4em' }}>
                        <div className="row justify-content-center" >
                            <div className="col-lg-6 col-sm-12" >
                                <br />
                                <p style={{ textAlign: 'justify', color: 'black' }}>Tipo de vehiculo</p>
                                <select value={newCar.tipo} onChange={cambioTipo} onClick={cambioTipo} name='tipo' className="form-select rounded" >
                                    {tipos.map((item, index) => {
                                        return (
                                            <option key={index} value={item.id} >{item.tipo}</option>
                                        )
                                    })}
                                </select>
                            </div>
                            <div className="col-lg-6 col-sm-12" >
                                <br />
                                <p style={{ textAlign: 'justify', color: 'black' }}>Placa</p>
                                <input type="text" name='placa' onChange={cambioPlaca} className="form-control rounded" value={newCar.placa == '' ? '' : newCar.placa} />
                            </div>
                            <div className="col-lg-6 col-sm-12" >
                                <br />
                                <p style={{ textAlign: 'justify', color: 'black' }}>Marca</p>
                                <input type="text" name='marca' onChange={cambioMarca} className="form-control rounded" value={newCar.marca == '' ? '' : newCar.marca} />
                            </div>
                            <div className="col-lg-6 col-sm-12" >
                                <br />
                                <p style={{ textAlign: 'justify', color: 'black' }}>Año</p>
                                <input type="text" name='year' onChange={cambioYear} className="form-control rounded" value={newCar.year == '' ? '' : newCar.year} />
                            </div>
                            <div className="col-lg-6 col-sm-12" >
                                <br />
                                <p style={{ textAlign: 'justify', color: 'black' }}>Modelo</p>
                                <input type="text" name='modelo' onChange={cambioModelo} className="form-control rounded" value={newCar.modelo == '' ? '' : newCar.modelo} />
                            </div>
                            <div className="col-lg-6 col-sm-12" >
                                <br />
                                <p style={{ textAlign: 'justify', color: 'black' }}>Color</p>
                                <input type="text" name='color' onChange={cambioColor} className="form-control rounded" value={newCar.color == '' ? '' : newCar.color} />
                            </div>
                            <div className="col-lg-12 col-sm-12" >
                                <br />
                                <strong style={{ fontSize: '1em' }} >Seleccionar cliente</strong>
                                <SelectClientes getCliente={getCliente} clientes={params.clientes}></SelectClientes>
                                <input type="text" style={{ marginTop: '0.2em' }} readOnly className="form-control rounded" value={newCar.nombreCliente == '' ? '' : newCar.nombreCliente} />
                            </div>
                        </div>
                        <div style={{ textAlign: 'center', marginTop: '1em' }} className="row justify-content-center">
                            <div className="col-12" >
                                <PrimaryButton type='submit' id="btnModificarUsuario">{params.car.id == '' ? 'Registrar vehiculo' : 'Editar vehiculo'}</PrimaryButton>
                                <button id='btnLoadingUsuario' style={{ display: 'none', backgroundColor: 'green' }} className="btn btn-primary" type="button" disabled>
                                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                    Loading...
                                </button>
                            </div>
                            <br /><br />
                            <div className="col-12" >
                                <button onClick={abrirDialogoEliminar} id='btnDialogoEliminar' style={{ marginTop: '0.5em', display: params.car.id == '' ? 'none' : 'inline', backgroundColor: 'red' }} className="btn btn-danger" type="button">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash" viewBox="0 0 16 16">
                                        <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" />
                                        <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    )

}

export default NewCar