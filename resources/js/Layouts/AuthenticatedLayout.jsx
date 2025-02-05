import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import React, { useState, useEffect } from 'react'

export default function Authenticated({ user, header, children, globalVars }) {
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false)

    return (
        <div className="min-h-screen bg-gray-100">
            <nav style={{ backgroundColor: globalVars.info == null ? 'gray' : globalVars.info.color_pagina }} >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-4">
                    <div className="flex justify-between h-16">
                        <div className="flex">
                            <div className="shrink-0 flex items-center">
                                <a className='tamañoLetraNav inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md bg-white hover:text-gray-700 focus:outline-none transition ease-in-out duration-150' href={route('dashboard')} style={{ color: globalVars.info == null ? 'black' : globalVars.info.color_letra_navbar, cursor: 'pointer' }} > <i style={{ marginRight: '0.2em' }} className="fas fa-home fa-1x"></i>Home</a>
                            </div>
                            <div className="hidden space-x-8 md:-my-px md:ml-10 md:flex ">
                                <div className='rounded' style={{ zIndex: '9', marginTop: '1em', borderRadius: '15px' }} >
                                    <button style={{ color: globalVars.info == null ? 'black' : globalVars.info.color_letra_navbar, fontSize: '1.2em' }} className="peer inline-flex items-center px-3 py-2 leading-4 font-medium rounded-md focus:outline-none transition ease-in-out duration-150">
                                        Repuestos-servicios
                                        <svg className="ml-2 -mr-0.5 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" >
                                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                    <div style={{ borderRadius: '15px' }} className="hidden peer-hover:flex hover:flex flex-col bg-white drop-shadow-lg">
                                        <a style={{ color: globalVars.info == null ? 'black' : globalVars.info.color_letra_navbar, padding: '0.5em' }} className="tamañoLetraNav btn btn-outline-light text-left hover:bg-gray-200" href={route('product.index')} active={route().current('product.index')}>Repuestos y servicios</a>
                                        <a style={{ color: globalVars.info == null ? 'black' : globalVars.info.color_letra_navbar, padding: '0.5em' }} className="tamañoLetraNav btn btn-outline-light text-left hover:bg-gray-200" href={route('category.index')} active={route().current('category.index')}>Categorias</a>
                                    </div>
                                </div>
                                <NavLink colorLetra={globalVars.info == null ? 'black' : globalVars.info.color_letra_navbar} href={route('shopping.index')} active={route().current('shopping.index')}>
                                    Ventas
                                </NavLink>
                                <NavLink colorLetra={globalVars.info == null ? 'black' : globalVars.info.color_letra_navbar} href={route('customer.list', 'nothing')} active={route().current('customer.list')}>
                                    Clientes
                                </NavLink>
                                <NavLink colorLetra={globalVars.info == null ? 'black' : globalVars.info.color_letra_navbar} href={route('spend.list', 'nothing')} active={route().current('spend.list')}>
                                    Gastos
                                </NavLink>
                                <NavLink colorLetra={globalVars.info == null ? 'black' : globalVars.info.color_letra_navbar} href={route('provider.list', 'nothing')} active={route().current('provider.list')}>
                                    Proveedores
                                </NavLink>
                                <NavLink colorLetra={globalVars.info == null ? 'black' : globalVars.info.color_letra_navbar} href={route('calendar.index')} active={route().current('calendar.index')}>
                                    Agenda
                                </NavLink>
                                <NavLink colorLetra={globalVars.info == null ? 'black' : globalVars.info.color_letra_navbar} href={route('report.list', 'nothing')} active={route().current('report.list')}>
                                    Informes
                                </NavLink>

                            </div>
                        </div>

                        <div className="hidden md:flex md:items-center md:ml-6">
                            <div className="ml-3 relative">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <span className="inline-flex rounded-md">
                                            <button style={{ color: globalVars.info == null ? 'black' : globalVars.info.color_letra_navbar }}
                                                type="button"
                                                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md bg-white hover:text-gray-700 focus:outline-none transition ease-in-out duration-150"
                                            >
                                                {user.name}

                                                <svg
                                                    className="ml-2 -mr-0.5 h-4 w-4"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            </button>
                                        </span>
                                    </Dropdown.Trigger>

                                    <Dropdown.Content>
                                        <Dropdown.Link colorLetra={globalVars.info == null ? 'black' : globalVars.info.color_letra_navbar} href={route('profile.edit')}>Cuenta</Dropdown.Link>
                                        <Dropdown.Link colorLetra={globalVars.info == null ? 'black' : globalVars.info.color_letra_navbar} href={route('logout')} method="post" as="button">
                                            Salir
                                        </Dropdown.Link>
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>
                        </div>

                        <div className="-mr-2 flex items-center md:hidden">
                            <button style={{ backgroundColor: 'white' }}
                                onClick={() => setShowingNavigationDropdown((previousState) => !previousState)}
                                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 focus:text-gray-500 transition duration-150 ease-in-out"
                            >
                                <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                                    <path
                                        className={!showingNavigationDropdown ? 'inline-flex' : 'hidden'}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                    <path
                                        className={showingNavigationDropdown ? 'inline-flex' : 'hidden'}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
                <div style={{ marginLeft: '0.5em' }} className={(showingNavigationDropdown ? 'block' : 'hidden') + ' md:hidden'}>
                    <div className="pt-2 pb-3 space-y-1">
                        <NavLink colorLetra={globalVars.info == null ? 'black' : globalVars.info.color_letra_navbar} href={route('product.index')} active={route().current('product.index')}>
                            Repuestos y servicios
                        </NavLink>
                    </div>
                    <div className="pt-2 pb-3 space-y-1">
                        <NavLink colorLetra={globalVars.info == null ? 'black' : globalVars.info.color_letra_navbar} href={route('shopping.index')} active={route().current('shopping.index')}>
                            Ordenes y ventas
                        </NavLink>
                    </div>
                    <div className="pt-2 pb-3 space-y-1">
                        <NavLink colorLetra={globalVars.info == null ? 'black' : globalVars.info.color_letra_navbar} href={route('customer.list', 'nothing')} active={route().current('customer.list')}>
                            Clientes
                        </NavLink>
                    </div>
                    <div className="pt-2 pb-3 space-y-1">
                        <NavLink colorLetra={globalVars.info == null ? 'black' : globalVars.info.color_letra_navbar} href={route('car.list', 'nothing')} active={route().current('income.list')}>
                            Vehiculos
                        </NavLink>
                    </div>
                    <div className="pt-2 pb-3 space-y-1">
                        <NavLink colorLetra={globalVars.info == null ? 'black' : globalVars.info.color_letra_navbar} href={route('spend.list', 'nothing')} active={route().current('spend.list')}>
                            Gastos
                        </NavLink>
                    </div>
                    <div className="pt-2 pb-3 space-y-1">
                        <NavLink colorLetra={globalVars.info == null ? 'black' : globalVars.info.color_letra_navbar} href={route('provider.list', 'nothing')} active={route().current('provider.list')}>
                            Proveedores
                        </NavLink>
                    </div>
                    <div className="pt-2 pb-3 space-y-1">
                        <NavLink colorLetra={globalVars.info == null ? 'black' : globalVars.info.color_letra_navbar} href={route('calendar.index')} active={route().current('calendar.index')}>
                            Agenda
                        </NavLink>
                    </div>
                    <div className="pt-2 pb-3 space-y-1">
                        <NavLink colorLetra={globalVars.info == null ? 'black' : globalVars.info.color_letra_navbar} href={route('report.list', 'nothing')} active={route().current('report.list')}>
                            Informes
                        </NavLink>
                    </div>

                    <div className="pt-4 pb-1 border-t border-gray-200">
                        <Dropdown>
                            <Dropdown.Trigger>
                                <span className="inline-flex rounded-md">
                                    <button
                                        type="button"
                                        className="tamañoLetraNav inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-500 bg-white hover:text-gray-700 focus:outline-none transition ease-in-out duration-150"
                                    >
                                        {user.name}

                                        <svg
                                            className="ml-2 -mr-0.5 h-4 w-4"
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    </button>
                                </span>
                            </Dropdown.Trigger>

                            <Dropdown.Content>
                                <Dropdown.Link colorLetra={globalVars.info == null ? 'black' : globalVars.info.color_letra_navbar} href={route('profile.edit')}>Cuenta</Dropdown.Link>
                                <Dropdown.Link colorLetra={globalVars.info == null ? 'black' : globalVars.info.color_letra_navbar} href={route('logout')} method="post" as="button">
                                    Salir
                                </Dropdown.Link>
                            </Dropdown.Content>
                        </Dropdown>
                    </div>
                </div>
            </nav>

            {header && (
                <header className="bg-white shadow">
                    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">{header}</div>
                </header>
            )}

            <main>{children}</main>

        </div>
    );
}
