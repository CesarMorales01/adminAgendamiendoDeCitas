import React from 'react'
import Pagination from '../Product/Pagination'

const TablaCars = (params) => {


    return (
        <div style={{ marginTop: '0.5em' }} className='table-responsive'>
            <table className="table table-striped roundedTable">
                <thead className='navBarFondo align-middle'>
                    <tr>
                        <th style={{ textAlign: 'center' }} scope="col"></th>
                        <th style={{ textAlign: 'center' }} scope="col">Tipo</th>
                        <th style={{ textAlign: 'center' }} scope="col">Placa</th>
                        <th style={{ textAlign: 'center' }} scope="col">Marca</th>
                        <th style={{ textAlign: 'center' }} scope="col">Año</th>
                        <th style={{ textAlign: 'center' }} scope="col">Modelo</th>
                        <th style={{ textAlign: 'center' }} scope="col">Color</th>
                        <th style={{ textAlign: 'center' }} scope="col">Cliente</th>
                    </tr>
                </thead>
                <tbody>
                    {params.noCars ?
                        <tr style={{ marginTop: '1.5em' }} className='container'><td colSpan='7'>No se han encontrado resultados....</td></tr>
                        :
                        params.cars.map((item, index) => {
                            return (
                                <tr key={index}>
                                    <th scope="row">
                                        <a href={route('car.editar', [item.id, 'nothing'])} className='btn btn-sm' style={{ cursor: 'pointer', backgroundColor: '#127b38' }} >
                                            <svg style={{ padding: '0.2em' }} xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-pencil-fill rounded" viewBox="0 0 16 16">
                                                <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708l-3-3zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207l6.5-6.5zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.499.499 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11l.178-.178z" />
                                            </svg>
                                        </a>
                                    </th>
                                    <td >
                                        {item.tipo_vehiculo}
                                    </td>
                                    <td >
                                        {item.placa}
                                    </td>
                                    <td >
                                        {item.marca}
                                    </td>
                                    <td >
                                        {item.year}
                                    </td>
                                    <td >
                                        {item.modelo}
                                    </td>
                                    <td >
                                        {item.color}
                                    </td>
                                    <td >
                                        {item.cliente.nombre}
                                    </td>
                                </tr>
                            )
                        })}
                </tbody>
            </table>
            {params.noCars ?
                ''
                :
                <Pagination class="mt-6" links={params.pagination} />
            }
        </div>
    )
}

export default TablaCars