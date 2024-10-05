import React from 'react'
import NewProfesional from './NewProfesional';

const ConfigProfesionales = (params) => {

    function closeModalNewProfesional(){
        document.getElementById('btnNewProfesionalModal').click()
    }
    return (
        <div id='configProfesionalesModal' className="modal fade bd-example-modal-lg" tabIndex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true">
            <div className="modal-dialog modal-lg modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <h1 className='titulo'><strong>Profesionales disponibles para citas</strong></h1>
                        <button data-dismiss="modal" style={{ marginTop: '0.5em' }} type="button">
                            <svg style={{ color: 'red' }} xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-x-square-fill" viewBox="0 0 16 16">
                                <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zm3.354 4.646L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 1 1 .708-.708" />
                            </svg>
                        </button>
                    </div>
                    <NewProfesional abrirDialogoEliminarProfesional={params.abrirDialogoEliminarProfesional}
                        validarRegistroEditProfesional={params.validarRegistroEditProfesional} cambioNombreProfesional={params.cambioNombreProfesional}
                        newProfesional={params.newProfesional} closeModalNewProfesional={closeModalNewProfesional}
                    >
                    </NewProfesional>
                    <div className="container">
                        <div className='row'>
                            <div style={{ margin: '1em' }} className='col-lg-6 col-md-6 col-sm-12 col-12'>
                                <button onClick={() => params.abrirDialogoNewProfesional({ id: '' })} className='btn btn-success' style={{ display: 'flex' }}>
                                    <svg style={{ marginTop: '0.2em', marginRight: '0.2em' }} xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" className="bi bi-plus-circle" viewBox="0 0 16 16">
                                        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                                        <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4" />
                                    </svg>
                                    Nuevo profesional
                                </button>
                            </div>

                            <div className='table-responsive'>

                                <table style={{ textAlign: 'center' }} className="table">
                                    <thead>
                                        <tr>
                                            <th scope="col">Nombre</th>
                                            <th scope="col">Activar/desactivar</th>
                                            <th scope="col">Editar</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {params.profesionales.lista.map((item, index) => {
                                            return (
                                                <tr key={index}>
                                                    <td>{item.nombre}</td>
                                                    <td>
                                                        <label id={'checkEnable' + item.id} className="relative inline-flex  cursor-pointer">
                                                            <input checked={item.enable == 0 ? false : true} onChange={(event) => params.cambioHabilitarProfesional(event, item)} type="checkbox" className="sr-only peer" />
                                                            <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                                                        </label>
                                                        <div id={'spinnerEnable' + item.id} style={{ width: '1.8rem', height: '1.8rem', display: 'none' }} className="spinner-border text-primary " role="status">
                                                            <span className="sr-only">Loading...</span>
                                                        </div>
                                                    </td>
                                                    <td className='d-flex justify-content-center'>
                                                        <a onClick={() => params.abrirDialogoNewProfesional(item)} style={{ cursor: 'pointer', marginTop: '0.3em', marginBottom: '0.39em' }} >
                                                            <svg style={{ padding: '0.2em', backgroundColor: '#127b38' }} xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-pencil-fill rounded" viewBox="0 0 16 16">
                                                                <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708l-3-3zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207l6.5-6.5zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.499.499 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11l.178-.178z" />
                                                            </svg>
                                                        </a>
                                                    </td>
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </table>

                            </div>
                        </div>


                    </div>
                </div>
            </div>
        </div>
    )
}

export default ConfigProfesionales