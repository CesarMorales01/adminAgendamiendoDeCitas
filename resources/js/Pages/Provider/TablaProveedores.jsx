import React from 'react'
import GlobalFunctions from '../services/GlobalFunctions'
import Swal from 'sweetalert2'
import DetalleListaProveedores from './DetalleListaProveedores'
import { useState, useEffect } from 'react';

const TablaProveedores = (params) => {
    const glob = new GlobalFunctions()
    const [detalleListaProveedores, setDetalleListaProveedores] = useState(params.datos[0])

    function goDetalleListaProveedores(item) {
        setDetalleListaProveedores(item)
        setTimeout(() => {
            document.getElementById('btnDialogoDetalleListaProveedores').click()
        }, 100);
    }

    return (
        <div style={{ marginTop: '0.5em' }} className='table-responsive'>
            <table className="table table-striped  roundedTable">
                <thead className='navBarFondo align-middle'>
                    <tr>
                        <th style={{ textAlign: 'center' }} scope="col">Nombre proveedor</th>
                        <th style={{ textAlign: 'center' }} scope="col">Descripción</th>
                        <th style={{ textAlign: 'center' }} scope="col">Total proveedor</th>
                        <th style={{ textAlign: 'center' }} scope="col">Dirección</th>
                        <th style={{ textAlign: 'center' }} scope="col">Télefono</th>
                        <th style={{ textAlign: 'center' }} scope="col">E-mail</th>
                        <th style={{ textAlign: 'center' }} scope="col">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {params.noProviders ?
                        <tr style={{ marginTop: '1.5em' }} className='container'><td colSpan='6'>No se han encontrado resultados....</td></tr>
                        :
                        params.datos.map((item, index) => {
                            return (
                                <tr style={{ textAlign: 'center' }} key={index}>
                                    <td>{item.nombre}</td>
                                    <td>{item.descripcion != null ? item.descripcion : ''}</td>
                                    <td>
                                        $ {item.totalProveedor != undefined ? glob.formatNumber(item.totalProveedor) : 0}
                                        <br />
                                        <button onClick={() => goDetalleListaProveedores(item)} type="button" style={{ backgroundColor: '#0ea6ab', color: 'white' }} className="btn btn-info"><i style={{ marginLeft: '0.2em' }} className="fa-solid fa-circle-info"></i> Ver detalles</button>
                                    </td>
                                    <td>{item.direccion != null ? item.direccion : ''}</td>
                                    <td>{item.telefono != null ? item.telefono : ''}</td>
                                    <td>{item.email != null ? item.email : ''}</td>
                                    <td>
                                        <button onClick={()=>params.goEditarProveedor(item)}  className='border' style={{ cursor: 'pointer' }} >
                                            <svg style={{ padding: '0.2em', backgroundColor: '#127b38' }} xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-pencil-fill rounded" viewBox="0 0 16 16">
                                                <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708l-3-3zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207l6.5-6.5zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.499.499 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11l.178-.178z" />
                                            </svg>
                                        </button>
                                    </td>
                                </tr>
                            )
                        })
                    }
                </tbody>
            </table>
            <button id='btnDialogoDetalleListaProveedores' type="button" data-toggle="modal" data-target="#dialogoDetalleListaProveedores"></button>
            <DetalleListaProveedores datos={detalleListaProveedores}></DetalleListaProveedores>
        </div>
    )
}

export default TablaProveedores