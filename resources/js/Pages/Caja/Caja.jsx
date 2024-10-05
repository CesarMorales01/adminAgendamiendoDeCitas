import React from 'react'
import GlobalFunctions from '../services/GlobalFunctions';
import { useState, useEffect } from 'react';
import Swal from 'sweetalert2'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { Head } from '@inertiajs/react'
import '../../../css/general.css'
import DialogoLoading from '../UIGeneral/DialogoLoading';
import newLogo from '../../../../public/Images/Config/plus.png'
import menosLogo from '../../../../public/Images/Config/retiroLogo.png'
import DialogoMovimientoCaja from './DialogoNuevoMovimientoCaja';
import DialogoNuevoMovimientoCaja from './DialogoNuevoMovimientoCaja';
import DialogoListaMovimientosCaja from './DialogoListaMovimientosCaja';

const Caja = (params) => {
  const glob = new GlobalFunctions()
  const [filterListaMovimientos, setFilterListaMovimientos] = useState([])
  const [cargar, setCargar] = useState(false)
  const [fecha, setFecha] = useState(glob.getFecha())
  const [totalesCaja, setTotalesCaja] = useState({
    listaMovimientos: params.objetoMove.listaCaja,
    totalIngresosCaja: params.objetoMove.totalIngresosCaja,
    totalVentasEfectivo: params.objetoMove.ventasEfectivo,
    totalVentasElectronico: params.objetoMove.ventasPagoElectronico,
    totalRetirosCaja: params.objetoMove.totalRetirosCaja,
    totalEfectivo: 0
  })
  const [tipoMovimiento, setTipoMovimiento] = useState(2)

  useEffect(() => {
    if (cargar) {
      fetchMoveCaja()
    }
  }, [fecha])

  useEffect(() => {
    const totalIngresos = parseInt(params.objetoMove.ventasEfectivo) + parseInt(params.objetoMove.totalIngresosCaja)
    const totalEfectivo = totalIngresos - parseInt(params.objetoMove.totalRetirosCaja)
    setTotalesCaja((valores) => ({
      ...valores,
      totalEfectivo: totalEfectivo
    }))
    if (params.mensaje != 'nothing') {
      sweetAlert(params.mensaje)
    }
  }, [])

  function loadingOn(){
    document.getElementById('btnCancelarDialogoMovimientosCaja').click()
    document.getElementById('btnModalLoading').click()
  }

  function fetchMoveCaja() {
    document.getElementById('btnModalLoading').click()
    const url = params.globalVars.myUrl + 'caja/' + fecha
    fetch(url)
      .then((response) => {
        return response.json()
      }).then((json) => {
        const totalIngresos = parseInt(json.ventasEfectivo) + parseInt(json.totalIngresosCaja)
        let totalEfectivo = totalIngresos - parseInt(json.totalRetirosCaja)
        setTotalesCaja((valores) => ({
          ...valores,
          listaMovimientos: json.listaCaja,
          totalIngresosCaja: json.totalIngresosCaja,
          totalVentasEfectivo: json.ventasEfectivo,
          totalVentasElectronico: json.ventasPagoElectronico,
          totalRetirosCaja: json.totalRetirosCaja,
          totalEfectivo: totalEfectivo
        }))
        setCargar(false)
        document.getElementById('btnCloseModalLoading').click()
      })

  }

  function sweetAlert(mensaje) {
    Swal.fire({
      title: mensaje,
      icon: 'success',
      timer: 1000,
    })
  }

  function cambioFecha(e) {
    setCargar(true)
    setFecha(e.target.value)
  }

  function diaAnterior() {
    setCargar(true)
    let f = glob.formatFecha(operarDias(new Date(fecha), -0, 5)).split("-")
    setFecha(f[0] + "-" + f[1] + "-" + f[2])
  }

  function operarDias(fecha, dias) {
    fecha.setDate(fecha.getDate() + dias);
    return fecha;
  }

  function diaSiguiente() {
    setCargar(true)
    let f = glob.formatFecha(operarDias(new Date(fecha), 2)).split("-")
    setFecha(f[0] + "-" + f[1] + "-" + f[2])
  }

  function getBackground() {
    let color = '#ff3b1f'
    if (totalesCaja.totalEfectivo > 0) {
      color = '#00913f'
    }
    if (totalesCaja.totalEfectivo == 0) {
      color = 'white'
    }
    return color
  }

  function abrirDialogoNuevoMovimiento(tipo) {
    setTipoMovimiento(tipo)
    setTimeout(() => {
      document.getElementById('btnDialogoMovimientoCaja').click()
    }, 100);
  }

  function mostrarListaMovimientos(tipo) {
    let filterLista=totalesCaja.listaMovimientos.filter(item => item.tipo_movimiento == tipo)
    setFilterListaMovimientos(filterLista)
    setTimeout(() => {
      document.getElementById('btnListaMovimientoCaja').click()
    }, 100);
  }

  return (
    <AuthenticatedLayout user={params.auth} globalVars={params.globalVars}>
      <Head title="Caja" />
      <div className="py-2">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
            <div style={{ textAlign: 'center' }} className='container'>
              <div style={{ marginTop: '0.8em' }} className="row">
                <div onClick={() => abrirDialogoNuevoMovimiento(1)} className="col-lg-6 col-md-6 col-sm-6 col-6"  >
                  <div className="card border border-primary card-flyer pointer">
                    <img style={{ width: '8em', height: '4em', marginTop: '1em' }} src={newLogo} className="card-img-top img-fluid centerImg" alt="" />
                    <h2 style={{ marginTop: '0.2em' }} className="card-title titulo">Ingreso a caja</h2>
                  </div>
                </div>
                <div onClick={() => abrirDialogoNuevoMovimiento(2)} className="col-lg-6 col-md-6 col-sm-6 col-6"  >
                  <div className="card border border-primary card-flyer pointer">
                    <img style={{ width: '5em', height: '4em', marginTop: '1em' }} src={menosLogo} className="card-img-top img-fluid centerImg" alt="" />
                    <h2 style={{ marginTop: '0.2em' }} className="card-title titulo">Retiro de caja</h2>
                  </div>
                </div>
              </div>
              <div style={{ marginTop: '1em' }} className="row">
                <div className="col-4">
                  <h1 style={{ fontSize: '1.5em', marginBottom: '0.2em' }} id="titulo" className="text-center titulo">Caja dia: </h1>
                </div>
                <div style={{ marginTop: '-0.5em' }} className="col-4" >
                  <input style={{ cursor: 'pointer' }} type="date" value={fecha} className='form-control rounded' onChange={cambioFecha} name="fecha" id="inputDate" />
                </div>
                <div style={{ marginTop: '-0.5em' }} className="col-2">
                  <button onClick={diaAnterior} className='border border-dark rounded cursorPointer' style={{ marginTop: '0.2em', marginLeft: '0.2em', padding: '0.5em', backgroundColor: '#00722e' }} id="btn_buscar">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-arrow-left-circle" viewBox="0 0 16 16">
                      <path fillRule="evenodd" d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8zm15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-4.5-.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H11.5z" />
                    </svg>
                  </button>
                </div>
                <div style={{ marginTop: '-0.5em' }} className="col-2">
                  <button onClick={diaSiguiente} className='border border-dark rounded cursorPointer' style={{ marginTop: '0.2em', marginLeft: '0.2em', padding: '0.5em', backgroundColor: '#00722e' }} id="btn_buscar">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-arrow-right-circle" viewBox="0 0 16 16">
                      <path fillRule="evenodd" d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8zm15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM4.5 7.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H4.5z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
            <div style={{ marginTop: '1.2em', textAlign: 'center', margin: '2em' }} className='table-responsive'>
              <table className="table table-hover roundedTable">
                <thead style={{ whiteSpace: 'nowrap' }}>
                  <tr className="table-success">
                    <th scope="col">
                      <button onClick={() => mostrarListaMovimientos('Ingreso')} style={{ color: 'black' }} className='btn btn-outline-info'>Total ingresos a caja <i style={{ color: 'blue' }} className="fa-solid fa-circle-info"></i></button>
                    </th>
                    <th scope="col">$ {glob.formatNumber(totalesCaja.totalIngresosCaja)}</th>
                  </tr>
                  <tr className="table-success">
                    <th>Total ventas en efectivo</th>
                    <th>$ {glob.formatNumber(totalesCaja.totalVentasEfectivo)}</th>
                  </tr>
                  <tr className="table-warning">
                    <th>Total ventas con pago electronico</th>
                    <th>$ {glob.formatNumber(totalesCaja.totalVentasElectronico)}</th>
                  </tr>
                  <tr className="table-danger">
                    <th><button onClick={() => mostrarListaMovimientos('Retiro')} style={{ color: 'black' }} className='btn btn-outline-info'>Total retiros caja <i style={{ color: 'blue' }} className="fa-solid fa-circle-info"></i></button></th>
                    <th scope="col">$ {glob.formatNumber(totalesCaja.totalRetirosCaja)}</th>
                  </tr>
                  <tr style={{ backgroundColor: getBackground() }} >
                    <th scope="col">Total efectivo</th>
                    <th scope="col">$ {glob.formatNumber(totalesCaja.totalEfectivo)}</th>
                  </tr>
                </thead>
              </table>
            </div>
          </div>
        </div>
      </div>
      <button id='btnDialogoMovimientoCaja' data-toggle="modal" data-target="#dialogoMovimientoCaja" style={{ display: 'none' }} ></button>
      <DialogoNuevoMovimientoCaja tipoMovimiento={tipoMovimiento} token={params.token}></DialogoNuevoMovimientoCaja>
      <DialogoLoading url={params.globalVars.myUrl}></DialogoLoading>
      <button id='btnListaMovimientoCaja' data-toggle="modal" data-target="#dialogoListaMovimientosCaja" style={{ display: 'none' }} ></button>
      <DialogoListaMovimientosCaja loadingOn={loadingOn} listaMovimientos={filterListaMovimientos} url={params.globalVars.myUrl}></DialogoListaMovimientosCaja>
    </AuthenticatedLayout>
  )
}

export default Caja