import React from 'react'
import { useState, useEffect } from 'react';
import GlobalFunctions from '../services/GlobalFunctions';
import Swal from 'sweetalert2'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { Head } from '@inertiajs/react';
import SelectProductos from './SelectProductos';
import PrimaryButton from '@/Components/PrimaryButton'

const NuevaPromocion = (params) => {
    const glob = new GlobalFunctions()
    const [mensaje, setMensaje] = useState('')
    const [promo, setPromo] = useState({
        descripcion: '',
        imagen: '',
        codigoProducto: '',
        codigoPromo: '',
        video: ''
    })
    //ventana 1 para imagenes. 2 para Videos
    const [windowDisplay, setWindowDisplay] = useState(1)

    useEffect(() => {
        validarParams()
    }, [])

    function validarParams() {
        if (params.promo.descripcion == '') {
            setPromo((valores) => ({
                ...valores,
                descripcion: '',
                imagen: '',
                codigoPromo: '',
                video: ''
            }))
            document.getElementById('img').src = params.globalVars.myUrl + "Images/Config/noPreview.jpg"
        } else {
            setPromo((valores) => ({
                ...valores,
                descripcion: params.promo.descripcion,
                imagen: params.promo.imagen,
                codigoProducto: params.promo.ref_producto,
                codigoPromo: params.promo.id,
                video: params.promo.video
            }))
            document.getElementById('img').src = params.globalVars.urlImagenes + params.promo.imagen
            if(params.promo.video!=null){
                setWindowDisplay(2)
            }
        }
    }

    function mostrarImagen(event) {
        var file = event.target.files[0];
        var reader = new FileReader();
        reader.onload = function (event) {
            var img = document.getElementById('img');
            img.src = event.target.result;

        }
        reader.readAsDataURL(file)
        setPromo((valores) => ({
            ...valores,
            imagen: event.target.files[0].name
        }))
        setMensaje('')
    }

    function loadingOn() {
        document.getElementById('btnLoading').style.display = 'inline'
        document.getElementById('btnIngresar').style.display = 'none'
    }

    function cambioNombre(e) {
        setPromo((valores) => ({
            ...valores,
            descripcion: e.target.value,
        }))
    }

    function cambioVideo(e) {
        if(e.target.value!=''){
            let codVideo=e.target.value.split('be/')
            if(codVideo.length>0){
                setPromo((valores) => ({
                    ...valores,
                    video: 'https://www.youtube.com/embed/'+codVideo[1]
                }))
            }
        }else{
            setPromo((valores) => ({
                ...valores,
                video: ''
            }))
        }
    }

    function cambioProducto(e) {
        let nombre = ''
        let imagen = ''
        let codigo = ''
        for (let i = 0; i < params.productos.length; i++) {
            if (params.productos[i].id == e.target.value) {
                codigo = params.productos[i].id
                nombre = params.productos[i].nombre + ': $ ' + glob.formatNumber(params.productos[i].valor)
                imagen = params.productos[i].nombre_imagen
            }
        }
        setPromo((valores) => ({
            ...valores,
            descripcion: nombre,
            imagen: imagen,
            codigoProducto: codigo
        }))
        document.getElementById("fileImg").value = null
        document.getElementById('img').src = params.globalVars.urlImagenes + imagen
        setMensaje('Las imagenes ingresadas en los productos son verticales, pero para el carousel se ven mejor horizontales!')
    }

    function getFileSize() {
        if (document.getElementById('fileImg') != null) {
            return document.getElementById('fileImg').files.length
        } else {
            return 0
        }
    }

    function validarDatos(e) {
        e.preventDefault()
        if (promo.imagen != '' || promo.video!='') {
            loadingOn()
            if (promo.codigoPromo == '') {
                document.getElementById('formCrear').submit()
            } else {
                updatePromo()
            }
        } else {
            setMensaje('Faltan datos importantes!')
        }
    }

    function updatePromo() {
        const form = document.getElementById("formCrear")
        form.setAttribute("method", "post")
        form.action = route('promo.actualizar', promo.codigoPromo)
        form.submit()
    }

    function enviarBorrar() {
        document.getElementById('btnEliminar').click()
        loadingOn()
    }

    function abrirDialogoEliminar() {
        Swal.fire({
            title: '¿Eliminar esta promoción?',
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

    function validarContenidoBoton() {
        let content = 'Ingresar imagen a carrusel'
        if (windowDisplay == '2') {
            content = 'Ingresar video a carrusel'
        }

        if (params.promo.id != '') {
            content = 'Editar carrusel'
        }
        return content
    }

    function validarMostrarBotonTitulo1() {
        let mostrar = ''
        if (params.promo.id != '') {
            if (params.promo.video!=null) {
                mostrar = 'none'
            }
        }
        return mostrar
    }

    function validarMostrarBotonTitulo2() {
        let mostrar = 'none'
        if (params.promo.id != '') {
            if (params.promo.video!=null) {
                mostrar = ''
            }
        }else{
            mostrar=''
        }
        return mostrar
    }

    return (
        <AuthenticatedLayout user={params.auth} globalVars={params.globalVars}>
            <Head title="Carrusel" />
            <a id='btnEliminar' href={route('promo.destroy', promo.codigoPromo)} style={{ display: 'none' }}></a>
            <div className='container'>
                <div style={{ textAlign: 'center', marginTop: '0.2em' }} className="container">
                    <button onClick={() => setWindowDisplay('1')} style={{ textTransform: 'uppercase', margin: '0.4em', display: validarMostrarBotonTitulo1() }} className={windowDisplay == '1' ? 'btn btn-primary btn-sm' : 'btn btn-dark btn-sm'}>Imagen a carrusel</button>
                    <button onClick={() => setWindowDisplay('2')} style={{ textTransform: 'uppercase', margin: '0.4em', display: validarMostrarBotonTitulo2() }} className={windowDisplay == '2' ? 'btn btn-primary btn-sm' : 'btn btn-dark btn-sm'}>Video a carrusel</button>
                </div>
                <div align="center" className="row justify-content-center">
                    <div className='col-lg-11 col-md-11 col-sm-10 col-10' >
                    </div>
                    <div className='col-lg-1 col-md-1 col-sm-2 col-2 '>
                        <button onClick={abrirDialogoEliminar} id='btnDialogoEliminar' style={{ marginTop: '0.5em', display: promo.codigoPromo == '' ? 'none' : '', backgroundColor: 'red' }} className="btn btn-danger" type="button">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash" viewBox="0 0 16 16">
                                <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" />
                                <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z" />
                            </svg>
                        </button>
                    </div>
                    <form style={{ marginTop: '0.5em' }} onSubmit={validarDatos} method="POST" id="formCrear" action={route('promo.store')} encType="multipart/form-data">
                        <input type='hidden' name='ref_producto' value={promo.codigoProducto}></input>
                        <input type="hidden" name='_token' value={params.token} />
                        <div className='row'>
                            <div className='col-lg-6 col-md-6 col-sm-6 col-12' style={{ marginTop: '0.5em', display: windowDisplay == '1' ? '' : 'none' }} >
                                <SelectProductos cambioProducto={cambioProducto} productos={params.productos}></SelectProductos>
                            </div>
                            <div className={windowDisplay == '1' ? 'col-lg-6 col-md-6 col-sm-6 col-12' : 'col-12'}>
                                <textarea name='descripcion' style={{ marginTop: '0.5em', width: '80%' }} className='form-control' onChange={cambioNombre} placeholder="Descripción de la promoción o titulo de video" value={promo.descripcion == '' ? '' : promo.descripcion} />
                                <textarea name='video' rows={'1'} style={{ marginTop: '0.5em', width: '80%', display: windowDisplay == '1' ? 'none' : '' }} className='form-control' onChange={cambioVideo} placeholder="Ingresa el enlace del video" value={promo.video == '' ? '' : promo.video} />
                                <iframe style={{ display: windowDisplay == '2' ? '' : 'none', marginTop: '0.5em' }} width="420" height="280"
                                    src={promo.video!='' ? promo.video: ''}>
                                </iframe>
                            </div>
                        </div>
                        <div style={{ padding: '0.2em', marginTop: '0.5em' }} className='row'>
                            <div style={{ display: windowDisplay == '1' ? '' : 'none' }} className='col-lg-6 col-md-6 col-sm-12 col-12'>
                                <input style={{ display: windowDisplay == '1' ? '' : 'none' }} name='imagen' data-toggle="tooltip" title="Ingresa imagenes de 3840x1776 mp. aprox." type="file" id="fileImg" onChange={mostrarImagen} />
                                <input type='hidden' name='nombreImagen' value={promo.imagen}></input>
                                <input type='hidden' name='nombreImagenAnterior' value={!params.promo.imagen ? '' : params.promo.imagen}></input>
                                <br style={{ display: windowDisplay == '1' ? '' : 'none' }} />
                                <span style={{ color: 'black', display: windowDisplay == '1' ? '' : 'none' }}>{getFileSize > 0 ? '' : promo.imagen}</span>
                                <br />
                                <p style={{ color: 'red', margin: '1em' }}>{mensaje}</p>
                            </div>
                            <div className='col-lg-6 col-md-6 col-sm-12 col-12'>
                                <img style={{ display: windowDisplay == '1' ? '' : 'none' }} id="img" width="200px" height="200px" src={params.promo.imagen == '' ? params.globalVars.myUrl + "Images/Config/noPreview.jpg" : params.globalVars.urlImagenes + params.promo.imagen} />
                            </div>
                            <div style={{ marginTop: '1em' }} className="row justify-content-center" >
                                <div className="col-6 col-lg-3 col-md-3 col-sm-6 align-self-center"  >
                                    <a className='btn btn-danger' href={route('promo.index')} >Cancelar</a>
                                </div>
                                <div className="col-6 col-lg-3 col-md-3 col-sm-6"  >
                                    <PrimaryButton type='submit' id="btnIngresar">{validarContenidoBoton()}</PrimaryButton>
                                    <button id='btnLoading' style={{ display: 'none', backgroundColor: 'red' }} className="btn btn-primary" type="button" disabled>
                                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                        Loading...
                                    </button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    )
}

export default NuevaPromocion