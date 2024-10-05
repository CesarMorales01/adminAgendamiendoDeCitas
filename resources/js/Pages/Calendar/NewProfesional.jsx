import React from 'react'
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';

const NewProfesional = (params) => {

    return (
        <div id='newProfesionalModal' className="modal" tabIndex="-1" role="dialog">
            <div  className="modal-dialog modal-dialog-centered" role="document">
                <div style={{ backgroundColor: '#b7d5ac' }} className="modal-content">
                    {/* Para evitar el ingreso de un profesional con nombre en vacio, creo un form para poder usar la propiedad required y no tener que usar un alert*/}
                    <form onSubmit={params.validarRegistroEditProfesional}>
                        <div className="modal-header">
                            <h5 className="titulo">{params.newProfesional.id == '' ? 'Nuevo profesional' : 'Editar Profesional'}</h5>
                            <button onClick={params.abrirDialogoEliminarProfesional} style={{ marginTop: '0.5em', display: params.newProfesional.id == "" ? 'none' : '', backgroundColor: 'red' }} className="btn btn-danger" type="button">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash" viewBox="0 0 16 16">
                                    <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" />
                                    <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z" />
                                </svg>
                            </button>
                        </div>
                        <div className="modal-body">
                            <p>Nombre profesional</p>
                            <input required value={params.newProfesional.nombre} onChange={params.cambioNombreProfesional} style={{ marginTop: '0.5em' }} name='categoria' className='form-control rounded' type="text" placeholder='Nombre profesional' />
                        </div>
                        <div className="modal-footer">
                            <SecondaryButton  className="btn btn-secondary" onClick={params.closeModalNewProfesional}>Cancelar</SecondaryButton>
                            <PrimaryButton type="submit" id="btnIngresarProfesional" style={{ display: 'inline' }} className="btn btn-success">{params.newProfesional.id == '' ? 'Registrar profesional' : 'Editar Profesional'}</PrimaryButton>
                            <PrimaryButton id='btnLoadingIngresarProfesional' style={{ display: 'none', backgroundColor: 'red' }} className="btn btn-primary" type="button" disabled>
                                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                Loading...
                            </PrimaryButton>
                        </div>
                    </form>
                </div>
            </div>
            <button style={{ display: 'none' }} type="button" id='btnNewProfesionalModal' data-toggle="modal" data-target="#newProfesionalModal"></button>
        </div>
    )
}

export default NewProfesional