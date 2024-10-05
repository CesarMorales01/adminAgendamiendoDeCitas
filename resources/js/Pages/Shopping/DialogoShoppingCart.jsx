import React from 'react'
import { useState, useEffect } from 'react';
import GlobalFunctions from '../services/GlobalFunctions';
import Swal from 'sweetalert2'
import SuperCantModal from './SuperCantModal';

const DialogoShoppingCart = (params) => {
    const glob = new GlobalFunctions()
    const [productos, setProductos] = useState([])
    const [idEliminar, setIdEliminar] = useState('')
    const [superCantidad, setSuperCantidad] = useState({
        id: '',
        cantidad: ''
    })

    useEffect(() => {
        revisarDatos()
    })

    function revisarDatos() {
        if (params.productosCarrito.length != productos.length) {
            setProductos(params.productosCarrito)
        }
    }

    function abrirDialogoElimininar(item) {
        const validarInv = validarInventario(item)
        setIdEliminar(item.id)
        Swal.fire({
            title: validarInv == 'none' ? '¿Eliminar ' + item.nombre + '? No se reintegrara a inventario porque no hay registro!' : '¿Eliminar ' + item.nombre + ' del carrito de compras?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Si, eliminar!',
            reverseButtons: false
        }).then((result) => {
            if (result.isConfirmed) {
                document.getElementById('inputGoNuevaCompra').click()
            }
        })
    }

    function validarInventario(item) {
        let mostrar = ''
        //validar si se esta editando: validar si mostrar
        if (params.editando != '') {
            let validarProd = null
            params.productos.forEach(element => {
                if (element.id == item.id) {
                    validarProd = item
                }
            });
            if (validarProd == null) {
                mostrar = 'none'
            }
        }
        return mostrar
    }

    function setCodSuperCant(item) {
        setSuperCantidad((valores) => ({
            ...valores,
            id: item.id,
            cantidad: item.cantidad
        }))
    }

    function cambioSuperCant(e) {
        setSuperCantidad((valores) => ({
            ...valores,
            cantidad: e.target.value
        }))
    }

    function sweetAlertComment(item) {
        Swal.fire({
            title: 'Comentario producto',
            input: 'textarea',
            inputValue: item.descripcion,
            inputAttributes: {
                autocapitalize: 'off'
            },
            showCancelButton: true,
            confirmButtonColor: 'green',
            confirmButtonText: 'Agregar',
            reverseButtons: true,
            preConfirm: (comentario) => {
                document.getElementById('inputComment' + item.id).value = comentario
                document.getElementById('inputComment' + item.id).click()
            }
        })
    }

    return (
        <div >
            <div style={{ margin: '0.2em' }} >
                <input type='hidden' id='inputGoNuevaCompra' onClick={() => params.borrarProducto(idEliminar)} ></input>
                <div className="row" style={{ color: 'green', marginTop: '0.4em' }}>
                    <div className="align-self-center">
                        <h1 style={{ marginTop: '0.5em', fontSize: '1.2em', color: 'black' }} className="text-center">Carrito de compras</h1>
                    </div>
                </div>
                <div style={{ marginTop: '0.2em' }} className="table-responsive">
                    <table className="table">
                        <thead>
                            <tr className='align-center' style={{ textAlign: 'center' }}>
                                <th scope="col">Producto</th>
                                <th scope="col">
                                    Valor
                                </th>
                                <th scope="col">Cant</th>
                                <th scope="col">Subtotal</th>
                                <th scope="col">Sumar</th>
                                <th scope="col">Restar</th>
                                <th scope="col">Borrar</th>
                            </tr>
                        </thead>
                        {productos.map((item, index) => {

                            return (
                                <thead key={index}>
                                    <tr style={{ textAlign: 'center' }} className='align-middle'  >
                                        <td>{item.nombre}</td>
                                        <td >
                                            <input id={item.id} onChange={params.cambioPrecioFinal} className='rounded' type='number' value={item.precio}></input>
                                        </td>
                                        <td>
                                            {validarInventario(item) == 'none' ? item.cantidadCarrito : ''}
                                            <button style={{ display: validarInventario(item) }} onClick={() => setCodSuperCant(item)} data-toggle="modal" data-target="#cantModal" className='btn btn-outline-success'>{item.cantidadCarrito}</button>
                                        </td>
                                        <td>${glob.formatNumber(item.subtotalProducto)}</td>
                                        <td>
                                            <button style={{ display: validarInventario(item) }} onClick={() => params.masCant(item)} className="btn btn-light btn-sm">
                                                <svg style={{ color: 'green' }} xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" className="bi bi-plus-square" viewBox="0 0 16 16">
                                                    <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z" />
                                                    <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
                                                </svg>
                                            </button>
                                            <span style={{ color: 'red' }}>{validarInventario(item) == 'none' ? 'Sin ' : ''}</span>
                                        </td>
                                        <td>
                                            <button style={{ display: validarInventario(item) }} onClick={() => params.menosCant(item)} className="btn btn-light btn-sm">
                                                <svg style={{ color: 'green' }} xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" className="bi bi-dash-square" viewBox="0 0 16 16">
                                                    <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z" />
                                                    <path d="M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8z" />
                                                </svg>
                                            </button>
                                            <span style={{ color: 'red' }}>{validarInventario(item) == 'none' ? 'inventario' : ''}</span>
                                        </td>
                                        <td>
                                            <button onClick={() => abrirDialogoElimininar(item)} className='btn btn-danger btn-sm'>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" className="bi bi-trash" viewBox="0 0 16 16">
                                                    <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" />
                                                    <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z" />
                                                </svg>
                                            </button>
                                        </td>
                                    </tr>
                                    <tr style={{ display: 'none' }}>
                                        <td colSpan={'8'}>
                                            <input type='hidden' id={'inputComment' + item.id} onClick={() => params.cambioComentarioProducto(item.id)}></input>
                                            <textarea rows={'1'} placeholder='Comentarios producto...' onClick={() => sweetAlertComment(item)} className="form-control" defaultValue={item.descripcion}></textarea>
                                        </td>
                                    </tr>
                                </thead>
                            )
                        })}
                    </table>
                </div>
            </div>
            <SuperCantModal cambioSuperCant={cambioSuperCant} superCantidad={superCantidad} cambioCant={() => params.cambioCant(superCantidad)}></SuperCantModal>
        </div >
    )
}

export default DialogoShoppingCart