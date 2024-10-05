<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use App\Models\GlobalVars;
use App\Traits\MetodosGenerales;
use Illuminate\Support\Facades\Redirect;
use stdClass;

class CarController extends Controller
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
        $cars = DB::table('vehiculos')->orderBy('id', 'asc')->paginate(100);
        foreach ($cars as $car) {
            $car->cliente = app(ClientesController::class)->getClienteById($car->cliente);
        }
        $estado = '';
        if ($state != 'nothing') {
            $estado = $state;
        }
        return Inertia::render('Cars/Cars', compact('auth', 'globalVars', 'estado', 'cars'));
    }

    public function index() {}

    public function create()
    {
        $auth = Auth()->user();
        $car = ['id' => ''];
        $clientes = DB::table('clientes')->get();
        $token = csrf_token();
        $globalVars = $this->global->getGlobalVars();
        $globalVars->info = DB::table('info_pagina')->first();
        $estado = '';
        return Inertia::render('Cars/NewCar', compact('auth', 'car', 'clientes', 'globalVars', 'token', 'estado'));
    }

    public function store(Request $request)
    {
        DB::table('vehiculos')->insert([
            'tipo_vehiculo' => $request->tipo,
            'placa' => $request->placa,
            'marca' => $request->marca,
            'year' => $request->year,
            'modelo' => $request->modelo,
            'color' => $request->color,
            'cliente' => $request->cliente
        ]);
        return Redirect::route('car.list', 'Vehiculo registrado!');
    }

    public function show(string $placa)
    {
        return response()->json(DB::table('vehiculos')->where('placa', '=', $placa)->first(), 200, []);
    }

    public function editarCar($id, $state)
    {
        $auth = Auth()->user();
        $car = DB::table('vehiculos')->where('id', '=', $id)->first();
        $car->cliente = app(ClientesController::class)->getClienteById($car->cliente);
        $clientes = DB::table('clientes')->get();
        $globalVars = $this->global->getGlobalVars();
        $globalVars->info = DB::table('info_pagina')->first();
        $token = csrf_token();
        $estado = '';
        if ($state != 'nothing') {
            $estado = $state;
        }
        return Inertia::render('Cars/NewCar', compact('auth', 'car', 'clientes', 'globalVars', 'token', 'estado'));
    }

    public function edit(string $id)
    {
        // Eliminar en este metodo porque no he conseguido reescribir el method get por delete en el form react....

        // $validarEliminar = DB::table('lista_compras')->where('cliente', '=', $id)->first();
        $validarEliminar = null;
        if ($validarEliminar != null) {
            $estado = "¡No puedes eliminar este vehiculo porque tiene ordenes y/o servicios!";
        } else {
            DB::table('vehiculos')->where('id', '=', $id)->delete();
            $estado = "¡Vehiculo eliminado!";
        }
        return Redirect::route('car.list', $estado);
    }

    public function actualizar(Request $request, string $id)
    {
        $update = DB::table('vehiculos')->where('id', '=', $id)->update([
            'tipo_vehiculo' => $request->tipo,
            'placa' => $request->placa,
            'marca' => $request->marca,
            'year' => $request->year,
            'modelo' => $request->modelo,
            'color' => $request->color,
            'cliente' => $request->cliente
        ]);
        return Redirect::route('car.editar', [$id, 'Vehiculo actualizado!']);
    }

    public function allcars()
    {
        return response()->json(DB::table('vehiculos')->get(), 200, []);
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
