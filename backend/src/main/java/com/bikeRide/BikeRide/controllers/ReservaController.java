package com.bikeRide.BikeRide.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.bikeRide.BikeRide.models.ReservaModel;
import com.bikeRide.BikeRide.services.ReservaService;


@RestController
@RequestMapping("/api/reservas")
@CrossOrigin(origins = "*") // permite que tu frontend acceda al backend


public class ReservaController {

    @Autowired
    private  ReservaService reservaService;


    // Crear reserva
    @PostMapping
    public ReservaModel crearReserva(@RequestBody ReservaModel reserva) {
        return reservaService.crearReserva(reserva);
    }

    // Cancelar (eliminar lógicamente)
    @PutMapping("/{id}/cancelar")
    public ReservaModel cancelarReserva(@PathVariable Long id) {
        return reservaService.cancelarReserva(id);
    }

     // Ver todas las reservas
    @GetMapping
    public List<ReservaModel> obtenerTodasLasReservas() {
        return reservaService.obtenerTodasLasReservas();
    }

    
}
