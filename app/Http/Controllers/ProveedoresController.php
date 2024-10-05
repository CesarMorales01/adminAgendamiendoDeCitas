<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\GlobalVars;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use stdClass;
use App\Traits\MetodosGenerales;

class ProveedoresController extends Controller
{
    public $global = null;
    use MetodosGenerales;

    public function __construct()
    {
        $this->global = new GlobalVars();
    }

    public function listar($state)
    {
        $auth = Auth()->user();
        $globalVars = $this->global->getGlobalVars();
        $globalVars->info = DB::table('info_pagina')->first();
        $estado = '';
        if ($state != 'nothing') {
            $estado = $state;
        }
        $date = now();
        $año = date_format($date, "Y");
        $mes = date_format($date, "m");
        $ffinal = date("Y-m-t", strtotime($date));
        $finicial = $año . "-" . $mes . "-" . '01';
        $getProveedores = DB::table('proveedores')->get();
        $totalProveedores = 0;
        foreach ($getProveedores as $prov) {
            //Productos en inventario
            $getProdsEnInventario = DB::table('productos')->whereBetween('updated', [$finicial, $ffinal])->where('proveedor', '=', $prov->id)->get();
            $totalProvedor = 0;
            $totalEnInventario = 0;
            $totalProducto = 0;
            //For each productos en inventario
            foreach ($getProdsEnInventario as $prod) {
                if ($prod->cantidad != null && $prod->costo != null) {
                    $totalProducto = intval($prod->cantidad) * intval($prod->costo);
                    $totalProvedor = $totalProvedor + $totalProducto;
                }
                $prod->totalProducto = $totalProducto;
                $totalEnInventario = $totalEnInventario + $totalProducto;
            }
            $prov->totalProductosEnInventario = $totalEnInventario;
            $prov->productosEnInventario = $getProdsEnInventario;
            //Productos vendidos
            $getVentas = app(ShoppingController::class)->listByDate($finicial, $ffinal)->original;
            $totalProveedorProdsVendidos = 0;
            //For each productos vendidos -- listaProductosVendidos
            $listaProductosVendidosByProveedor = [];
            foreach ($getVentas as $venta) {
                $totalProdsEstaVenta = 0;
                $validarProveedorEstaVenta = null;
                foreach ($venta->listaProductos as $producto) {
                    if ($producto->proveedor == $prov->id) {
                        $validarProveedorEstaVenta = true;
                        if ($producto->costo != null) {  
                            $totalProductoVendido = intval($producto->cantidad) * intval($producto->costo);
                            $totalProdsEstaVenta = $totalProdsEstaVenta + $totalProductoVendido;
                            $totalProvedor = $totalProvedor + $totalProductoVendido;
                            $totalProveedorProdsVendidos = $totalProveedorProdsVendidos + $totalProductoVendido;
                            $producto->totalProveedorProdsVendidos = $totalProveedorProdsVendidos;
                        }
                    }
                }
                if ($validarProveedorEstaVenta) {
                    $listaProductosVendidosByProveedor[] = $venta;
                }
                $venta->totalProdsEstaVenta = $totalProdsEstaVenta;
            }
            $prov->productosVendidos = $listaProductosVendidosByProveedor;
            $prov->totalProductosVendidos = $totalProveedorProdsVendidos;
            $prov->totalProveedor = $totalProvedor;
            $totalProveedores = $totalProveedores + $totalProvedor;
        }
        $proveedores = new stdClass();
        $proveedores->proveedores = $getProveedores;
        $proveedores->totalProveedores = $totalProveedores;
        $token = csrf_token();
        return Inertia::render('Provider/Providers', compact('auth', 'globalVars', 'estado', 'token', 'proveedores'));
    }

    public function listByDate($finicial, $ffinal)
    {
        $getProveedores = DB::table('proveedores')->get();
        $totalProveedores = 0;
        foreach ($getProveedores as $prov) {
            //Productos en inventario
            $getProdsEnInventario = DB::table('productos')->whereBetween('updated', [$finicial, $ffinal])->where('proveedor', '=', $prov->id)->get();
            $totalProvedor = 0;
            $totalEnInventario = 0;
            $totalProducto = 0;
            //For each productos en inventario
            foreach ($getProdsEnInventario as $prod) {
                if ($prod->cantidad != null && $prod->costo != null) {
                    $totalProducto = intval($prod->cantidad) * intval($prod->costo);
                    $totalProvedor = $totalProvedor + $totalProducto;
                }
                $prod->totalProducto = $totalProducto;
                $totalEnInventario = $totalEnInventario + $totalProducto;
            }
            $prov->totalProductosEnInventario = $totalEnInventario;
            $prov->productosEnInventario = $getProdsEnInventario;
            //Productos vendidos
            $getVentas = app(ShoppingController::class)->listByDate($finicial, $ffinal)->original;
            $totalProveedorProdsVendidos = 0;
            //For each productos vendidos -- listaProductosVendidos
            $listaProductosVendidosByProveedor = [];
            foreach ($getVentas as $venta) {
                $totalProdsEstaVenta = 0;
                $validarProveedorEstaVenta = null;
                foreach ($venta->listaProductos as $producto) {
                    if ($producto->proveedor == $prov->id) {
                        $validarProveedorEstaVenta = true;
                        if ($producto->costo != null) {
                            $totalProductoVendido = intval($producto->cantidad) * intval($producto->costo);
                            $totalProdsEstaVenta = $totalProdsEstaVenta + $totalProductoVendido;
                            $totalProvedor = $totalProvedor + $totalProductoVendido;
                            $totalProveedorProdsVendidos = $totalProveedorProdsVendidos + $totalProductoVendido;
                            $producto->totalProveedorProdsVendidos = $totalProveedorProdsVendidos;
                        }
                    }
                }
                if ($validarProveedorEstaVenta) {
                    $listaProductosVendidosByProveedor[] = $venta;
                }
                $venta->totalProdsEstaVenta = $totalProdsEstaVenta;
            }
            $prov->productosVendidos = $listaProductosVendidosByProveedor;
            $prov->totalProductosVendidos = $totalProveedorProdsVendidos;
            $prov->totalProveedor = $totalProvedor;
            $totalProveedores = $totalProveedores + $totalProvedor;
        }
        $proveedores = new stdClass();
        $proveedores->proveedores = $getProveedores;
        $proveedores->totalProveedores = $totalProveedores;
        return response()->json($proveedores, 200, []);
    }

    public function index()
    {
        //
    }

    public function create()
    {
        //
    }

    public function store(Request $request)
    {
        DB::table('proveedores')->insert([
            'nombre' => $request->nombre,
            'descripcion' => $request->descripcion,
            'direccion' => $request->direccion,
            'telefono' => $request->telefono,
            'email' => $request->email,
        ]);
        return Redirect::route('provider.list', 'Nuevo proveedor registrado!');
    }

    public function show(string $id)
    {
        // Borrar aca porque method in react no se puede editar....
        DB::table('proveedores')->where('id', '=', $id)->delete();
        return Redirect::route('provider.list', 'Proveedor eliminado!');
    }

    public function edit(string $id, Request $request)
    {
        DB::table('proveedores')->where('id', $id)->update([
            'nombre' => $request->nombre,
            'descripcion' => $request->descripcion,
            'direccion' => $request->direccion,
            'telefono' => $request->telefono,
            'email' => $request->email,
        ]);
        return Redirect::route('provider.list', 'Proveedor modificado!');
    }

    public function update(Request $request, string $id)
    {
        //
    }

    public function destroy(string $id)
    {
        //
    }
}
