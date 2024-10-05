import React from 'react'
import { useState, useEffect } from 'react';
import GlobalFunctions from '../services/GlobalFunctions'
import { Head } from '@inertiajs/react';
import '../../../css/general.css'
import logoAgendar from '../../../../public/Images/Config/agenda.png'
import logoHorario from '../../../../public/Images/Config/logoHorario.webp'
import logoProfesionales from '../../../../public/Images/Config/profesionales_logo.png'
import NewCitaModal from './NewCitaModal';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import DialogoLoading from '../UIGeneral/DialogoLoading';
import DetallesCita from './DetallesCita'
import Swal from 'sweetalert2'
import ConfigHorario from './ConfigHorario';
import ConfigProfesionales from './ConfigProfesionales';

const Calendario = (params) => {

    const glob = new GlobalFunctions()
    const [datosCita, setDatosCita] = useState({
        fecha: null,
        fechaFormatoCo: '',
        hora: '',
        profesionales_disponibles: [],
        token: params.tokenFormu
    })
    const [detallesCita, setDetallesCita] = useState({
        id: '',
        fecha: '',
        hora: '',
        cliente: '',
        idCliente: '',
        email: '',
        telefono: '',
        comentario: '',
        profesional_selected: '',
        background: ''
    })
    const [horario, setHorario] = useState(params.horarios_disponibles.agenda)
    const [cargar, setCargar] = useState(false)
    const estados = ['Pendiente', 'Atendida', 'Cancelada']

    const [profesionales, setProfesionales] = useState({
        lista: []
    })
    const [newProfesional, setNewProfesional] = useState({
        id: '',
        enable: true,
        nombre: ''
    })

    useEffect(() => {
        setFecha()

        cargarProfesionales()

    }, [])

    useEffect(() => {
        if (cargar) {
            fetchCambioFecha()
        }
    }, [datosCita.fecha])



    function cargarProfesionales() {
        const array = []
        params.configProfesionales.forEach(element => {
            const objeto = {
                id: element.id,
                nombre: element.nombre,
                enable: element.enable
            }
            array.push(objeto)
        })
        setProfesionales((valores) => ({
            ...valores,
            lista: array
        }))
    }

    function fetchCambioFecha() {
        document.getElementById('btnModalLoading').click()
        const url = params.globalVars.myUrl + 'calendar/' + datosCita.fecha
        fetch(url).then((response) => {
            return response.json()
        }).then((json) => {
            setCargar(false)
            setHorario(json.agenda)
            document.getElementById('btnCloseModalLoading').click()
        })
    }

    function setFecha() {
        const fechaHoy = glob.getFecha()
        document.getElementById('inputDate').value = fechaHoy
        setTimeout(() => {
            if (datosCita.fecha === null) {
                setDatosCita((valores) => ({
                    ...valores,
                    fecha: fechaHoy,
                    fechaFormatoCo: glob.getFormatoFechaCo(fechaHoy)
                }))
            }
        }, 100);
    }

    function cambioFecha(e) {
        setDatosCita((valores) => ({
            ...valores,
            fecha: e.target.value,
            fechaFormatoCo: glob.getFormatoFechaCo(e.target.value)
        }))
        setCargar(true)
    }

    function cambioHora(e) {
        setDatosCita((valores) => ({
            ...valores,
            hora: e.hora,
            profesionales_disponibles: e.profesionalesDisponibles
        }))
        document.getElementById('btnDialogoNuevaCita').click()
    }

    function cambioEstadoCita(e, item) {
        document.getElementById('btnModalLoading').click()
        const url = params.globalVars.myUrl + 'calendar?_token=' + params.tokenFormu
        const objeto = {
            'fecha': datosCita.fecha,
            'idCita': item.id,
            'estado': e.target.value
        }
        fetch(url, {
            method: 'POST',
            body: JSON.stringify(objeto),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then((response) => {
            return response.json()
        }).then((json) => {
            document.getElementById('btnCloseModalLoading').click()
            if (json) {

                setHorario(json.agenda)
            } else {
                alertError('Ha ocurrido un error...')
            }
        })
    }

    function alertError(mensaje) {
        Swal.fire({
            title: mensaje,
            icon: 'warning',
            timer: 1000,
        })
    }

    function alertErrorLonger(mensaje) {
        Swal.fire({
            title: mensaje,
            icon: 'warning',
            timer: 2000,
        })
    }

    function getBackgroudCita(cita) {
        let back = "#95c799"
        if (cita.estado_cita == "Cancelada") {
            back = "#ffbfab"
        }
        if (cita.estado_cita == "Atendida") {
            back = "#3692ff"
        }
        return back
    }

    function getFechaDiaAnterior() {
        const fecha = glob.formatFecha(operarDias(new Date(datosCita.fecha), -0, 5)).split("-")
        return fecha[0] + "-" + fecha[1] + "-" + fecha[2]
    }

    function diaAnterior() {
        setCargar(true)
        setDatosCita((valores) => ({
            ...valores,
            fecha: getFechaDiaAnterior(),
            fechaFormatoCo: glob.getFormatoFechaCo(getFechaDiaAnterior())
        }))
        document.getElementById('inputDate').value = getFechaDiaAnterior()
    }

    function operarDias(fecha, dias) {
        fecha.setDate(fecha.getDate() + dias);
        return fecha;
    }

    function diaSiguiente() {
        setCargar(true)
        let fecha = glob.formatFecha(operarDias(new Date(datosCita.fecha), 2)).split("-")
        setDatosCita((valores) => ({
            ...valores,
            fecha: fecha[0] + "-" + fecha[1] + "-" + fecha[2],
            fechaFormatoCo: glob.getFormatoFechaCo(fecha[0] + "-" + fecha[1] + "-" + fecha[2])
        }))
        document.getElementById('inputDate').value = fecha[0] + "-" + fecha[1] + "-" + fecha[2]
    }

    function abrirDialogoDetallesCita(cita) {
        setDetallesCita((valores) => ({
            ...valores,
            id: cita.id,
            hora: cita.inicio,
            fecha: glob.getFormatoFechaCo(cita.fecha),
            cliente: cita.cliente,
            idCliente: cita.idCliente != null ? cita.idCliente : '',
            email: cita.email,
            telefono: cita.telefono,
            comentario: cita.comentario,
            profesional_selected: cita.profesional,
            background: getBackgroudCita(cita),
            estado_cita: cita.estado_cita
        }))
        document.getElementById('btnDialogoDetallesCita').click()
    }

    function functionEliminarCita(cita) {
        document.getElementById('btnModalLoading').click()
        const url = params.globalVars.myUrl + 'calendar/' + cita.id + '/edit'
        fetch(url).then((response) => {
            return response.json()
        }).then((json) => {
            document.getElementById('btnCloseModalLoading').click()
            if (json) {
                alertError('¡La cita ha sido eliminada!')
                setHorario(json.agenda)
            } else {
                alertError('Ha ocurrido un error...')
            }
        })
    }

    function fetchSaveConfigHorario(lista) {
        document.getElementById('btnModalLoading').click()
        const url = params.globalVars.myUrl + 'configcalendar/updatehorario?_token=' + params.tokenFormu
        const objeto = {
            config: lista,
            fecha: datosCita.fecha
        }
        fetch(url, {
            method: 'POST',
            body: JSON.stringify(objeto),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then((response) => {
            return response.json()
        }).then((json) => {
            setHorario(json.agenda)
            document.getElementById('btnCloseModalLoading').click()
        })
    }


    function abrirDialogoEliminarProfesional() {
        Swal.fire({
            title: '¿Eliminar el profesional ' + newProfesional.nombre + ' ?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Si, eliminar!'
        }).then((result) => {
            if (result.isConfirmed) {
                document.getElementById('btnNewProfesionalModal').click()
                fetchEliminarProfesional()
            }
        })
    }

    function fetchEliminarProfesional() {
        loadingOnNewProfesionalModal()
        const objeto = {
            idProfesional: newProfesional.id,
            fecha: datosCita.fecha
        }
        const url = params.globalVars.myUrl + 'profesionales/eliminar?_token=' + params.tokenFormu
        fetch(url, {
            method: 'post',
            body: JSON.stringify(objeto),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then((response) => {
            return response.json()
        }).then((json) => {
            document.getElementById('btnIngresarProfesional').style.display = ''
            document.getElementById('btnLoadingIngresarProfesional').style.display = 'none'
            if (json.respuesta == '¡Profesional eliminado!') {
                setProfesionales((valores) => ({
                    ...valores,
                    lista: json.configProfesionales
                }))
                setHorario(json.agenda)
                alertError(json.respuesta)
            } else {
                alertErrorLonger(json.respuesta)
            }
        })
    }

    function cambioHabilitarProfesional(event, item) {
        document.getElementById('spinnerEnable' + item.id).style.display = ''
        document.getElementById('checkEnable' + item.id).style.display = 'none'
        const objeto = {
            id: item.id,
            enable: event.target.checked ? true : false,
            fecha: datosCita.fecha
        }
        const url = params.globalVars.myUrl + 'profesionales/habilitar?_token=' + params.tokenFormu
        fetch(url, {
            method: 'post',
            body: JSON.stringify(objeto),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then((response) => {
            return response.json()
        }).then((json) => {
            setProfesionales((valores) => ({
                ...valores,
                lista: json.configProfesionales
            }))
            setHorario(json.agenda)
            document.getElementById('spinnerEnable' + item.id).style.display = 'none'
            document.getElementById('checkEnable' + item.id).style.display = ''
        })
    }

    function abrirDialogoNewProfesional(object) {
        if (object.id != "") {
            setNewProfesional((valores) => ({
                ...valores,
                id: object.id,
                nombre: object.nombre,
            }))
        } else {
            setNewProfesional((valores) => ({
                ...valores,
                id: '',
                nombre: '',
            }))
        }
        document.getElementById('btnNewProfesionalModal').click()
    }

    function cambioNombreProfesional(event) {
        setNewProfesional((valores) => ({
            ...valores,
            nombre: event.target.value,
        }))
    }

    function loadingOnNewProfesionalModal() {
        document.getElementById('btnIngresarProfesional').style.display = 'none'
        document.getElementById('btnLoadingIngresarProfesional').style.display = ''
    }

    function loadingOffNewProfesionalModal() {
        document.getElementById('btnIngresarProfesional').style.display = ''
        document.getElementById('btnLoadingIngresarProfesional').style.display = 'none'
        document.getElementById('btnNewProfesionalModal').click()
    }

    function validarRegistroEditProfesional(e) {
        e.preventDefault()
        if (newProfesional.id == '') {
            registrarProfesional()
        } else {
            fetchEditarProfesional()
        }
    }

    function fetchEditarProfesional() {
        loadingOnNewProfesionalModal()
        const url = params.globalVars.myUrl + 'profesionales/editar?_token=' + params.tokenFormu
        const objeto = {
            newProfesional: newProfesional,
            fecha: datosCita.fecha
        }
        fetch(url, {
            method: 'POST',
            body: JSON.stringify(objeto),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then((response) => {
            return response.json()
        }).then((json) => {
            setHorario(json.agenda)
            setProfesionales((valores) => ({
                ...valores,
                lista: json.configProfesionales
            }))
            loadingOffNewProfesionalModal()
        })
    }

    function registrarProfesional() {
        loadingOnNewProfesionalModal()
        const url = params.globalVars.myUrl + 'profesionales?_token=' + params.tokenFormu
        const objeto = {
            newProfesional: newProfesional,
            fecha: datosCita.fecha
        }
        fetch(url, {
            method: 'POST',
            body: JSON.stringify(objeto),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then((response) => {
            return response.json()
        }).then((json) => {
            setHorario(json.agenda)
            setProfesionales((valores) => ({
                ...valores,
                lista: json.configProfesionales
            }))
            loadingOffNewProfesionalModal()
        })
    }
   
    return (
        <AuthenticatedLayout user={params.auth} globalVars={params.globalVars}>
            <Head title="Agenda" />
            <div className="py-2">
                <div className="overflow-hidden shadow-sm sm:rounded-lg py-3">
                    <div className="container">
                        <h1 className='titulo' style={{ textAlign: 'center', marginBottom: '1em' }}><strong>Agendamiento de citas</strong></h1>
                        <ConfigProfesionales abrirDialogoNewProfesional={abrirDialogoNewProfesional} profesionales={profesionales}
                            abrirDialogoEliminarProfesional={abrirDialogoEliminarProfesional}
                            validarRegistroEditProfesional={validarRegistroEditProfesional} cambioNombreProfesional={cambioNombreProfesional}
                            newProfesional={newProfesional} cambioHabilitarProfesional={cambioHabilitarProfesional}
                        >
                        </ConfigProfesionales>
                        <div className="row ">
                            <div data-toggle="modal" data-target="#dialogoConfigHorario" style={{ marginBottom: '1em' }} className="col-lg-4 col-md-4 col-sm-6 col-6"  >
                                <div className="card border border-primary card-little-flyer pointer">
                                    <img style={{ width: '6em', height: 'auto', marginTop: '1em' }} src={logoHorario} className="card-img-top img-fluid centerImg" alt="" />
                                    <div style={{ textAlign: 'center' }} className="card-body">
                                        <h2 style={{ fontWeight: 'bold' }}>
                                            Configurar 
                                            <br style={{ display: window.screen.width > 600 ? 'none' : '' }}/>
                                            horario</h2>
                                    </div>
                                </div>
                            </div>
                            <div data-toggle="modal" data-target="#configProfesionalesModal" style={{ marginBottom: '1em' }} className="col-lg-4 col-md-4 col-sm-6 col-6"  >
                                <div className="card border border-primary card-flyer pointer">
                                    <img style={{ width: '6em', height: 'auto', marginTop: '1em' }} src={logoProfesionales} className="card-img-top img-fluid centerImg" alt="" />
                                    <div style={{ textAlign: 'center' }} className="card-body">
                                        <h2 style={{ fontWeight: 'bold' }}>Configurar profesionales</h2>
                                    </div>
                                </div>
                            </div>
                            <div className='col-lg-4 col-md-12 col-12 col-sm-12'>
                                <label style={{ marginTop: '0.2em', marginLeft: '1.1em' }}>Mostrar calendario para: {datosCita.fechaFormatoCo}</label>
                                <br />
                                <div style={{ textAlign: 'center', marginTop: '0.2em' }} className='row'>
                                    <div className="col-3">
                                        <button onClick={diaAnterior} className='border border-dark rounded cursorPointer' style={{ marginTop: '0.2em', marginLeft: '0.2em', padding: '0.5em', backgroundColor: '#00722e' }} id="btn_buscar">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-arrow-left-circle" viewBox="0 0 16 16">
                                                <path fillRule="evenodd" d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8zm15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-4.5-.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H11.5z" />
                                            </svg>
                                        </button>
                                    </div>
                                    <div className="col-6">
                                        <input type="date" className='rounded' onChange={cambioFecha} name="fecha" id="inputDate" />
                                    </div>
                                    <div className="col-3">
                                        <button onClick={diaSiguiente} className='border border-dark rounded cursorPointer' style={{ marginTop: '0.2em', marginLeft: '0.2em', padding: '0.5em', backgroundColor: '#00722e' }} id="btn_buscar">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-arrow-right-circle" viewBox="0 0 16 16">
                                                <path fillRule="evenodd" d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8zm15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM4.5 7.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H4.5z" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <br />
                        <div style={{ margin: '0.1em', backgroundColor: datosCita.fecha < glob.getFecha() ? '#c6c6c6' : '' }} className="row justify-content-center" >
                            {horario.length == 0 ?
                                <span style={{ textAlign: 'center' }}>Lo sentimos, no tenemos aun un horario disponible para este dia...</span>
                                :
                                horario.map((item, index) => {
                                    let mostrarCitas = ""
                                    if (item.citasAgendadas.length == 0) {
                                        mostrarCitas = "none"
                                    }
                                    return (
                                        <div className="col-12 rounded" key={index}>
                                            <div style={{ marginBottom: '1em', display: mostrarCitas }}  >
                                                {/*Si hay profesionales disponibles, se puede mostrar disponible la hora para agendar cita.*/}
                                                {item.profesionalesDisponibles.length > 0 ?
                                                    <div style={{ marginBottom: '1em' }} onClick={() => cambioHora(item)} >
                                                        <div className='row justify-content-between border border-success card-little-flyer pointer rounded'>
                                                            <div style={{ alignContent: 'center' }} className='col-4 d-flex justify-content-center'>
                                                                <img style={{ width: '2em', height: 'auto', margin: '0.2em' }} src={logoAgendar} className="card-img-left img-fluid" alt="" />
                                                            </div>
                                                            <div className='col-4 align-self-center d-flex justify-content-center'>
                                                                <div style={{ color: item.disponible ? 'green' : "black", display: "flex", marginTop: '0.5em' }} className="card-title">
                                                                    <svg style={{ marginTop: '0.2em', marginRight: '0.5em' }} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-alarm" viewBox="0 0 16 16">
                                                                        <path d="M8.5 5.5a.5.5 0 0 0-1 0v3.362l-1.429 2.38a.5.5 0 1 0 .858.515l1.5-2.5A.5.5 0 0 0 8.5 9z" />
                                                                        <path d="M6.5 0a.5.5 0 0 0 0 1H7v1.07a7.001 7.001 0 0 0-3.273 12.474l-.602.602a.5.5 0 0 0 .707.708l.746-.746A6.97 6.97 0 0 0 8 16a6.97 6.97 0 0 0 3.422-.892l.746.746a.5.5 0 0 0 .707-.708l-.601-.602A7.001 7.001 0 0 0 9 2.07V1h.5a.5.5 0 0 0 0-1zm1.038 3.018a6 6 0 0 1 .924 0 6 6 0 1 1-.924 0M0 3.5c0 .753.333 1.429.86 1.887A8.04 8.04 0 0 1 4.387 1.86 2.5 2.5 0 0 0 0 3.5M13.5 1c-.753 0-1.429.333-1.887.86a8.04 8.04 0 0 1 3.527 3.527A2.5 2.5 0 0 0 13.5 1" />
                                                                    </svg>
                                                                    <span>{item.hora}</span>
                                                                </div>
                                                            </div>
                                                            <div className='col-4 align-self-center d-flex justify-content-center'>
                                                                <button className='btn btn-success btn-sm'>Agendar</button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    :
                                                    ""
                                                }
                                                {/*Mostrar citas programadas*/}
                                                {item.citasAgendadas.map((item1, index1) => {
                                                    return (
                                                        <div className='col-12 rounded border border-primary card-little-flyer pointer row' key={index1} style={{ marginBottom: '1em', backgroundColor: getBackgroudCita(item1), width: window.screen.width < 600 ? '106%' : '102%' }} >
                                                            <div className='col-lg-6 col-md-6 col-sm-12 col-12'>
                                                                <div style={{ display: "flex", marginTop: '0.5em' }} className="card-title">
                                                                    <svg style={{ marginTop: '0.2em', marginRight: '0.5em' }} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-person-arms-up" viewBox="0 0 16 16">
                                                                        <path d="M8 3a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3" />
                                                                        <path d="m5.93 6.704-.846 8.451a.768.768 0 0 0 1.523.203l.81-4.865a.59.59 0 0 1 1.165 0l.81 4.865a.768.768 0 0 0 1.523-.203l-.845-8.451A1.5 1.5 0 0 1 10.5 5.5L13 2.284a.796.796 0 0 0-1.239-.998L9.634 3.84a.7.7 0 0 1-.33.235c-.23.074-.665.176-1.304.176-.64 0-1.074-.102-1.305-.176a.7.7 0 0 1-.329-.235L4.239 1.286a.796.796 0 0 0-1.24.998l2.5 3.216c.317.316.475.758.43 1.204Z" />
                                                                    </svg>
                                                                    <span>Cliente: {item1.cliente}</span>
                                                                </div>
                                                            </div>
                                                            <div className='col-lg-6 col-md-6 col-sm-12 col-12'>
                                                                <div style={{ display: "flex", marginTop: '0.5em' }} className="card-title">
                                                                    <svg style={{ marginTop: '0.2em', marginRight: '0.5em' }} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-telephone-fill" viewBox="0 0 16 16">
                                                                        <path fillRule="evenodd" d="M1.885.511a1.745 1.745 0 0 1 2.61.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.68.68 0 0 0 .178.643l2.457 2.457a.68.68 0 0 0 .644.178l2.189-.547a1.75 1.75 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.6 18.6 0 0 1-7.01-4.42 18.6 18.6 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877z" />
                                                                    </svg>
                                                                    <span>Telefono: {item1.telefono}</span>
                                                                </div>
                                                            </div>
                                                            <div className='col-lg-6 col-md-6 col-sm-12 col-12'>
                                                                <div style={{ display: "flex", marginTop: '0.5em' }} className="card-title">
                                                                    <svg style={{ marginTop: '0.2em', marginRight: '0.5em' }} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-alarm" viewBox="0 0 16 16">
                                                                        <path d="M8.5 5.5a.5.5 0 0 0-1 0v3.362l-1.429 2.38a.5.5 0 1 0 .858.515l1.5-2.5A.5.5 0 0 0 8.5 9z" />
                                                                        <path d="M6.5 0a.5.5 0 0 0 0 1H7v1.07a7.001 7.001 0 0 0-3.273 12.474l-.602.602a.5.5 0 0 0 .707.708l.746-.746A6.97 6.97 0 0 0 8 16a6.97 6.97 0 0 0 3.422-.892l.746.746a.5.5 0 0 0 .707-.708l-.601-.602A7.001 7.001 0 0 0 9 2.07V1h.5a.5.5 0 0 0 0-1zm1.038 3.018a6 6 0 0 1 .924 0 6 6 0 1 1-.924 0M0 3.5c0 .753.333 1.429.86 1.887A8.04 8.04 0 0 1 4.387 1.86 2.5 2.5 0 0 0 0 3.5M13.5 1c-.753 0-1.429.333-1.887.86a8.04 8.04 0 0 1 3.527 3.527A2.5 2.5 0 0 0 13.5 1" />
                                                                    </svg>
                                                                    <span>Hora: {item1.inicio}</span>
                                                                </div>
                                                            </div>
                                                            <div className='col-lg-6 col-md-6 col-sm-12 col-12'>
                                                                <div style={{ display: "flex", marginTop: '0.5em' }} className="card-title">
                                                                    <svg style={{ marginTop: '0.2em', marginRight: '0.5em' }} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-person-check-fill" viewBox="0 0 16 16">
                                                                        <path fillRule="evenodd" d="M15.854 5.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 0 1 .708-.708L12.5 7.793l2.646-2.647a.5.5 0 0 1 .708 0" />
                                                                        <path d="M1 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6" />
                                                                    </svg>
                                                                    <span>Profesional: {item1.profesional.nombre}</span>
                                                                </div>
                                                            </div>
                                                            <div className='col-lg-6 col-md-6 col-sm-12 col-12'>
                                                                <div className="card-title">
                                                                    <label>Estado cita</label>
                                                                    <br />
                                                                    <select id='selectProfesional' value={item1.estado_cita} onChange={(event) => cambioEstadoCita(event, item1)} style={{ width: '60%' }} className="form-select rounded" >
                                                                        {estados.map((item, index) => {
                                                                            return (
                                                                                <option key={index} value={item} >{item}</option>
                                                                            )
                                                                        })}
                                                                    </select>
                                                                </div>
                                                            </div>
                                                            <div className='col-lg-6 col-md-6 col-sm-12 col-12'>
                                                                <button onClick={() => abrirDialogoDetallesCita(item1)} style={{ display: "flex", marginTop: '1em', marginBottom: '0.5em' }} className='btn btn-info btnInfoHover'>
                                                                    <svg style={{ marginTop: '0.2em', marginRight: '0.5em' }} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-plus-square" viewBox="0 0 16 16">
                                                                        <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z" />
                                                                        <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4" />
                                                                    </svg>
                                                                    Mostrar mas info...
                                                                </button>
                                                            </div>
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                            {/*Si no hay ninguna cita y hay profesionales disponibles, se muestran las horas disponibles para agendar citas*/}
                                            {item.profesionalesDisponibles.length > 0 ?
                                                <div style={{ marginBottom: '1em', display: mostrarCitas == "none" ? "" : "none" }} onClick={() => cambioHora(item)} >
                                                    <div className='row justify-content-between border border-success card-little-flyer pointer rounded'>
                                                        <div style={{ alignContent: 'center' }} className='col-4 d-flex justify-content-center'>
                                                            <img style={{ width: '2em', height: 'auto', margin: '0.2em' }} src={logoAgendar} className="card-img-left img-fluid" alt="" />
                                                        </div>
                                                        <div className='col-4 align-self-center d-flex justify-content-center'>
                                                            <div style={{ color: item.disponible ? 'green' : "black", display: "flex", marginTop: '0.5em' }} className="card-title">
                                                                <svg style={{ marginTop: '0.2em', marginRight: '0.5em' }} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-alarm" viewBox="0 0 16 16">
                                                                    <path d="M8.5 5.5a.5.5 0 0 0-1 0v3.362l-1.429 2.38a.5.5 0 1 0 .858.515l1.5-2.5A.5.5 0 0 0 8.5 9z" />
                                                                    <path d="M6.5 0a.5.5 0 0 0 0 1H7v1.07a7.001 7.001 0 0 0-3.273 12.474l-.602.602a.5.5 0 0 0 .707.708l.746-.746A6.97 6.97 0 0 0 8 16a6.97 6.97 0 0 0 3.422-.892l.746.746a.5.5 0 0 0 .707-.708l-.601-.602A7.001 7.001 0 0 0 9 2.07V1h.5a.5.5 0 0 0 0-1zm1.038 3.018a6 6 0 0 1 .924 0 6 6 0 1 1-.924 0M0 3.5c0 .753.333 1.429.86 1.887A8.04 8.04 0 0 1 4.387 1.86 2.5 2.5 0 0 0 0 3.5M13.5 1c-.753 0-1.429.333-1.887.86a8.04 8.04 0 0 1 3.527 3.527A2.5 2.5 0 0 0 13.5 1" />
                                                                </svg>
                                                                <span>{item.hora}</span>
                                                            </div>
                                                        </div>
                                                        <div className='col-4 align-self-center d-flex justify-content-center'>
                                                            <button className='btn btn-success btn-sm'>Agendar</button>
                                                        </div>
                                                    </div>
                                                </div>
                                                :
                                                <span style={{ textAlign: 'center', display: index == 0 ? '' : 'none' }}>Lo sentimos, no tenemos profesionales disponible para esta fecha...</span>
                                            }
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                </div>
            </div>
            <button id='btnDialogoNuevaCita' data-toggle="modal" data-target="#dialogoNuevaCita" style={{ display: 'none' }}></button>
            <NewCitaModal clientes={params.clientes} url={params.globalVars.myUrl} datosCita={datosCita}></NewCitaModal>
            <button id='btnDialogoDetallesCita' data-toggle="modal" data-target="#dialogoDetallesCita" style={{ display: 'none' }}></button>
            <DetallesCita url={params.globalVars.myUrl} eliminarCita={functionEliminarCita} cita={detallesCita}></DetallesCita>
            <DialogoLoading url={params.globalVars.myUrl}></DialogoLoading>
            <ConfigHorario fetchSaveConfigHorario={fetchSaveConfigHorario} configHorario={params.configHorario}></ConfigHorario>
        </AuthenticatedLayout>
    )
}

export default Calendario