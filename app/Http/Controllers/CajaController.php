<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\GlobalVars;
use App\Traits\MetodosGenerales;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Redirect;
use stdClass;

class CajaController extends Controller
{
    public $global = null;
    use MetodosGenerales;

    public function __construct()
    {
        $this->global = new GlobalVars();
    }

    public function index()
    {    
    }

    public function create()
    {
    }

    public function store(Request $request)
    {
        DB::table('movimientos_caja')->insert([
            'fecha' => $request->fecha,
            'tipo_movimiento' => $request->tipo_movimiento,
            'valor' => $request->valor,
            'observacion' => $request->comentario,
            'usuario' => Auth()->user()->id
        ]);
        $resp = "Retiro de caja registrado!";;
        if ($request->tipo_movimiento == 1) {
            $resp = "Ingreso a caja registrado!";
        }
        return Redirect::route('caja.edit', $resp);
    }

    public function show(string $fecha)
    {
        //obtener movimientos caja por fecha
        return response()->json($this->moveCajaByDate($fecha), 200, []);
    }

    public function edit(string $mensaje)
    {
        //Mostrar lista caja
        $auth = Auth()->user();
        $globalVars = $this->global->getGlobalVars();
        $globalVars->info = DB::table('info_pagina')->first();
        $token = csrf_token();
        $objetoMove = $this->moveCajaByDate($this->getFechaHoy());
        return Inertia::render('Caja/Caja', compact('mensaje', 'auth', 'globalVars', 'token', 'objetoMove'));
    }

    public function moveCajaByDate($fecha)
    {
        $objeto = new stdClass();
        $listaCaja = DB::table('movimientos_caja')->whereBetween('fecha', [$fecha, $fecha])->orderBy('id', 'desc')->get();
        foreach($listaCaja as $lista){
            $lista->usuario=DB::table('users')->where('id', '=', $lista->usuario)->first();
        }
        $objeto->listaCaja = $listaCaja;
        //Total ingresos caja
        $getTotalIngresosCaja = DB::table('movimientos_caja')->select(DB::raw('SUM(valor) AS suma'))->where('tipo_movimiento', '=', 'Ingreso')->whereBetween('fecha', [$fecha, $fecha])->first();
        $objeto->totalIngresosCaja = $getTotalIngresosCaja->suma;
        if($objeto->totalIngresosCaja==null){
            $objeto->totalIngresosCaja=0;
        }
        //Total Retiros caja
        $getTotalRetirosCaja = DB::table('movimientos_caja')->select(DB::raw('SUM(valor) AS suma'))->where('tipo_movimiento', '=', 'Retiro')->whereBetween('fecha', [$fecha, $fecha])->first();
        $objeto->totalRetirosCaja = $getTotalRetirosCaja->suma;
        if($objeto->totalRetirosCaja==null){
            $objeto->totalRetirosCaja=0;
        }
        //ventas en efectivo
        $totalVentasEfectivo = DB::table('lista_compras')->select(DB::raw('SUM(total_compra) AS suma'))->where('medio_de_pago', '=', 'Efectivo')->whereBetween('fecha', [$fecha, $fecha])->first();
        $objeto->ventasEfectivo = $totalVentasEfectivo->suma;
        if($objeto->ventasEfectivo==null){
            $objeto->ventasEfectivo=0;
        }
        //ventas pago electronico
        $totalVentasElectro = DB::table('lista_compras')->select(DB::raw('SUM(total_compra) AS suma'))->where('medio_de_pago', '=', 'Pago electronico')->whereBetween('fecha', [$fecha, $fecha])->first();
        $objeto->ventasPagoElectronico = $totalVentasElectro->suma;
        if($objeto->ventasPagoElectronico==null){
            $objeto->ventasPagoElectronico=0;
        }
        return $objeto;
    }

    public function borrar($id){
       DB::table('movimientos_caja')->where('id', '=', $id)->delete();
       return Redirect::route('caja.edit', 'Registro eliminado!');
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
