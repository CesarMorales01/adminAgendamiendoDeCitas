import React from 'react'
import { useState, useEffect } from 'react'
import GlobalFunctions from '../services/GlobalFunctions';

const ShowProducts = (params) => {

    const glob = new GlobalFunctions()
    const [filterProductos, setFilterProductos] = useState([])

    useEffect(() => {
        seleccionarProductos()
    }, [])

    useEffect(() => {
        document.getElementById('inputBuscarProducto').focus()
    })

    function seleccionarProductos() {
        const temp = params.productos.filter((art) => art.category_id === params.categorias[0].id);
        setFilterProductos(temp)
    }

    function cambiarCategoria(item, index) {
        setBordeDiv(index)
        const temp = params.productos.filter((art) => art.category_id === item.id);
        setFilterProductos(temp)
    }

    function setBordeDiv(index) {
        var div_min = document.getElementById("div_miniaturas");
        for (var x = 0; x < div_min.childNodes.length; x++) {
            if (div_min.childNodes[x].nodeType == Node.ELEMENT_NODE) {
                div_min.childNodes[x].style.border = "";
            }
        }
        document.getElementById('divMin' + index).style.border = "outset";
    }

    function cambiarFilterProductos(e) {
        let palabra = ''
        const check = e.target.value.toLowerCase()
        if (check.includes('xx')) {
            palabra = check.replace('xx', '')
            document.getElementById('inputBuscarProducto').value = palabra
        } else {
            palabra = check
        }
        let newArray = []
        for (let i = 0; i < params.productos.length; i++) {
            let producto = null
            if (params.productos[i].nombre.toLowerCase().includes(palabra)) {
                producto = params.productos[i]
            } else {
                if (params.productos[i].id.toString().includes(palabra)) {
                    producto = params.productos[i]
                }

            }
            if (producto != null) {
                newArray.push(producto)
            }
        }
        setFilterProductos(newArray)
    }

    function borrarInput() {
        document.getElementById('inputBuscarProducto').value = ''
        setFilterProductos(params.productos)
    }

    return (
        <div className="row align-items-start">
            <input type='hidden' id='inputShowProductAddToCar' onClick={params.addToCar}></input>
            <input type='hidden' id='inputGoToCarrito' onClick={() => params.setWindowDisplay('2')}></input>
            <input type='hidden' id='inputShowProductAddTopping' onClick={params.addTopping}></input>
            <input type='hidden' id='inputGoToppings' onClick={() => params.setWindowDisplay('4')}></input>
            <h1 style={{ marginTop: '0.5em', fontSize: '1.5em' }} id="titulo" className="text-center">Selecciona los productos:</h1>
            <div id="div_miniaturas" className="row col-lg-2 col-md-2 col-sm-3 col-3" style={{ textAlign: 'center' }} >
                <h1 style={{ marginTop: '0.4em', fontWeight: 'bold' }}>Categorias:</h1>
                {params.categorias.map((item, index) => {
                    return (
                        <div key={index} id={'divMin' + index} onClick={() => cambiarCategoria(item, index)} className="col-lg-2 col-md-2 col-sm-3 col-3" style={{ width: '7em', marginTop: '2em', cursor: 'pointer', marginLeft: '0.5em' }}>
                            <img className="img-fluid img-thumbnail centerImg" style={{ height: 'auto', width: '60%', marginTop: '0.5em' }} src={params.globalVars.urlImagenesCategorias + item.imagen} />
                            <h5 className="card-title">{item.nombre}</h5>
                        </div>
                    )
                })}
            </div>
            <div style={{ marginTop: '0.2em', textAlign: 'center' }} className="col-lg-10 col-md-10 col-sm-9 col-9" >
                <div style={{ marginLeft: '25%' }} className="flex items-center py-3">
                    <input id='inputBuscarProducto' onChange={cambiarFilterProductos} className='rounded' type='text' placeholder='Buscar producto...' style={{ width: '60%' }}></input>
                    <button onClick={borrarInput} className="flex-shrink-0 border-transparent border-4 text-teal-500 hover:text-teal-800 text-sm py-1 px-2 rounded" type="button">
                        <svg style={{ padding: '0.2em', backgroundColor: 'gray', cursor: 'pointer' }} xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" className="rounded bi bi-x" viewBox="0 0 16 16">
                            <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
                        </svg>
                    </button>
                </div>
                <div style={{ textAlign: 'center', marginTop: '0.5em' }} >
                    <div className="row justify-content-center" >
                        {
                            filterProductos.map((item, index) => {
                                let img = params.globalVars.myUrl + 'Images/Config/noPreview.jpg'
                                if (item.imagen != '') {
                                    img = params.globalVars.urlImagenes + item.imagen
                                }
                                return (
                                    <div onClick={() => params.addToCar(item)} key={index} style={{ marginBottom: '1em' }} className="col-lg-2 col-md-2 col-sm-6 col-6"  >
                                        <div className="card border card-flyer pointer">
                                            <img style={{ width: window.screen.width > 600 ? '60%' : '100%', height: 'auto', marginTop: '0.5em', padding: '0.5em' }} src={img} className="card-img-top centerImg rounded" alt="" />
                                            <div style={{ textAlign: 'center' }} className="card-body">
                                                <h4 className="card-title">Ref: {item.referencia}</h4>
                                                <h2 style={{ fontWeight: 'bold' }} className="card-title">{item.nombre}</h2>
                                                <h4 style={{ fontWeight: 'bold' }} className="card-title">$ {glob.formatNumber(item.valor)}</h4>
                                                <h4 style={{ display: item.cantidad == null ? 'none' : '' }} className="card-title">Cantidad: {item.cantidad}</h4>

                                            </div>
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ShowProducts